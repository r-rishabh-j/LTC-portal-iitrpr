import shutil
import os
from werkzeug.utils import secure_filename
from flask import send_file
from PIL import Image


class LocalFileManager:
    def __init__(self, data_dir):
        self.data_dir = data_dir+'/data'
        if not os.path.exists(self.data_dir):
            os.mkdir(self.data_dir)
        self.signature_path = data_dir+'/signatures'
        if not os.path.exists(self.signature_path):
            os.mkdir(self.signature_path)

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

    def saveSignature(self, file, u_id):
        _, ext = os.path.splitext(file.filename)
        if (str(ext).lower() not in ['.png', '.jpg', '.jpeg']):
            raise Exception('Invalid File Type!')
        user_signature_dir = os.path.join(self.signature_path, str(u_id))
        if not os.path.exists(user_signature_dir):
            os.mkdir(user_signature_dir)
        for pic in os.listdir(user_signature_dir):
            os.remove(os.path.join(user_signature_dir, pic))
        filepath = os.path.join(user_signature_dir, f'signature_{u_id}'+ext)
        file.save(filepath)
        return filepath

    def sendFile(self, attachment_path, filename):
        abs_path = os.path.abspath(attachment_path)
        print(abs_path)
        f = send_file(abs_path, as_attachment=True,
                      attachment_filename=filename)
        return f
