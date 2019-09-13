import newsapi
from newsapi import NewsApiClient
import numpy as np
import pandas as pd
import time
import scipy.sparse as ss
import matplotlib.pyplot as plt
import csv
import collections
import string
import nltk
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
import re
from sklearn.feature_extraction.text import CountVectorizer
from nltk import ngrams
import logging
import spacy
from nltk import ngrams
from nltk.stem.wordnet import WordNetLemmatizer
import time
import warnings
warnings.filterwarnings("ignore",category=DeprecationWarning)

# Init
#q='bitcoin',
# /v2/top-headlines

class news_text():
    newsapi = NewsApiClient(api_key='1ca90686b682467a97477cdef14ef436')
    everything = newsapi.get_everything(sources='financial-post',language='en')

    def assign_data(self):
        completearticles=[]
        articles=[]
        titles=[]
        urls=[]
        imgurls=[]
        dictionaries=self.everything["articles"]
        for dic in dictionaries:
            text=(dic["content"])
            completearticles.append(dic["title"]+". "+text)
            articles.append(text)
            titles.append(dic["title"])
            urls.append(dic["url"])
            imgurls.append(dic["urlToImage"])
        self.completearticles=completearticles
        self.articles=articles
        self.titles=titles
        self.urls=urls
        self.imgurls=imgurls
        
    def return_articles(self):
        return(self.articles)
    def return_titles(self):
        return(self.titles)
    def return_urls(self):
        return(self.urls)
    def return_imgurls(self):
        return(self.imgurls)
    
    #preprocessing step before converting to vectors
    def preprocess_text(self,text):
        textlist=text.split("… [+")
        text2=textlist[0]
        text2=text2.replace("\r"," ")
        text2=text2.replace("\n"," ")
        textlist=text2.split(" ")
        textlist=[text for text in textlist if text!=""]
        textlist=textlist[:len(textlist)-1]
        text=" ".join(textlist)
        text = text.lower()
        tokenizer = RegexpTokenizer(r'\w+') #tokenize words
        tokens = tokenizer.tokenize(text)
        punctuation = list(string.punctuation)
        stoplist = stopwords.words('english')
        stoplist = set(stoplist) #like a list, but can use hash table
        tokens = [WordNetLemmatizer().lemmatize(token) for token in tokens] #lemmatize all tokens
        tokens = [w for w in tokens if not w.isdigit()]  #remove digits
        tokens = [w for w in tokens if len(w)>2]  #remove words having 2 or less chars
        tokens = [w for w in tokens if not w in punctuation] #remove punctuations 
        tokens = [w for w in tokens if not w in stoplist] #remove stopwords
    #     stemmed = [sno.stem(words) for words in filtered_words]
        return (" ".join(tokens)) #remove large sentence with all purified words
    
    def return_processed_texts(self):
        articles=np.array(self.completearticles)
        processed_articles=[self.preprocess_text(text) for text in articles]
        return(processed_articles)

