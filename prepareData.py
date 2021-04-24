from pca import *
from pcoa import *

def indexFilter(data, index, color):
    """
    processing the indexes for color plot
    :param data: PCx results from analysis
    :param index: index with matchig color code
    :param color: color code for coloring
    :return:
    """
    result = []
    indexes = list(index.index)
    for i, val in enumerate(data):
        if index[i] == color:
            result.append(indexes[i])
    return result

def customeFilter(data, index, color):
    """
    processing the result of the analysis
    :param data: PCx results from analysis
    :param index: index with matchig color code
    :param color: color code for coloring
    :return:
    """
    result = []
    for i, val in enumerate(data):
        if index[i] == color:
            result.append(val)
    return result

def preparingData(params, id):
    """
    prepare data for sending response to js
    :param params: class FileFormat() - there are saved all important data for analysis
    :return: x coordinates, y coordinates, z coordinates, e - ratio of variance explained by each counted component,
    colGraph - proportion explained for bar chart, category - categories for plot, maxPCx - max number for PCA/PCoA
    """
    x = []
    y = []
    z = []
    e = []
    colGraph = 0
    category = []
    maxPCx = []
    tableToString = ""
    matrixToString = ""
    index = []
    try:
        if params.type == "PCA":
            result, color, category, evr, colGraph, table, maxPCx = pca_do(params)
            tableToJson = json.loads(table.to_json(orient="split"))
            tableToString = json.dumps(tableToJson)

            e.append(evr)
            if params.dimension == "3D":
                for c, name in category.items():
                    x.append(customeFilter(result['PCA0'], color, c))
                    y.append(customeFilter(result['PCA1'], color, c))
                    z.append(customeFilter(result['PCA2'], color, c))
                    index.append(indexFilter(result['PCA1'], color, c))
            elif params.dimension == "2D":
                for c, name in category.items():
                    x.append(customeFilter(result['PCA0'], color, c))
                    y.append(customeFilter(result['PCA1'], color, c))
                    index.append(indexFilter(result['PCA1'], color, c))

        elif params.type == "PCoA":
            result, color, category, evr, colGraph, table, maxPCx, matrix = pcoa_do(params, id)
            tableToJson = json.loads(table.to_json(orient="split"))
            tableToString = json.dumps(tableToJson)

            matrixToDataFrame = matrix.to_data_frame()
            matrixToJson = json.loads(matrixToDataFrame.to_json(orient="split"))
            matrixToString = json.dumps(matrixToJson)

            e.append(evr)

            if params.dimension == "3D":
                for c, name in category.items():
                    x.append(customeFilter(result['PC1'], color, c))
                    y.append(customeFilter(result['PC2'], color, c))
                    z.append(customeFilter(result['PC3'], color, c))
                    index.append(indexFilter(result['PC1'], color, c))
            elif params.dimension == "2D":
                for c, name in category.items():
                    x.append(customeFilter(result['PC1'], color, c))
                    y.append(customeFilter(result['PC2'], color, c))
                    index.append(indexFilter(result['PC1'], color, c))
        return x, y, z, e, colGraph, category, maxPCx, tableToString, matrixToString, index
    except Exception as e:
        return x, y, z, e, colGraph, category, maxPCx, tableToString, matrixToString, index