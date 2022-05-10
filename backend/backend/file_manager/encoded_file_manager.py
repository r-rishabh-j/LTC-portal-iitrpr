from werkzeug.utils import secure_filename
from flask import send_file
import base64
import io


class EncodedFileManager:
    def encodeFile(self, file):
        return file.read()

    def fileAsB64(self, file):
        return str(base64.standard_b64encode(file.read()))

    def sendFile(self, file_bytea, filename):
        decoded = file_bytea
        file = io.BytesIO()
        file.write(decoded)
        file.seek(0)
        return send_file(file, as_attachment=True, attachment_filename=filename)
