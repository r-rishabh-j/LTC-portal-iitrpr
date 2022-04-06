import shutil
import os
from werkzeug.utils import secure_filename
from flask import send_file

class FileManager():
    def __init__(self, data_dir):
        self.data_dir = data_dir

    def __getNextDirPath(self, user_dir):
        i = 1
        while os.path.exists(os.path.join(user_dir, str(i))):
            i += 1
        return os.path.join(user_dir, str(i))

    def saveFile(self, file,  u_id):
        user_dir = os.path.join(self.data_dir, str(u_id))
        if not os.path.exists(user_dir):
            print("Not exists")
            os.mkdir(user_dir)
        store_dir = self.__getNextDirPath(user_dir)
        os.mkdir(store_dir)
        _, ext = os.path.splitext(file.filename)
        filename = secure_filename(file.filename)
        if filename == '' or filename == None:
            filename = f'upload_{u_id}'+ext
        filepath = os.path.join(store_dir, filename)
        file.save(filepath)
        return filepath

    def sendFile(self, attachment_path, filename):
        abs_path = os.path.abspath(attachment_path)
        return send_file(abs_path, as_attachment=True, attachment_filename=filename)
