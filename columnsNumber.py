from packages import *

def columnsNumberPCA(dataset):
    """
    count number of columns, which should by show in percentage of variance graph
    :param dataset: dataset from which will be PCA count - pandas DataFrame
    :return: number of columns
    """
    col = min(dataset.shape[0], dataset.shape[1])
    if col > 50:
        col = 50

    prePca = PCA(n_components=col)
    prePca.fit(dataset)
    colGraph = prePca.explained_variance_ratio_

    return colGraph

def columnsNumberPCoA(dm):
    """
    count number of columns, which should by show in percentage of variance graph
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