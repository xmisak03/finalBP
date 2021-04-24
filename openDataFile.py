from packages import *

def open_data_file(params):
    """
    functiom for opening data files for analysis
    :param params: class FileFormat() - there are saved all important data for analysis
    :return: DataFrame - data for analysis
    """

    read_map = {"csv": pd.read_csv, "json": pd.read_json, "excel": pd.read_excel, "biom": pd.read_hdf}
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