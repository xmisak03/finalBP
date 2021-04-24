from openDataFile import *
from openMetadataFile import *
from countPCAtable import *
from columnsNumberPCA import *
from metadataWork import *
from countPCA import *

def pca_do(params):
    """
    do whole PCA analysis
    :param params: class FileFormat() - there are saved all important data for analysis
    :return: result (result of analysis), color (array of colours), category (array of categories),
    evr (ratio of variance explained by each counted component), colGraph (number of columns for PCx graph)
    """
    try:
        # load file data and prepare them
        if params.fileType == "biom":
            dataset = load_table(params.file)
            print(dataset)
            df = pd.DataFrame(dataset.matrix_data.T.todense().astype(int), index=dataset.ids(axis='sample'),
                              columns=dataset.ids(axis='observation')).T

            metadata = dataset.metadata_to_dataframe(axis='sample')

        else:
            df = open_data_file(params)
            df.reset_index(drop=True)

            metadata = open_metadata_file(params)

        # transform data, if it is needed
        if (list(metadata.index)) != (list(df.index)):
            df = df.T

        # counting data for download PCx
        maxPCx = min(df.shape[0], df.shape[1])
        table = countPCAtable(maxPCx, df)

        # work with metadata for coloring
        metadata.reset_index(drop=True)
        color, category = metadataWork(metadata, params)

        # count PCA for plot
        if params.dimension == "3D":
            evr, result = countPCA(df, 3)

        if params.dimension == "2D":
            evr, result = countPCA(df, 2)

        # proportion explained for bar chart
        colGraph = columnsNumberPCA(df)

        return result, color, category, evr, colGraph, table, maxPCx

    except Exception as e:
        print("INVALID FORMAT OR TYPE OF FILE")
        print(e)
        return None
