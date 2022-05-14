# -*- coding: utf8 -*-

import functools
import re
import time

from pprint import pprint as pp

import logging

from flask import Blueprint
from flask import jsonify
from flask import request
from ..role_manager import role_required

from . import storage

CONF = {}
collection = None

logger = logging.getLogger("flask-profiler")


def _is_initialized(): return True if CONF else False


class Measurement(object):
    """represents an endpoint measurement"""
    DECIMAL_PLACES = 6

    def __init__(self, name, args, kwargs, method, context=None):
        super(Measurement, self).__init__()
        self.context = context
        self.name = name
        self.method = method
        self.args = args
        self.kwargs = kwargs
        self.startedAt = 0
        self.endedAt = 0
        self.elapsed = 0

    def __json__(self):
        return {
            "name": self.name,
            "args": self.args,
            "kwargs": self.kwargs,
            "method": self.method,
            "startedAt": self.startedAt,
            "endedAt": self.endedAt,
            "elapsed": self.elapsed,
            "context": self.context
        }

    def __str__(self):
        return str(self.__json__())

    def start(self):
        self.startedAt = time.time()

    def stop(self):
        self.endedAt = time.time()
        self.elapsed = round(
            self.endedAt - self.startedAt, self.DECIMAL_PLACES)


def is_ignored(name, conf):
    ignore_patterns = conf.get("ignore", [])
    for pattern in ignore_patterns:
        if re.search(pattern, name):
            return True
    return False


def measure(f, name, method, context=None):
    logger.debug("{0} is being processed.".format(name))
    if is_ignored(name, CONF):
        logger.debug("{0} is ignored.".format(name))
        return f

    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        if 'sampling_function' in CONF and not callable(CONF['sampling_function']):
            raise Exception(
                "if sampling_function is provided to flask-profiler via config, "
                "it must be callable")

        if 'sampling_function' in CONF and not CONF['sampling_function']():
            return f(*args, **kwargs)

        measurement = Measurement(name, args, kwargs, method, context)
        measurement.start()

        try:
            returnVal = f(*args, **kwargs)
        except:
            raise
        finally:
            measurement.stop()
            if CONF.get("verbose", False):
                pp(measurement.__json__())
            collection.insert(measurement.__json__())

        return returnVal

    return wrapper


def wrapHttpEndpoint(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        header =  dict(request.headers.items())
        if header.get('Cookie')!=None:
            header.pop('Cookie')
        context = {
            "url": request.base_url,
            "args": dict(request.args.items()),
            # "form": dict(request.form.items()),
            # "body": request.data.decode("utf-8", "strict"),
            "headers": header,
            "func": request.endpoint,
            "ip": request.remote_addr
        }
        endpoint_name = str(request.url_rule)
        wrapped = measure(f, endpoint_name, request.method, context)
        return wrapped(*args, **kwargs)

    return wrapper


def wrapAppEndpoints(app):
    """
    wraps all endpoints defined in the given flask app to measure how long time
    each endpoints takes while being executed. This wrapping process is
    supposed not to change endpoint behaviour.
    :param app: Flask application instance
    :return:
    """
    for endpoint, func in app.view_functions.items():
        app.view_functions[endpoint] = wrapHttpEndpoint(func)


def profile(*args, **kwargs):
    """
    http endpoint decorator
    """
    if _is_initialized():
        def wrapper(f):
            return wrapHttpEndpoint(f)

        return wrapper
    raise Exception(
        "before measuring anything, you need to call init_app()")


def registerInternalRouters(app):
    """
    These are the endpoints which are used to display measurements in the
    flask-profiler dashboard.

    Note: these should be defined after wrapping user defined endpoints
    via wrapAppEndpoints()
    :param app: Flask application instance
    :return:
    """
    urlPath = CONF.get("endpointRoot", "analytics")

    fp = Blueprint(
        'analytics', __name__,
        url_prefix="/" + urlPath,
        static_folder="static/dist/", static_url_path='/static/dist')

    @fp.route("/".format(urlPath))
    @role_required(role='admin')
    def index():
        return fp.send_static_file("index.html")

    @fp.route("/api/measurements/".format(urlPath))
    @role_required(role='admin')
    def filterMeasurements():
        args = dict(request.args.items())
        measurements = collection.filter(args)
        return jsonify({"measurements": list(measurements)})

    @fp.route("/api/measurements/grouped".format(urlPath))
    @role_required(role='admin')
    def getMeasurementsSummary():
        args = dict(request.args.items())
        measurements = collection.getSummary(args)
        return jsonify({"measurements": list(measurements)})

    @fp.route("/api/measurements/<measurementId>".format(urlPath))
    @role_required(role='admin')
    def getContext(measurementId):
        return jsonify(collection.get(measurementId))

    @fp.route("/api/measurements/timeseries/".format(urlPath))
    @role_required(role='admin')
    def getRequestsTimeseries():
        args = dict(request.args.items())
        return jsonify({"series": collection.getTimeseries(args)})

    @fp.route("/api/measurements/methodDistribution/".format(urlPath))
    @role_required(role='admin')
    def getMethodDistribution():
        args = dict(request.args.items())
        return jsonify({
            "distribution": collection.getMethodDistribution(args)})

    @fp.route("/db/dumpDatabase")
    @role_required(role='admin')
    def dumpDatabase():
        response = jsonify({
            "summary": collection.getSummary()})
        response.headers["Content-Disposition"] = "attachment; filename=dump.json"
        return response

    @fp.route("/db/deleteDatabase")
    @role_required(role='admin')
    def deleteDatabase():
        response = jsonify({
            "status": collection.truncate()})
        return response

    @fp.after_request
    def x_robots_tag_header(response):
        response.headers['X-Robots-Tag'] = 'noindex, nofollow'
        return response

    app.register_blueprint(fp)


def init_app(app):
    global collection, CONF

    try:
        CONF = app.config["flask_profiler"]
    except:
        try:
            CONF = app.config["FLASK_PROFILER"]
        except:
            raise Exception("Supply profiler config")

    if not CONF.get("enabled", False):
        return

    collection = storage.getCollection(CONF.get("storage", {}), app)

    wrapAppEndpoints(app)
    registerInternalRouters(app)


class Profiler(object):
    """ Wrapper for extension. """

    def __init__(self, app=None):
        self._init_app = init_app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        init = functools.partial(self._init_app, app)
        app.before_first_request(init)
