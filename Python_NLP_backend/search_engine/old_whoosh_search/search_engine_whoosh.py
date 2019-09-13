#search engine

import os
from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, ID
import sys

from whoosh.qparser import QueryParser
from whoosh import scoring
from whoosh.index import open_dir

 

def createSearchableData(texts):   
 
    '''
    Schema definition: title(name of file), path(as ID), content(indexed
    but not stored),textdata (stored text content)
    '''
    
    schema = Schema(title=TEXT(stored=True),path=ID(stored=True),\
              content=TEXT,textdata=TEXT(stored=True))
    """
    if not os.path.exists("indexdir"):
        os.mkdir("indexdir")
 
    # Creating a index writer to add document as per schema
    ix = create_in("indexdir",schema)
    writer = ix.writer()
 
    filepaths = [os.path.join(root,i) for i in os.listdir(root)]
    for path in filepaths:
        fp = open(path,'r')
        print(path)
        text = fp.read()
    """
    
    # Creating a index writer to add document as per schema
    ix = create_in(r"D:\F10\search_engine\searchable_data",schema)
    writer = ix.writer()
    
    for i in range(len(texts)):
        text=texts[i]
        writer.add_document(title=("document"+str(i)),
          content=text,textdata=text)

    writer.commit()
 
#root = "corpus"
texts=["hello how are you","my name jeff","financial shares are going up, stocks are in disarray, Warren Buffet is going nutz.","Technology is going to change the way we live our lives, machine learning algorithms and artificial intelligence. Blockchain, big data analytics, and cybersecurity are great tech fields to start a career in at the moment."]

createSearchableData(texts)

ix = open_dir(r"D:\F10\search_engine\searchable_data")

# query_str is query string
query_str = "finance"
# Top 'n' documents as result
topN = 2
 


with ix.searcher(weighting=scoring.TF_IDF) as searcher:
    query = QueryParser("content", ix.schema).parse(query_str)
    results = searcher.search(query,limit=topN)
    print((results)[0]['textdata'])
    
for i in range(topN):
    print(results[i]['title'], str(results[i].score), results[i]['textdata'])
