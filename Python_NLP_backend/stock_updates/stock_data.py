#!/usr/bin/env python

try:
    # For Python 3.0 and later
    from urllib.request import urlopen
except ImportError:
    # Fall back to Python 2's urllib2
    from urllib2 import urlopen

import json

def get_jsonparsed_data(url):
    """
    Receive the content of ``url``, parse it as JSON and return the object.

    Parameters
    ----------
    url : str

    Returns
    -------
    dict
    """
    response = urlopen(url)
    data = response.read().decode("utf-8")
    return json.loads(data)


class stockprice():
    def get_stockname:
        
company="AAPL"
url = ("https://financialmodelingprep.com/api/company/historical-price/"+company+"?serietype=line&serieformat=array&datatype=json")
data=(get_jsonparsed_data(url))

print(list(data.keys()))

print(data['symbol'])
print((data['historical'][5][2]))

import matplotlib.pyplot as plt
import numpy as np

apple_stock=np.array(data['historical'])

stock_vals=np.array([value[2] for value in apple_stock]).astype(float)
print(float(stock_vals[0]))
import pandas as pd
df=pd.DataFrame()

df["stock_apple"]=stock_vals
#df.to_csv(r"D:\F10\apple_stock.csv")
print(df.head())

df["index"]=range(len(df))
df['stock_apple']=df['stock_apple'].astype(float)
df.plot.scatter(x='index',y='stock_apple')
