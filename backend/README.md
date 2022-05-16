# LTC Managment Portal

## Backend 
Directoy structure
```.
├── .env
├── README.md
├── app.standard.yaml
├── backend
│   ├── __init__.py
│   ├── analyse.py
│   ├── auth.py
│   ├── email_manager
│   │   ├── __init__.py
│   │   ├── background_email_manager.py
│   │   └── email_manager.py
│   ├── file_manager
│   │   ├── __init__.py
│   │   ├── encoded_file_manager.py
│   │   ├── gcp_file_manager.py
│   │   └── local_file_manager.py
│   ├── flask_profiler
│   │   ├── __init__.py
│   │   ├── flask_profiler.py
│   ├── notifications.py
│   ├── role_manager.py
│   ├── ta_manager.py
│   └── user_manager.py
├── db_init.py
├── gcp_db_init.py
├── main.py
├── requirements.txt
├── serve.ps1
└── serve.sh
```
## This code was developed using python3.9

## Run and deploy

- First, install python requirements using the command  ```pip3 install -r requirements.txt```
- Go to dashboard directory and run ```npm install``` to install node dependencies.
- Run ```./build.sh`` to build the code.
- Go to backend/ directory and run ./serve.sh to start server.

## .env file format:

### Backend .env variables:

```
DEMO_LOGIN
GCP_PASS
JWT_SECRET 
POSTGRES_PATH
client_id 
client_secret
FRONTEND_URL
BACKEND_URL 
EMAIL_APP_PASSWORD
EMAIL_ID 
ENABLE_EMAIL 
```

### frontend .env

```
REACT_APP_GOOGLE_CLIENT_ID 
REACT_APP_BASE_BACKEND_URL
```