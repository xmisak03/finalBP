from packages import *

def columnsNumberPCoA(dm):
    """
    count number of columns, which should by show in PCx graph
    :param dataFrame: dataset from which will be PCoA count - pandas DataFrame
    :param dm: distance matrix
    :return: number of columns
    """
    col = min(dm.shape[0], dm.shape[1])
    if col > 50:
        col = 50
    prePcoa = pcoa(dm, number_of_dimensions=col)
    colGraph = prePcoa.proportion_explained

    return colGraph