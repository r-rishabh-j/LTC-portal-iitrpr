from backend import create_app
app = create_app()
# import ssl
# context = ssl.SSLContext()
# context.load_cert_chain('cert.pem', 'key.pem')

if __name__ == '__main__':
    app.run(debug=True, port=8000)
