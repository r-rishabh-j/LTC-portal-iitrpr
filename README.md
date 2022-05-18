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
│   ├── notifications.py
│   ├── role_manager.py
│   ├── ta_manager.py
│   └── user_manager.py
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
- Run ```./build.sh``` to build the code.
- Go to backend/ directory and run ./serve.sh to start server.

## .env file format:

### Backend .env variables:

```
DEMO_LOGIN = <"true" or "false", whether to show demo login component for dev>
JWT_SECRET = <"JWT Token secret key">
POSTGRES_PATH = <"URI to postgres server along with driver config">
client_id = <"Google OAuth2.0 client ID">
client_secret = <"Google OAuth2.0 client secret">
FRONTEND_URL = <"frontend URL">
BACKEND_URL = <"backend URL">
EMAIL_APP_PASSWORD = <"Email App Password">
EMAIL_ID = "email ID for sending email"
ENABLE_EMAIL = "whether to enable email notifications"
```

### frontend .env

```
REACT_APP_GOOGLE_CLIENT_ID = <"Google OAuth2.0 client ID">
REACT_APP_BASE_BACKEND_URL = <"backend URL">
```

Frontend structure

```
├── App.css
├── App.js
├── Components
│   ├── Body
│   │   └── Dashboard
│   │       ├── SectionHead
│   │       │   └── SectionHeadPage.js
│   │       ├── Accounts
│   │       │   ├── AccountsPage.js
│   │       │   ├── AccountsSectionForm.js
│   │       │   ├── AccountsSectionTAForm.js
│   │       │   ├── AdvancePaymentDialogBox.js
│   │       │   ├── AdvancePayment.js
│   │       │   ├── Past.js
│   │       │   ├── Pending.js
│   │       │   └── TAPayments.js
│   │       ├── Establishment
│   │       │   ├── EstablishmentPage.js
│   │       │   ├── EstablishmentSectionForm.js
│   │       │   ├── OfficeOrderText.js
│   │       │   ├── Past.js
│   │       │   ├── PastTaApplications.js
│   │       │   ├── Pending.js
│   │       │   ├── PendingTAApplications.js
│   │       │   ├── PrintOfficeOrder.js
│   │       │   ├── Review.js
│   │       │   ├── UploadDialogBox.js
│   │       │   ├── UploadDialogBoxStyles.js
│   │       │   ├── UploadOfficeOrder.js
│   │       │   └── UploadTAOfficeOrder.js
│   │       ├── Audit
│   │       │   └── AuditPage.js
│   │       ├── DeanFA
│   │       │   └── DeanPage.js
│   │       ├── Registrar
│   │       │   └── RegistrarPage.js
│   │       ├── Admin
│   │       │   ├── AdminPage.js
│   │       │   ├── AddDepartment.js
│   │       │   ├── AddUserCsv.js
│   │       │   ├── AddUser.js
│   │       │   ├── DropUser.js
│   │       │   ├── DropUserForm.js
│   │       │   ├── EditUserForm.js
│   │       │   ├── EditUser.js
│   │       │   ├── Charts.js
│   │       │   ├── Database.js
│   │       │   ├── Users.js
│   │       │   ├── LTCApplications.js
│   │       │   ├── TAApplications.js
│   │       │   ├── Deparments.js
│   │       │   ├── add_user.png
│   │       │   ├── add_users.png
│   │       │   ├── drop_user.png
│   │       │   ├── edit_user.png
│   │       │   ├── analytics.png
│   │       │   └── view_users.png
│   │       ├── Profile
│   │       │   ├── ProfilePage.js
│   │       │   └── SignatureUploadDialog.js
│   │       ├── ButtonDropDown.js
│   │       ├── CreateApplication.js
│   │       ├── DataGridStyles.js
│   │       ├── DataGridToolbar.js
│   │       ├── DialogBox.js
│   │       ├── FormStyles.js
│   │       ├── Home.js
│   │       ├── iitrpr_logo.png
│   │       ├── LoadingButton.js
│   │       ├── Logout.js
│   │       ├── LTCforTA.js
│   │       ├── Notifications.js
│   │       ├── PastApplications.js
│   │       ├── PastTaApplications.js
│   │       ├── PrintForm.js
│   │       ├── PrintTAForm.js
│   │       ├── ReviewBox.js
│   │       ├── ReviewUserForm.js
│   │       ├── TADialogBox.js
│   │       └── TAForm.js
│   ├── Header
│   │   ├── cover.jpg
│   │   ├── HeaderComponent.js
│   │   ├── HeaderStyles.js
│   │   ├── Navbar.js
│   │   ├── Navtabs
│   │   │   ├── avatar.png
│   │   │   ├── Notification.js
│   │   │   └── Profile.js
│   │   ├── SideNavData.js
│   │   └── SideNav.js
│   ├── Login
│   │   ├── GoogleLogin.js
│   │   ├── LoadingPage.js
│   │   ├── Login.js
│   │   ├── LoginStyles.js
│   │   └── useAuthCookie.js
│   └── Utilities
│       ├── EditableInputText.js
│       ├── ExpensesFieldArray.js
│       ├── FieldArrayInput.js
│       ├── FormInputDate.js
│       ├── FormInputDropDown.js
│       ├── FormInputNumber.js
│       ├── FormInputRadio.js
│       ├── FormInputText.js
│       ├── GeneratePDF.js
│       ├── HowTo.js
│       ├── HowToPics
│       │   ├── Client
│       │   │   ├── new_ltc.png
│       │   │   ├── past_ltc.png
│       │   │   ├── past-ta.png
│       │   │   ├── pick_ltc.png
│       │   │   ├── ta-form.png
│       │   │   └── view_ltc.png
│       │   └── upload_sign.png
│       ├── MediaCard.js
│       └── TAFieldArray.js
├── index.css
└── index.js
```
The directory src contains the above directory structure. Body/Dashboard contains the folders of the various user views and the files containing components common to all the views(conditional rendering based). The Header directory conatins the components for the Navbar and Navtabs. The Utilities folder conatins reusable react hook form-material ui components (Form TextFields, DatePicker, Radio Buttons etc.). Login contains Login Page and functionality.