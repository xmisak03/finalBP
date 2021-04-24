from packages import *

def countPCoAtable(dm, dimensions):
    """
    count PCx table for exact number of dimensions
    :param dm: distance matrix
    :param dimensions: umber of dimensions
    :return: dataFrame with PCx table
    """
    result = pcoa(dm, number_of_dimensions=dimensions)
    table = result.samples
    return table