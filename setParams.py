from fileFormat import *

def setParams(jsdata):
    """
    set params atributes for next analysis
    :param jsdata: data for js form
    :return: class FileFormat() - there are saved all important data for analysis
    """
    params = FileFormat()

    params.setMetaFileType(jsdata["metaFileType"])
    params.setMetaFile(jsdata["metaFile"])
    params.setFileType(jsdata["fileType"])
    params.setFile(jsdata["file"])
    params.setMatrix(jsdata["matrix"])
    params.setType(jsdata["type"])
    params.setDownload(jsdata["nod"])
    params.setDimension(jsdata["dimension"])
    params.coloring = [i.strip() for i in jsdata["coloring"]]
    params.setMail(jsdata["mail"])

    return params