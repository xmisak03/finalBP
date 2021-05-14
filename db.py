from packages import *

"""
work with database
"""

conn = sqlite3.connect('database.db', check_same_thread=False)

c = conn.cursor()

'''c.execute("""CREATE TABLE pcoaResult (
            id text,
            indexes text,
            x text,
            y text,
            z text,
            category text,
            evr text,
            colGraph text,
            legend text,
            maxPCx INTEGER
            )""")

c.execute("""CREATE TABLE distanceMatrix (
            id text,
            matrix text
            )""")
            
c.execute("""CREATE TABLE calculations (
            id text
            )""")
            
c.execute("""CREATE TABLE transformedData (
            id text,
            result text 
            )""")'''

def insertDBResult(item):
    """
    insert into database result of PCoA analysis
    :param item: inserted result
    """
    with conn:
        c.execute("INSERT INTO pcoaResult VALUES (:id, :indexes, :x, :y, :z, :category, :evr, :colGraph, :legend, :maxPCx)", item)

def insertDBDistanceMatrix(item):
    """
    insert into database distance matrix
    :param item: inserted distance matrix
    """
    with conn:
        c.execute("INSERT INTO distanceMatrix VALUES (:id, :matrix)", item)

def insertDBTransformedData(item):
    """
    insert into database transformed data
    :param item: inserted transformed data
    """
    with conn:
        c.execute("INSERT INTO transformedData VALUES (:id, :result )", item)

def insertDBDIdentificator(item):
    """
    insert into database identificator
    :param item: inserted distance matrix
    """
    with conn:
        c.execute("INSERT INTO calculations VALUES (:id)", item)

def getItemDBResult(idValue):
    """
    select from database result by id
    :param idValue: id for selecting
    :return: selected item in json format
    """
    with conn:
        c.execute("SELECT * FROM pcoaResult WHERE id=?", (idValue,))
        selectResult = c.fetchall()
        if selectResult == []:
            return selectResult
        else:
            json_data = {'id': selectResult[0][0], 'indexes': selectResult[0][1], 'x': selectResult[0][2],
                     'y': selectResult[0][3], 'z': selectResult[0][4], 'category': selectResult[0][5],
                     'evr': selectResult[0][6], 'colGraph': selectResult[0][7], 'legend': selectResult[0][8],
                     'maxPCx': selectResult[0][9]}
            return json_data

def getItemDBDistanceMatrix(idValue):
    """
    select from database disatnce matrix by id
    :param idValue: id for selecting
    :return: selected item
    """
    with conn:
        c.execute("SELECT * FROM distanceMatrix WHERE id=?", (idValue,))
        selectResult = c.fetchall()
        return selectResult

def getItemDBIdentificator(idValue):
    """
    check if the identificator is already in database
    :param idValue: identificator
    :return: true if it is already used, false if it is not used
    """
    with conn:
        c.execute("SELECT * FROM calculations WHERE id=?", (idValue,))
        selectResult = c.fetchall()
        if selectResult == []:
            return False
        else:
            return True

def getItemDBTransformedData(idValue):
    """
    select from database transformed data by id
    :param idValue: id for selecting
    :return: selected item
    """
    with conn:
        c.execute("SELECT * FROM transformedData WHERE id=?", (idValue,))
        selectResult = c.fetchall()
        return selectResult

conn.commit()
