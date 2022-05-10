import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os


class EmailManager():
    ltc_req_created_msg = """Hello %s,
Your LTC Request, ID %s has been created.
Keep visiting LTC Portal for updates.
"""
    decline_msg = """Hello %s,
Your LTC Request, ID %s has been declined.
Visit LTC Portal for more information.
"""
    approval_msg = """Hello %s,
Your LTC Request, ID %s has been approved and is pending office order generation.
Visit LTC Portal for more information.
"""
    ltc_office_order_msg = """Hello %s,
Office order for LTC Request ID %s has been generated.
Visit LTC Portal for more information.
"""

    def __init__(self,  enabled=True, queue: dict = None) -> None:
        self.sender_address = os.environ.get('EMAIL_ID')
        self.sender_pass = os.environ.get('EMAIL_APP_PASSWORD')
        self.enabled = enabled
        self.queuing = True if 'queue' in queue.keys() else False
        self.task_queue = None if not self.queuing else queue['queue']
        self.__connect()

    def __connect(self):
        try:
            if self.enabled:
                self.session = smtplib.SMTP(
                    'smtp.gmail.com', 587)  # use gmail with port
                self.session.starttls()  # enable security
                # login with mail_id and password
                self.session.login(self.sender_address, self.sender_pass)
            else:
                print('Email Disabled.')
        except:
            if self.enabled:
                print('Not able to create email session')

    def __sendEmail(self, receiver, subject, message_text):
        if receiver['pref'] == True:
            try:
                if self.enabled:
                    session = smtplib.SMTP(
                        'smtp.gmail.com', 587)  # use gmail with port
                    session.starttls()  # enable security
                    # login with mail_id and password
                    session.login(self.sender_address, self.sender_pass)
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
                else:
                    print('Email Disabled.')
            except:
                if self.enabled:
                    print('Not able to create email session')

    def sendEmail(self, receiver, subject, message_text):
        if not self.enabled:
            return
        try:
            try:
                # rec = {
                #     'email':str(receiver.email),
                #     'pref':(receiver.email_pref)
                # }
                rec = {
                    'email': '2019csb1286@iitrpr.ac.in',
                    'pref': True
                }
                if self.queuing == True:
                    self.task_queue.enqueue(
                        self.__sendEmail, rec, 'subject', 'message_text')
                else:
                    self.__sendEmail(rec, subject, message_text)
            except (smtplib.SMTPServerDisconnected, smtplib.SMTPConnectError, smtplib.SMTPSenderRefused) as e:
                print('here')
                print(e)
                try:
                    self.__connect()
                    if self.task_queue == True:
                        self.task_queue.enqueue(
                            self.__sendEmail, rec, subject, message_text)
                    else:
                        self.__sendEmail(rec, subject, message_text)
                except:
                    print('Email Not Sent')
        except Exception as e:
            print('Error in sending mail', e)

    def __del__(self):
        if not self.enabled:
            return
        try:
            self.session.quit()
        except Exception as a:
            print(a)
            print('Cannot quit session')

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
