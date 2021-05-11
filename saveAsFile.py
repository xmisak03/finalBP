from packages import *

PATH = '/mnt/c/Users/silvi/OneDrive/Dokumenty/FIT/pyvenv/materials/uploads'

def saveMatrix(jsdata, output):
    """
    save matrix as file
    :param jsdata: json info about how to save
    :param output: matrix - DataFrame
    :return: saved data
    """
    # save as csv
    if jsdata["downloadType"] == 'csv':
        finalPath = os.path.join(PATH, jsdata['id'] + 'matrix.data')
        output.to_csv(finalPath, index=True, header=True, sep='\t')

    # save as excel
    elif jsdata["downloadType"] == 'excel':
        finalPath = os.path.join(PATH, jsdata['id'] + 'matrix.xlsx')
        output.to_excel(finalPath, index=True, header=True)

    # save as json
    elif jsdata["downloadType"] == 'json':
        finalPath = os.path.join(PATH, jsdata['id'] + 'matrix.json')
        output.to_json(finalPath, orient='index', compression='infer', index='true')

    file_data = codecs.open(finalPath, 'rb').read()
    os.remove(finalPath)

    return file_data

def saveResult(jsdata, data):
    """
    sace dataframe to file and prepare it for sending
    :param jsdata: js request details
    :param data: data, which will be send
    :return:
    """
    data = data.iloc[:, : int(jsdata['numberOfPC'])]
    if jsdata["downloadType"] == 'csv':
        finalPath = os.path.join(PATH, jsdata['id'] + 'result.data')
        data.to_csv(finalPath, index=True, header=True, sep='\t')

    # save as excel
    elif jsdata["downloadType"] == 'excel':
        finalPath = os.path.join(PATH, jsdata['id'] + 'result.xlsx')
        data.to_excel(finalPath, index=True, header=True)

    # save as json
    elif jsdata["downloadType"] == 'json':
        finalPath = os.path.join(PATH, jsdata['id'] + 'result.json')
        data.to_json(finalPath, orient='index', compression='infer', index='true')

    file_data = codecs.open(finalPath, 'rb').read()
    os.remove(finalPath)

    return file_data