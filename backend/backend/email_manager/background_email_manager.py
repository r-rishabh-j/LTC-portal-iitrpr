import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
import os


class EmailManager():
    ltc_req_created_msg = """Hello %s,
Your LTC Request, ID %s has been created.
Keep visiting LTC Portal for updates.
"""
    ta_req_created_msg = """Hello %s,
Your TA request, ID %s for LTC Request, ID %s has been created.
Keep visiting LTC Portal for updates.
"""
    decline_msg = """Hello %s,
Your LTC Request, ID %s has been declined.
Visit LTC Portal for more information.
"""
    ta_decline_msg = """Hello %s,
Your TA Request, ID %s for LTC %s has been declined.
Visit LTC Portal for more information.
"""
    approval_msg = """Hello %s,
Your LTC Request, ID %s has been approved and is pending office order generation.
Visit LTC Portal for more information.
"""
    ta_approval_msg = """Hello %s,
Your TA request, ID %s for LTC ID %s has been approved and is pending office order generation.
Visit LTC Portal for more information.
"""
    ltc_office_order_msg = """Hello %s,
Office order for LTC Request ID %s has been generated.
Visit LTC Portal for more information.
"""
    ta_office_order_msg = """Hello %s,
Office order for TA Request ID %s has been generated.
Visit LTC Portal for more information.
"""

    def __init__(self,  enabled=True, queue: dict = None) -> None:
        self.sender_address = os.environ.get('EMAIL_ID')
        self.sender_pass = os.environ.get('EMAIL_APP_PASSWORD')
        self.enabled = enabled
        self.queuing = True if 'queue' in queue.keys() else False
        self.task_queue = None if not self.queuing else queue['queue']

    def __connect(self, override_disabled=False):
        try:
            if self.enabled or override_disabled:
                session = smtplib.SMTP(
                    'smtp.gmail.com', 587)  # use gmail with port
                session.starttls()  # enable security
                # login with mail_id and password
                session.login(self.sender_address, self.sender_pass)
                return session
            else:
                print('Email Disabled.')
                return None
        except:
            if self.enabled or override_disabled:
                print('Not able to create email session')
            return None

    def __sendEmail(self, receiver, subject, message_text):
        if receiver['pref'] == True:
            try:
                if self.enabled:
                    session = self.__connect()
                    if not session:
                        raise Exception('Cannot connect to Mail service')
                    message = MIMEMultipart()
                    message['From'] = self.sender_address
                    message['To'] = receiver['email']
                    # The subject line
                    message['Subject'] = subject
                    # The body and the attachments for the mail
                    message.attach(MIMEText(message_text, 'plain'))
                    # Create SMTP session for sending the mail
                    text = message.as_string()
                    print(text)
                    session.sendmail(self.sender_address,
                                     receiver['email'], text)
                    session.quit()
                else:
                    print('Email Disabled.')
            except Exception as e:
                if self.enabled:
                    print('Not able to create email session', e)

    def sendEmail(self, receiver, subject, message_text):
        if not self.enabled:
            return
        try:
            try:
                rec = {
                    'email': str(receiver.email),
                    'pref': (receiver.email_pref)
                }

                if self.queuing == True:
                    self.task_queue.enqueue(
                        self.__sendEmail, rec, subject, message_text)
                else:
                    self.__sendEmail(rec, subject, message_text)
            except (smtplib.SMTPServerDisconnected, smtplib.SMTPConnectError, smtplib.SMTPSenderRefused) as e:
                print('Email Not Sent', e)
        except Exception as e:
            print('Error in sending mail', e)

    def __sendEmailWithCC(self, receivers, cc, subject, message_text, attachment=None):
        try:
            if self.enabled:
                message = MIMEMultipart()
                message['From'] = self.sender_address
                message['To'] = '' if len(
                    receivers) == 0 else ', '.join(receivers)
                message['Cc'] = '' if len(cc) == 0 else ', '.join(cc)
                # The subject line
                message['Subject'] = subject
                # The body and the attachments for the mail
                message.attach(MIMEText(message_text, 'plain'))
                #   attachment
                file = MIMEApplication(attachment[1], Name=attachment[0])
                file['Content-Disposition'] = f'attachment; filename="{attachment[0]}"'
                message.attach(file)
                session = self.__connect()
                if not session:
                    raise Exception('Cannot connect to Mail service')
                session.sendmail(self.sender_address,
                                 (receivers+cc), message.as_string())
                session.quit()
            else:
                print('Email Disabled.')
        except Exception as e:
            if self.enabled:
                print(e)

    def sendMailWithCC(self, receivers, cc, subject, message_text, attachment=None):
        if not self.enabled:
            return
        try:
            try:
                receive_list = []
                cc_list = []
                for receiver in receivers:
                    if receiver.email_pref:
                        receive_list.append(
                            str(receiver.email)
                        )
                for receiver in cc:
                    if receiver.email_pref:
                        cc_list.append(
                            str(receiver.email),
                        )

                if len(receive_list) == 0 and len(cc_list) == 0:
                    return

                if self.queuing == True:
                    self.task_queue.enqueue(
                        self.__sendEmailWithCC, receive_list, cc_list, subject, message_text, attachment)
                else:
                    self.__sendEmailWithCC(
                        receive_list, cc_list, subject, message_text, attachment)
            except (smtplib.SMTPServerDisconnected, smtplib.SMTPConnectError, smtplib.SMTPSenderRefused) as e:
                print('Email Not Sent', e)
        except Exception as e:
            print('Error in sending mail', e)

    def sendLoginOTP(self, receiver, link):
        login_msg = """Hello %s,
Login URL for LTC Portal, IIT Ropar is given below.

%s

URL will expire in 2 minutes.
IMPORTANT: Do not share this URL with anybody!
"""
        try:
            session = self.__connect(override_disabled=True)
            if not session:
                raise Exception('Cannot connect to Mail service')
            message = MIMEMultipart()
            message['From'] = self.sender_address
            message['To'] = receiver.email
            # The subject line
            message['Subject'] = 'Login URL for LTC Portal'
            # The body and the attachments for the mail
            message_text = login_msg % (receiver.name, link)
            message.attach(MIMEText(message_text, 'plain'))
            # Create SMTP session for sending the mail
            text = message.as_string()
            print(text)
            session.sendmail(self.sender_address,
                             receiver.email, text)
            session.quit()
        except Exception as e:
            print('Not able to create email session', e)
# import base64
# import logging
# import mimetypes
# import os
# import os.path
# import pickle
# from email.mime.text import MIMEText
# from re import X
# from google_auth_oauthlib.flow import InstalledAppFlow
# from google.auth.transport.requests import Request
# from googleapiclient import errors
# from googleapiclient.discovery import build

# def get_service():
#     """Gets an authorized Gmail API service instance.

#     Returns:
#         An authorized Gmail API service instance..
#     """

#     # If modifying these scopes, delete the file token.pickle.
#     SCOPES = [
#         'https://www.googleapis.com/auth/gmail.readonly',
#         'https://www.googleapis.com/auth/gmail.send',
#     ]

#     creds = None
#     # The file token.pickle stores the user's access and refresh tokens, and is
#     # created automatically when the authorization flow completes for the first
#     # time.
#     if os.path.exists('token.pickle'):
#         with open('token.pickle', 'rb') as token:
#             creds = pickle.load(token)
#     # If there are no (valid) credentials available, let the user log in.
#     if not creds or not creds.valid:
#         if creds and creds.expired and creds.refresh_token:
#             creds.refresh(Request())
#         else:
#             flow = InstalledAppFlow.from_client_secrets_file(
#                 '../email_cred.json', SCOPES)
#             creds = flow.run_local_server(port=8001)
#         # Save the credentials for the next run
#         with open('token.pickle', 'wb') as token:
#             pickle.dump(creds, token)

#     service = build('gmail', 'v1', credentials=creds)
#     return service

# def send_message(service, sender, message):
#   """Send an email message.

#   Args:
#     service: Authorized Gmail API service instance.
#     user_id: User's email address. The special value "me"
#     can be used to indicate the authenticated user.
#     message: Message to be sent.

#   Returns:
#     Sent Message.
#   """
#   try:
#     sent_message = (service.users().messages().send(userId=sender, body=message)
#                .execute())
#     logging.info('Message Id: %s', sent_message['id'])
#     return sent_message
#   except errors.HttpError as error:
#     logging.error('An HTTP error occurred: %s', error)

# def create_message(sender, to, subject, message_text):
#   """Create a message for an email.

#   Args:
#     sender: Email address of the sender.
#     to: Email address of the receiver.
#     subject: The subject of the email message.
#     message_text: The text of the email message.

#   Returns:
#     An object containing a base64url encoded email object.
#   """
#   message = MIMEText(message_text)
#   message['to'] = to
#   message['from'] = sender
#   message['subject'] = subject
#   s = message.as_string()
#   b = base64.urlsafe_b64encode(s.encode('utf-8'))
#   return {'raw': b.decode('utf-8')}

# if __name__ == '__main__':
#     logging.basicConfig(
#         format="[%(levelname)s] %(message)s",
#         level=logging.INFO
#     )

#     try:
#         service = get_service()
#         message = create_message("from@gmail.com", "to@gmail.com", "Test subject", "Test body")
#         send_message(service, "from@gmail.com", message)

#     except Exception as e:
#         logging.error(e)
#         raise
