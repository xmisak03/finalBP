from packages import *

def createResponse(file_data):
    """
    prepare response for js
    :param file_data: file with data, which will be send
    :return: final response
    """
    response = make_response()
    response.headers['my-custom-header'] = 'my-custom-status-0'
    response.data = file_data

    return response