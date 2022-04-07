import os
from .file_manager import LocalFileManager
from .gcp_file_manager import GcpFileManager

def create_file_manager(upload_folder):
    if os.environ.get("GCLOUD", False) == 'true':
        print('Connected to Google Cloud Storage')
        return GcpFileManager(os.environ.get("GCP_BUCKET"), upload_folder)
    else:
        return LocalFileManager(os.path.abspath(upload_folder))
