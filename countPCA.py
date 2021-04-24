from packages import *

def countPCA(dataset, dimensions):
    """
    count PCA for final plot
    :param dataset: data from which is PCA count - pandas DataFrame
    :param dimensions: number of dimensions for PCA
    :return: evr (ratio of variance explained by each counted component) and result of
    """
    pca = PCA(n_components=dimensions)
    pca.fit(dataset)
    evr = pca.explained_variance_ratio_
    result = pd.DataFrame(pca.transform(dataset), columns=['PCA%i' % i for i in range(dimensions)], index=dataset.index)

    return evr, result