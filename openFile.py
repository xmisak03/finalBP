from packages import *

read_map = {"csv": pd.read_csv, "json": pd.read_json, "excel": pd.read_excel, "biom": pd.read_hdf}

def open_data_file(params):
    """
    functiom for opening data files for analysis
    :param params: class JSONformat() - there are saved all important data for analysis
    :return: DataFrame - data for analysis
    """

    file = params.file

    if params.fileType == "json":
        dataset = read_map[params.fileType](file, orient='index')
    elif params.fileType == "excel":
        dataset = read_map[params.fileType](file, engine='openpyxl', index_col=0)
    else:
        dataset = read_map[params.fileType](file, index_col=0)

        # file separated by tab
        if dataset.empty:
            dataset = read_map[params.fileType](file, sep='\t', index_col=0)

        # file separated by semicolon
        if dataset.empty:
            dataset = read_map[params.fileType](file, sep=';', index_col=0)

        # file separated by space
        if dataset.empty:
            dataset = read_map[params.fileType](file, delim_whitespace=True, index_col=0)

    return dataset

def open_metadata_file(params):
    """
    functiom for opening metadata files for analysis
    :param params: class JSONformat() - there are saved all important data for analysis
    :return: DataFrame - metadata for analysis
    """
    metaFile = params.metaFile

    if params.metaFileType == "json":
        metadata = read_map[params.metaFileType](metaFile, orient='index')
    elif params.metaFileType == "excel":
        metadata = read_map[params.metaFileType](metaFile, engine='openpyxl', index_col=0)
    else:
        metadata = read_map[params.metaFileType](metaFile, index_col=0)

        # file separated by tab
        if metadata.empty:
            metadata = read_map[params.metaFileType](metaFile, sep='\t', index_col=0)

        # file separated by semicolon
        if metadata.empty:
            metadata = read_map[params.metaFileType](metaFile, sep=';', index_col=0)

        # file separated by space
        if metadata.empty:
            metadata = read_map[params.metaFileType](metaFile, delim_whitespace=True, index_col=0)

    metadata.columns = metadata.columns.str.strip()

    return metadata