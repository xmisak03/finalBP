from __future__ import print_function

from prepareData import *
from setParams import *
from saveAsFile import *
from response import *
from db import *
from mail import *

# prepare for uploading data from web
UPLOAD_FOLDER = '/mnt/c/Users/silvi/OneDrive/Dokumenty/FIT/pyvenv/materials/uploads'

app = Flask(__name__)
app.secret_key = 's3cr3t'
app.debug = True
app._static_folder = os.path.abspath("templates/static/")

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

address = ''

# queue for worker
q = queue.Queue()

def worker():
    """
    worker in the case that we need count phylogenetics
    """
    while True:
        item = q.get()
        params = item['params']

        x, y, z, e, colGraph, category, maxPCx, table, matrix, indexes = preparingData(params, item['id'])

        # save response for js to file
        try:
            legend = json.dumps(', '.join([str(elem) for elem in params.coloring]))
            json_data = {'id': item['id'], 'indexes':json.dumps(indexes), 'x': json.dumps(x), 'y': json.dumps(y), 'z': json.dumps(z), 'category': json.dumps(category),
                         'evr': json.dumps(e[0].tolist()), 'colGraph': json.dumps(colGraph.tolist()), 'legend': legend,
                         'maxPCx': maxPCx}

            insertDB({'id': item['id'], 'matrix': matrix, 'result': table, 'response': json.dumps(json_data)})
            sendMail(params, item['id'], True)

        except Exception as e:
            insertDB({'id': item['id'], 'matrix': "", 'result': "", 'response': "error"})
            sendMail(params, None, False)

        q.task_done()

threading.Thread(target=worker, daemon=True).start()

@app.route('/mailResponse/<id>', methods = ['POST'])
def send_mail_response(id):
    """
    send json response after open js tool from mail
    :param id: id of request
    :return: response json for js
    """
    response = getItem(id)
    try:
        return json.loads(response[0][3])
    except Exception as e:
        return {'result': 'error'}

@app.route('/result/<id>', methods = ['POST'])
def send_unifrac(id):
    """
    send json response after finish PCoA with unifrac
    :param id: id of request
    :return: response json for js
    """
    response = getItem(id)
    if response != []:
        if response[0][3] == "error":
            json_data = {'result': 'error'}
        else:
            json_data = json.loads(response[0][3])

        return json_data
    else:
        return jsonify(None)

@app.route('/file', methods = ['POST'])
def upload_f():
    """
    upload file and send path
    :return: path for js
    """
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    response = UPLOAD_FOLDER + '/' + filename
    return response

@app.route('/matrix', methods = ['POST'])
def post_matrix():
    """
    prepare matrix for saving by user
    :return: file for saving
    """
    jsdata = request.get_json()

    try:
        response = getItem(jsdata["id"])
        dict = json.loads(response[0][1])
        data = pd.DataFrame(dict['data'], index=dict['columns'], columns=dict['columns'])
        file_data = saveMatrix(jsdata, data)
        return createResponse(file_data)

    except Exception as e:
        return jsonify(None)

@app.route('/table', methods = ['POST'])
def post_table():
    """
    prepare result for saving by user
    :return: file for saving
    """
    jsdata = request.get_json()

    try:
        response = getItem(jsdata["id"])
        dict = json.loads(response[0][2])
        data = pd.DataFrame(dict['data'], index=dict['index'], columns=dict['columns'])
        file_data = saveResult(jsdata, data)
        return createResponse(file_data)

    except Exception as e:
        return jsonify(None)

@app.route('/api', methods = ['POST'])
def post_api():
    """
    receive data for analysis and do necessary calculations
    :return: response to js - id in case of unifrac, result otherwise
    """

    jsdata = request.get_json()
    params = setParams(jsdata)
    id = uuid.uuid1().hex

    if params.matrix == "unifrac_weighted" or params.matrix == "unifrac_unweighted" :
        data_for_unifrac = {'id': id, 'params': params}
        q.put(data_for_unifrac)

        response = {'id': id}
        return response

    x, y, z, e, colGraph, category, maxPCx, table, matrix, indexes = preparingData(params, id)
    insertDB({'id': id, 'matrix': matrix, 'result': table, 'response': ''})

    # send response to the web
    try:
        legend = json.dumps(', '.join([str(elem) for elem in params.coloring]))
        json_data = {'id': id,'indexes':json.dumps(indexes),'x':json.dumps(x),'y': json.dumps(y), 'z':json.dumps(z),
                     'category':json.dumps(category), 'evr':json.dumps(e[0].tolist()), 'colGraph':json.dumps(colGraph.tolist()),
                     'legend':legend,'maxPCx': maxPCx}
        return json_data
    except Exception as e:
        print(e)
        return jsonify(None)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)