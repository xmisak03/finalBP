import codecs
import json
import math
import numpy as np
import os
import os.path
import pandas as pd
import sqlite3
import threading, queue
import uuid

from Bio import AlignIO
from Bio.Align.Applications import MafftCommandline
from biom import load_table
from flask import make_response, Flask, request, jsonify
from io import StringIO
from skbio import read, TreeNode, DistanceMatrix
from skbio.diversity import beta_diversity
from skbio.diversity.beta import unweighted_unifrac
from skbio.stats.ordination import pcoa
from sklearn.decomposition import PCA
from subprocess import run
from werkzeug.utils import secure_filename