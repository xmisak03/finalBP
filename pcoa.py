from openFile import *
from distanceMatrixMetrics import *
from countTable import *
from metadataWork import *
from columnsNumber import *
from phylogenetic import *

def pcoa_do(params, id):
    """
    do whole PCoA analysis
    :param params: class JSONformat() - there are saved all important data for analysis
    :return: result (result of analysis), color (array of colours), category (array of categories),
    evr (ratio of variance explained by each counted component), colGraph (number of columns for PCx graph)
    """
    try:
        # load file data and prepare them
        if params.fileType == "biom":
            dataset = load_table(params.file)
            dataFrame = pd.DataFrame(dataset.matrix_data.T.todense().astype(int), index=dataset.ids(axis='sample'),
                                     columns=dataset.ids(axis='observation')).T

            meta = dataset.metadata_to_dataframe(axis='sample')

        else:
            dataFrame = open_data_file(params)

            meta = open_metadata_file(params)

        # transform data, if it is needed
        if (list(meta.index)) != (list(dataFrame.index)):
            dataFrame = dataFrame.T

        # distance matrix
        # braycurtis
        if params.matrix == "bray_curtis":
            dm = braycurtis(dataFrame)
        # unifrac methodes
        else:
            tree, otu_ids = calculatePhylogenetic(dataFrame, id)
            # weighted
            if params.matrix == "unifrac_weighted":
                dm = weightedUnifrac(dataFrame, otu_ids, tree)
            # unweighted
            else:
                dm = unweightedUnifrac(dataFrame, otu_ids, tree)

        # request for saving matrix
        matrix = dm

        # counting data for download PCx
        maxPCx = len(dm.ids)
        table = countPCoAtable(dm, maxPCx)

        # in case of None rows
        indexes = list(meta.index)
        dmIndexes = list(table.index)
        forDelete = list(set(indexes) - set(dmIndexes))
        for id in forDelete:
            meta = meta.drop(id)

        # work with metadata for coloring
        meta.reset_index(drop=True)
        color, category = metadataWork(meta, params)

        # count PCoA for plot
        if params.dimension == "2D":
            pcoa_results = pcoa(dm, number_of_dimensions=2)
        if params.dimension == "3D":
            pcoa_results = pcoa(dm, number_of_dimensions=3)

        evr = pcoa_results.proportion_explained
        result = pcoa_results.samples

        # proportion explained for bar chart
        colGraph = columnsNumberPCoA(dm)

        return result, color, category, evr, colGraph, table, maxPCx, matrix

    except Exception as e:
        print("INVALID FORMAT OR TYPE OF FILE")
        print(e)
        return None