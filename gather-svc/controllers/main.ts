import { Response, Request, NextFunction, Router } from 'express'; // eslint-disable-line
import axios from 'f10-util/axios';
import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';
import { AxiosResponse } from 'axios';
import { promisify } from 'util';
import { cfg, endpoints, appDir } from 'f10-util/configs';
import { DeepSearchObj } from '../models/DeepSearchObj';
import { CustomerPDataObj } from '../models/CustomerPData';
import { GatherObj } from '../models/GatherObj';

// Init router here
export const router = Router();

// Keep yo promises
const parseStringAsync: Function = promisify(parseString);

export const gatherA = (req: Request, res: Response, next: NextFunction): void => {
  let { customer } = req.params;
  customer = 'John Smith';
  const bodySend: GatherObj = {};
  bodySend.basic_data = _gatherBasicData(customer);
  _gatherExData(customer)
    .then((obj: object) => {
      bodySend.ex_data = obj;
    })
    .then(() => _gatherZillow(cfg.zws.sample_address,
      cfg.zws.sample_citystatezip))
    .then((deepSearchObj: DeepSearchObj) => {
      bodySend.zillow = deepSearchObj;
    })
    .then(() => {
      console.log(bodySend);
      res.status(200).json(bodySend);
    })
    .then(() => {
      const writePath = path.join(appDir, 'custdata.json');
      fs.writeFileSync(writePath, JSON.stringify(bodySend));
    })
    .catch((err: Error) => next({ err }));
};

const _retrieveCustPData = (customer: string): Promise<CustomerPDataObj> => {
  const apiUrl = `${endpoints.db.full_url}/customer/${customer}/pd/get`;
  return new Promise<CustomerPDataObj>((resolve, reject): void => {
    // axios.get(apiUrl).then((res: AxiosResponse) => {
    //   resolve(res.data);
    // }).catch(reject);
    resolve();
  });
};

const _gatherZillow = (address: string,
  cityStateZip: string): Promise<DeepSearchObj> => {
  const apiUrl = `${cfg.zws.zws_deepsearch_url}?zws-id=${cfg.zws.zws_id}`
    + `&address=${address}&citystatezip=${cityStateZip}`;
  return new Promise<DeepSearchObj>((resolve, reject): void => {
    axios.get(apiUrl).then((rs: AxiosResponse) => parseStringAsync(rs.data))
      .then(resolve)
      .catch(reject);
  });
};

const _gatherBasicData =  (customer: string): object => {
  const filePath = path.join(appDir, './customer.json');
  const basicData = JSON.parse(fs.readFileSync(filePath).toString());
  // Insert MEthod to get data here
  return basicData;
};

const _gatherExData = (customer: string): Promise<object> => {
  const apiUrl = `${cfg.namescan_url}/emerald`;
  const headers = {
    Accept: 'application/json',
    'api-key': '4951327B013F4D10BD8066F8E833A7A9',
  };

  const body = {
    name: 'John Smith',
    first_name: 'John',
    last_name: 'Smith',
    gender: 'male',
    dob: '1975',
    country: 'United States',
    list_type: 'pep',
    match_rate: 50,
  };
  return new Promise<object>((resolve, reject): void => {
    axios.post(apiUrl, body, { headers })
      .then((rs: AxiosResponse) => resolve(rs.data))
      .catch(reject);
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}