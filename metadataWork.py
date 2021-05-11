from packages import *

def metadataWork(metadata, params):
    """
    prepare metadata from metadata file form plot
    :param metadata: file with metadata
    :param params: class JSONformat() - there are saved all important data for analysis
    :return: arrays with colors and categories for plot
    """
    metadata = metadata.applymap(str)
    metadata['list'] = metadata[params.coloring].values.tolist()
    metadata['coloring'] = metadata['list'].apply(', '.join)

    metadata['coloring'] = pd.Categorical(metadata['coloring'])
    color = metadata['coloring'].cat.codes
    category = dict(enumerate(metadata['coloring'].cat.categories))

    return color, category