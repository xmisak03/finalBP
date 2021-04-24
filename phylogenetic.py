from packages import *

PATH = '/mnt/c/Users/silvi/OneDrive/Dokumenty/FIT/pyvenv/materials/phylogenetic/'
MAFFT = '/usr/bin/mafft'
BINARY_FAST_TREE = '/home/silvia/venv/FastTree'

def alignSeq(dataFrame, id):
    """
    alignment of input sequences
    :param dataFrame: data for alignement - pandas DataFrame
    :param id: request id
    :return: aligned sequences and list of OTUs
    """
    finalPath = os.path.join(PATH, id + '.fa')
    aligned = os.path.join(PATH, id + 'aligned.fa')
    otu_ids = []

    # create fasta file with sequences
    sequences = list(dataFrame.columns)
    file = open(finalPath, "w")
    for i in range(len(sequences)):
        file.write(">" + "OTU_" + str(i) + "\n" + sequences[i] + "\n")
        otu_ids.append("OTU " + str(i))
    file.close()

    # align sequences
    mafft_exe = MAFFT
    mafft_cline = MafftCommandline(mafft_exe, input=finalPath)
    stdout, stderr = mafft_cline()
    with open(aligned, "w") as handle:
        handle.write(stdout)
    AlignIO.read(aligned, "fasta")

    os.remove(finalPath)

    return aligned, otu_ids

def calculatePhylogenetic(dataFrame, id):
    """
    calculate phylogenetic tree
    :param dataFrame: data for calculation - pandas DataFrame
    :param id: request id
    :return: phylogenetic and list of OTUs
    """
    file, otu_ids = alignSeq(dataFrame, id)
    outputTree = os.path.join(PATH, id + "tree")

    # count phylogenetic
    with open(outputTree, 'w') as output_file:
        run([BINARY_FAST_TREE, file], check=True, stdout=output_file)
    tree = read(StringIO(open(outputTree, "r").read()), format="newick", into=TreeNode).root_at_midpoint()

    os.remove(outputTree)
    os.remove(file)

    return tree, otu_ids