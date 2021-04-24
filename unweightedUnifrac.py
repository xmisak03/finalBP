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
    df = pd.DataFrame(columns=dataFrame.index, index=dataFrame.index)
    data = dataFrame.values

    for i in range(len(data)):
        for j in range(len(data)):
            if i == j:
                df.at[dataFrame.index[i], dataFrame.index[j]] = 0
            else:
                partialCalculation = unweighted_unifrac(data[i], data[j], otu_ids, tree)
                df.at[dataFrame.index[i], dataFrame.index[j]] = partialCalculation

    dmData = df.values
    ids = dataFrame.index
    dm = DistanceMatrix(dmData, ids)

    return dm