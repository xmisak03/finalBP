from packages import *

def braycurtis(dataFrame):
    """
    compute Bray-Curtis distance matrix
    :param dataFrame: data for calculation the matrix - pandas DataFrame
    :return: distance matrix
    """
    dataFrame = dataFrame[~np.all(dataFrame == 0, axis=1)]
    data = dataFrame.values
    dm = beta_diversity("braycurtis", data)
    dm.ids = dataFrame.index

    return dm