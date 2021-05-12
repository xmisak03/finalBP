class JSONformat:
    """
    class for format of data for analysis which are coming from js app
    """
    def __init__(self):
        """
        the constructor
        """
        self.dimension = None
        self.type = None
        self.fileType = None
        self.file = None
        self.metaFile = None
        self.metaFileType = None
        self.coloring = None
        self.download = None
        self.matrix = None
        self.mail = None

    def setDimension(self, value):
        """
        function to get dimensionality from js to file format
        :param value: value from js
        """
        self.dimension = value

    def setType(self, value):
        """
        function to get type of analysis from js to file format
        :param value: value from js
        """
        self.type = value

    def setFileType(self, value):
        """
        function to get type of data file from js to file format
        :param value: value from js
        """
        self.fileType = value

    def setFile(self, value):
        """
        function to get data file path from js to file format
        :param value: value from js
        """
        self.file = value

    def setMetaFile(self, value):
        """
        function to get type of metadata file from js to file format
        :param value: value from js
        """
        self.metaFile = value

    def setMetaFileType(self, value):
        """
        function to get metadata file path from js to file format
        :param value: value from js
        """
        self.metaFileType = value

    def setColoring(self, value):
        """
        function to get name of metadata for coloring from js to file format
        :param value: value from js
        """
        self.coloring = value

    def setDownload(self, value):
        """
        function to get number of dimension for PCx data downloading from js to file format
        :param value: value from js
        """
        self.download = value

    def setMatrix(self, value):
        """
        function to get matrix calculation method from js to file format
        :param value: value from js
        """
        self.matrix = value

    def setMail(self, value):
        """
        function to set mail from js to file format
        :param value: value from js
        """
        self.mail = value

def setParams(jsdata):
    """
    set params atributes for next analysis
    :param jsdata: data for js form
    :return: class JSONformat() - there are saved all important data for analysis
    """
    params = JSONformat()

    params.setMetaFileType(jsdata["metaFileType"])
    params.setMetaFile(jsdata["metaFile"])
    params.setFileType(jsdata["fileType"])
    params.setFile(jsdata["file"])
    params.setMatrix(jsdata["matrix"])
    params.setType(jsdata["type"])
    params.setDownload(jsdata["numberOfPC"])
    params.setDimension(jsdata["dimension"])
    params.coloring = [i.strip() for i in jsdata["coloring"]]
    params.setMail(jsdata["mail"])

    return params