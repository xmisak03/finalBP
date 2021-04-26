from packages import *

def columnsNumberPCA(dataset):
    """
    count number of columns, which should by show in PCx graph
    :param dataset: dataset from which will be PCA count - pandas DataFrame
    :return: number of columns
    """
    col = min(dataset.shape[0], dataset.shape[1])
    print(col)
    if col > 20:
        col = 20

    prePca = PCA(n_components=col)
    prePca.fit(dataset)
    colGraph = prePca.explained_variance_ratio_

    return colGraph