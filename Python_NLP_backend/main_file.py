#main python file
import sys
import time
import csv
import collections
import string
import re
import logging
import time
import warnings
import json
warnings.filterwarnings("ignore",category=DeprecationWarning)

buzz_words = ""

if len(sys.argv) < 2:
  sys.exit("Source file not found, exiting")

with open(sys.argv[0], 'r', encoding='utf-8') as buzz_words_file:
  buzz_words = buzz_words_file.read()

import importlib.util
spec1 = importlib.util.spec_from_file_location("realnews", "news/realnews.py")
foo1 = importlib.util.module_from_spec(spec1)
spec1.loader.exec_module(foo1)
n1=foo1.news_text()
n1.assign_data()

spec2 = importlib.util.spec_from_file_location("bert_engine", "search_engine/BERT_search_engine/bert_engine.py")
foo2 = importlib.util.module_from_spec(spec2)
spec2.loader.exec_module(foo2)
b1=foo2.bert_instance()

import os
#os.system("python D:\F10\search_engine\BERT_search_engine\bert_engine.py")
#os.system("python D:\F10\news\realnews.py")

#from realnews import return_processed_text
#from bert_engine import return_top5

processed_texts=n1.return_processed_texts()
#print(processed_texts[16])
# TODO:etadata of buzzwords (companies, stocks, countries etc)
matrix=b1.matrix(processed_texts, buzz_words)
print(matrix)
def get_top4_indexes(matrix):
    lis=matrix.flatten()
    top4=lis.argsort()[-4:][::-1]
    return(top4)

def process_texts(texts):
    newtexts=[]
    for text in texts:
        text=text.replace('\r\n',' ')
        textlist=text.split("… [+")
        text2=textlist[0]
        newtexts.append(text2)
    return(newtexts)

top4=(get_top4_indexes(matrix))

diction={}

diction["articles"]=[n1.articles[index] for index in top4]

diction["articles"]=process_texts(diction["articles"])
print(diction["articles"])

diction["titles"]=[n1.titles[index] for index in top4]
diction["urls"]=[n1.urls[index] for index in top4]
diction["imgurls"]=[n1.imgurls[index] for index in top4]

json_string = json.dumps(diction)
print(json_string)

with open("alldata.json", 'w',encoding='utf8') as f:
    json.dump(diction, f,ensure_ascii=False)
