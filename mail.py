from packages import *

def sendMail(params, id, isSuccess):
    """
    send mail with link to result
    :param params: original data from js
    :param id: id of request
    :param isSuccess: flag if calculation was successful
    """
    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"
    sender_email = "toolfordatavisualization@gmail.com"
    receiver_email = params.mail
    if isSuccess == True:
        message = f"""\
        Subject: Result of analysis\n
    
        Calculation of {params.matrix} finished! \n
        Click to the link to see the result: http://localhost:3000/{id}
        """

    else:
        message = "Some data is incorrect. Please check them and try the calculation again"

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password="bakalarkaFIT2021")
        server.sendmail(sender_email, receiver_email, message)