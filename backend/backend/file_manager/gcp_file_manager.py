from google.cloud import storage
import os
from datetime import datetime
from flask import send_file
import io

class GcpFileManager():
    def __init__(self, bucket, data_dir):
        print(bucket)
        self.bucket_name = bucket
        self.data_dir = data_dir
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(bucket)

    def saveFile(self, file, u_id):
        """Uploads a file to the bucket."""
        timestamp = str(datetime.now()).replace(
            ':', '.').replace(' ', '.').replace('-', '.')
        destination_blob_name = f'{self.data_dir}/user_{u_id}/{timestamp}_{file.filename}'
        blob = self.bucket.blob(destination_blob_name)
        blob.upload_from_file(file)
        print(
            "File {} uploaded to {}.".format(
                file, destination_blob_name
            )
        )

        return f'{self.data_dir}/{destination_blob_name}'

    def sendFile(self, path, filename):
        blob = self.bucket.blob(path)
        contents = blob.download_as_bytes()
        file = io.BytesIO()
        file.write(contents)
        file.seek(0)
        print(
            "Downloaded storage object {} from bucket {}.".format(
                path, self.bucket_name
            )
        )
        return send_file(file, as_attachment=True, attachment_filename=filename)
