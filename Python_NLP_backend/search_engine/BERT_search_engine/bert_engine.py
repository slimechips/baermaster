#Manual in-house search engine using BERT
import pandas as pd
import numpy as np
from bert_embedding import BertEmbedding
from sklearn.metrics.pairwise import cosine_similarity
#Steps:
"""
1. Make a database of all the documents. Query from newsapi using keywords "stocks, markets, trade etc"d
2. Then take the client stock names, country of respective stocks, and other metadata to form a string.
3. Make a database of Bert embeddings for each of the documents.
4. Make query embedded vector. Perform cosine similarity to find top 5 most similar documents, and return
doc title, doc first para and 
"""

class bert_instance():
    bert_embedding = BertEmbedding()
    def matrix(self,processed_texts,enquiry):
        all_vectors=[]
        enquiry_vector=[]
        enquiry_vector.append(self.return_vectors(enquiry))
        enquiry_vector=np.array(enquiry_vector)
        for text in processed_texts:
            all_vectors.append(self.return_vectors(text))
        all_vectors=np.array(all_vectors)
        print(all_vectors)
        print(all_vectors.shape)
        matrix=cosine_similarity(all_vectors,enquiry_vector)
        return(matrix)
    def return_vectors(self,text):
        vectorfile=self.bert_embedding([text]) 
        print(len(vectorfile))
        #for i in range(len(vectorfile)):
        vectorlist=vectorfile[0][1]
        #print(vectorlist)
        sum_vector=np.empty(shape=vectorlist[0].shape)
        sum_amt=0
        for vector in vectorlist:
            sum_amt+=(vector[0])
            sum_vector+=vector
        sum_vector/=len(vectorlist)
        sum_vector=np.nan_to_num(sum_vector)
        return(sum_vector)
    
        
    



    

#now use cosine similarity from sklearn

#print(len(sentences))
#print(len(result))

