from packages import *

def unweightedUnifrac(dataFrame, otu_ids, tree):
    """
    compute distance matrix by method unweighted unifrac
    :param dataFrame: data for calculation the matrix - pandas DataFrame
    :param otu_ids: list of OTUs
    :param tree: phylogenetic
    :return: distance matrix
    """

    dataFrame = dataFrame[~np.all(dataFrame == 0, axis=1)]
    data = dataFrame.values
    dm = beta_diversity("unweighted_unifrac", data, otu_ids=otu_ids, tree=tree)
    dm.ids = dataFrame.index

    return dm