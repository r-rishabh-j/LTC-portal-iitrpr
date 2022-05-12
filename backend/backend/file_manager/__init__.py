# import os
# from .local_file_manager import LocalFileManager
# from .gcp_file_manager import GcpFileManager
# from .encoded_file_manager import EncodedFileManager

# def create_file_manager(upload_folder):
#     if os.environ.get("GCLOUD", False) == 'true':
#         print('Connected to Google Cloud Storage')
#         return GcpFileManager(os.environ.get("GCP_BUCKET"), upload_folder)
#     else:
#         return EncodedFileManager((upload_folder))
