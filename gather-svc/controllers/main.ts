import { Response, Request, NextFunction, Router } from 'express'; // eslint-disable-line
import axios from 'f10-util/axios';
import { parseString } from 'xml2js';
import { AxiosResponse } from 'axios';
import { promisify } from 'util';
import { cfg, endpoints } from 'f10-util/configs';
import { DeepSearchObj } from '../models/DeepSearchObj';
import { CustomerPDataObj } from '../models/CustomerPData';
import { GatherObj } from '../models/GatherObj';

// Init router here
export const router = Router();

// Keep yo promises
const parseStringAsync: Function = promisify(parseString);

export const gatherA = (req: Request, res: Response, next: NextFunction): void => {
  const { customer } = req.params;
  const body: GatherObj = {};
  _retrieveCustPData(customer)
    .then(() => _gatherZillow(cfg.zws.sample_address,
      cfg.zws.sample_citystatezip))
    .then((deepSearchObj: DeepSearchObj) => {
      body.zillow = deepSearchObj;
    })
    .then(() => sleep(5000))
    .then(() => {
      res.status(200).json(body);
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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}