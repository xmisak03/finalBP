from packages import *

"""
work with database
"""

conn = sqlite3.connect('database.db', check_same_thread=False)

c = conn.cursor()

'''c.execute("""CREATE TABLE database (
            id text,
            matrix text,
            result text,
            response text
            )""")'''

def insertDB(item):
    """
    insert into database
    :param item: inserted item
    """
    with conn:
        c.execute("INSERT INTO database VALUES (:id, :matrix, :result, :response)", item)

def getItem(idValue):
    """
    select from database item by id
    :param idValue: id for selecting
    :return: selected item
    """
    with conn:
        c.execute("SELECT * FROM database WHERE id=?", (idValue,))
        selectResult = c.fetchall()
        return selectResult

conn.commit()
