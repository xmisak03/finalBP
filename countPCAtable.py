from packages import *

def countPCAtable(number_of_dimensions, dataset):
    """
    count PCx table for exact number of dimensions
    :param number_of_dimensions: number of dimensions
    :param dataset: dataset from which will be PCA count - pandas DataFrame
    :return: dataFrame with PCx table
    """
    download = PCA(n_components=number_of_dimensions)
    download.fit(dataset)
    table = pd.DataFrame(download.transform(dataset),
                         columns=['PCA%i' % i for i in range(1, number_of_dimensions + 1)],
                         index=dataset.index)
    return table