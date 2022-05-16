├── App.css
├── App.js
├── Components
│   ├── Body
│   │   └── Dashboard
│   │       ├── Accounts
│   │       │   ├── AccountsPage.js
│   │       │   ├── AccountsSectionForm.js
│   │       │   ├── AccountsSectionTAForm.js
│   │       │   ├── AdvancePaymentDialogBox.js
│   │       │   ├── AdvancePayment.js
│   │       │   ├── Past.js
│   │       │   ├── Pending.js
│   │       │   └── TAPayments.js
│   │       ├── Admin
│   │       │   ├── AddDepartment.js
│   │       │   ├── AddUserCsv.js
│   │       │   ├── AddUser.js
│   │       │   ├── add_user.png
│   │       │   ├── add_users.png
│   │       │   ├── AdminPage.js
│   │       │   ├── analytics.png
│   │       │   ├── Charts.js
│   │       │   ├── Database.js
│   │       │   ├── Deparments.js
│   │       │   ├── DropUserForm.js
│   │       │   ├── DropUser.js
│   │       │   ├── drop_user.png
│   │       │   ├── EditUserForm.js
│   │       │   ├── EditUser.js
│   │       │   ├── edit_user.png
│   │       │   ├── LTCApplications.js
│   │       │   ├── TAApplications.js
│   │       │   ├── Users.js
│   │       │   └── view_users.png
│   │       ├── Audit
│   │       │   └── AuditPage.js
│   │       ├── ButtonDropDown.js
│   │       ├── CreateApplication.js
│   │       ├── DataGridStyles.js
│   │       ├── DataGridToolbar.js
│   │       ├── DeanFA
│   │       │   └── DeanPage.js
│   │       ├── DialogBox.js
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
│   │       ├── Profile
│   │       │   ├── ProfilePage.js
│   │       │   └── SignatureUploadDialog.js
│   │       ├── Registrar
│   │       │   └── RegistrarPage.js
│   │       ├── ReviewBox.js
│   │       ├── ReviewUserForm.js
│   │       ├── SectionHead
│   │       │   └── SectionHeadPage.js
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

The directory src contains the above directory structure. Body/Dashboard contains the folders of the various user views and the files containing components common to all the views(conditional rendering based). The Header directory conatins the components for the Navbar and Navtabs. The Utilities folder conatins reusable react hook form-material ui components (Form TextFields, DatePicker, Radio Buttons etc.). Login contains Login Page and functionality.