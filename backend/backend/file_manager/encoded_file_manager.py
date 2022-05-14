from werkzeug.utils import secure_filename
from flask import send_file
import base64
import io
import os
from flask import abort

class EncodedFileManager:
    def encodeFile(self, file):
        """
        Return file as byte array
        """
        return file.read()

    def fileAsB64(self, file):
        """
        Return file base64 encoding
        """
        return str(base64.standard_b64encode(file.read()))

    def sendFile(self, file_bytea, filename):
        """
        Send file
        """
        decoded = file_bytea
        file = io.BytesIO()
        file.write(decoded)
        file.seek(0)
        return send_file(file, as_attachment=True, attachment_filename=filename)
    
    def isCorrectFileType(self, filename, types):
        """
        Check if file is of correct type
        """
        _, ext = os.path.splitext(filename)
        if ext.lower() not in types:
            return False
        return True
