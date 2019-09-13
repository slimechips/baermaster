import { Response, Request, Router, NextFunction } from 'express'; // eslint-disable-line
import { endpoints, appDir, cfg } from 'f10-util/configs';
import fs from 'fs';
import axios from 'f10-util/axios';
import path from 'path';
import shell, { ShellString } from 'shelljs';
import { AxiosResponse } from 'axios';
import { Customer, CustomerObj, CustomersData, InterestObj,
  MInterestObj, NewsObj } from '../models/Customer';

// Init router here
export const router = Router();

/**
 * Accepts username or cusomter ids, then gets their interests and get news.
 * @param req Request
 * @param res Result
 * @param next Next
 */
export const getNews = (req: Request, res: Response, next: NextFunction): void => {
  const { customer_ids: encCustomerIds, username } = req.query;
  const customerIds: string = decodeURIComponent(encCustomerIds);
  let customerString = '';

  _getCustomersDB(username)
    .then((customerIds2: Array<string>) => {
      let first = true;
      customerIds2.forEach((customer: string) => {
        if (first) first = false;
        else customerString += '|';
        customerString += customer;
      });
    })
    .catch(() => {
      if (customerIds === undefined) throw new Error('Invalid Request');
      customerString = customerIds;
    })
    .then(() => _getCurrentNews(customerString))
    .then((rs) => res.status(200).json(rs))
    .catch((err) => next({ err }))
    .then(() => _getCustDataDB(customerString))
    .then(_extractCustInterests)
    .then((mInterestObj: MInterestObj) => {
      const nmInterestObj: MInterestObj = { ...mInterestObj };
      Object.entries(nmInterestObj)
        .forEach(([id, interestObj]: [string, InterestObj]) => {
          nmInterestObj[id].source = _writeInterests(interestObj.interests);
        });
      return nmInterestObj;
    })
    .then(_executeNLP)
    .then(_readNewsInformation)
    .then((mInterestObj: MInterestObj) => {
      const nmInterestObj = { ...mInterestObj };
      Object.entries(nmInterestObj)
        .forEach(([id, interestObj]: [string, InterestObj]) => {
          delete nmInterestObj[id].source;
          delete nmInterestObj[id].outPath;
          const apiUrl = `${endpoints.db.full_url}/customer/${id}/setnews`;
          axios.post(apiUrl, interestObj).then().catch((err: Error) => {
            throw err;
          });
        });
    })
    .catch((err: Error) => next({ err }));
};

const _getCurrentNews = (customerIds: string): Promise<NewsObj> => {
  const customerString = encodeURIComponent(customerIds);

  return new Promise<NewsObj>((resolve, reject): void => {
    axios.get(`${endpoints.db.full_url}/customer/${customerString}/getcurnews`)
      .then((res: AxiosResponse) => {
        resolve(res.data);
      }).catch(reject);
  });
};

const _getCustomersDB = (username: string): Promise<Array<string>> => {
  const apiUrl = `${endpoints.db.full_url}/user/${username}/customers/get`;

  return new Promise((resolve, reject): void => {
    if (username === undefined) reject();
    axios.get(apiUrl).then((rs: AxiosResponse) => {
      if (rs.data.customers === undefined) {
        return reject(new Error('Couldnt get customer data'));
      }
      return resolve(rs.data.customers);
    }).catch((err) => {
      console.error(err);
      reject(err);
    });
  });
};

const _getCustDataDB = (customerString: string): Promise<CustomersData> => {
  const encCustomers = encodeURIComponent(customerString);
  const getUrl = `${endpoints.db.full_url}/customer/${encCustomers}/getdetails/`;

  return new Promise<CustomersData>((resolve, reject): void => {
    axios.get(getUrl).then((rs: AxiosResponse) => {
      if (rs.data.customer_dets === undefined) {
        return reject(new Error('Couldnt get Customer Details'));
      }
      return resolve(rs.data);
    }).catch(reject);
  });
};

const _extractCustInterests = (custData: CustomersData): MInterestObj => {
  const mInterests: MInterestObj = {};
  Object.entries(custData.customer_dets)
    .forEach(([id, dataObj]: [string, CustomerObj]) => {
      const data: Customer = new Customer(dataObj);
      mInterests[id] = { interests: '', news: {}, source: '', outPath: '' };
      mInterests[id].interests = data.getInterests();
    });
  return mInterests;
};

const _writeInterests = (toWrite: string): string => {
  const sourceName = `${Math.round(Math.random() * 100000)}.txt`;
  const pathName = path.join(appDir, cfg.nlp_dir, cfg.buzzword_dir, sourceName);
  fs.writeFileSync(pathName, toWrite);
  return sourceName;
};

const _executeNLP = (mInterestObj: MInterestObj): MInterestObj => {
  const nmInterestObj: MInterestObj = { ...mInterestObj };
  Object.entries(mInterestObj)
    .forEach(([id, interestObj]: [string, InterestObj]) => {
      const sourcePath: string = interestObj.source;
      const result: ShellString = shell.exec(`cd ${cfg.nlp_dir} && ${cfg.anaconda_python} main_file.py ${sourcePath}`);
      if (result.code === 1) throw new Error('Failed to execute nlp'); // Failed
      const outputPath = path.join(appDir, cfg.nlp_dir, cfg.data_dir, sourcePath);
      nmInterestObj[id].outPath = outputPath;
    });
  return nmInterestObj;
};

const _readNewsInformation = (mInterestObj: MInterestObj): MInterestObj => {
  const nmInterestObj: MInterestObj = { ...mInterestObj };
  Object.entries(mInterestObj)
    .forEach(([id, interestObj]: [string, InterestObj]) => {
      const outputPath = interestObj.outPath;
      nmInterestObj[id].news = JSON.parse(fs.readFileSync(outputPath).toString());
    });
  return nmInterestObj;
};
