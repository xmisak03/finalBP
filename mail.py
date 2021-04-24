import smtplib, ssl

def sendMail(mail, content):
    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"
    sender_email = "toolfordatavisualization@gmail.com"
    receiver_email = mail
    message = f"""\
    Subject: Result of analysis

    {content}"""

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password="bakalarkaFIT2021")
        server.sendmail(sender_email, receiver_email, message)