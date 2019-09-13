import { Response, Request, NextFunction, Router } from 'express';
import { endpoints } from 'f10-util/configs';
import axios from 'f10-util/axios';
import NodeCache from 'node-cache';
import { AxiosResponse } from 'axios';
import { UserCacheValue } from '../models/userCacheValue';
import { IdTokenRes } from '../models/IdTokenRes';

export const router = Router();

const userCache: NodeCache = new NodeCache();

export const getLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.query;

  _tryGetIdToken(username).then((cacheValue: UserCacheValue) => {
    _sendLoginCookies(res, cacheValue.id, cacheValue.idToken,
      cacheValue.expiry);
    res.status(200).json({
      login_success: true,
      username: cacheValue.id,
    });
  }).catch(() => _reqNewIdToken(username, password))
    .then((idTokenObj: IdTokenRes | void) => {
      if (idTokenObj === undefined) {
        throw new Error();
      }
      const { idToken, expiresIn } = idTokenObj;
      const loginResponse: object = {
        loginStatus: true,
        idToken,
        username,
      };
      _sendLoginCookies(res, username, idToken, expiresIn);
      res.status(200).json(loginResponse);
    })
    .catch((err) => {
      const extraParams: object = { loginStatus: false };
      next({
        err,
        extraParams,
        msg: 'Login failed: Wrong Username/Password',
      });
    });
};

/**
 * Get the list of customers from db-svc
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const getCustomers = (req: Request, res: Response,
  next: NextFunction): void => {
  const { username } = req.params;
  _getCustomersDB(username)
    .then(_getCustDataDB)
    .then((customers: object) => res.status(200).json(customers))
    .catch((err: Error) => {
      next({ err, msg: 'Get Customers Failed: Most likely user doesnt exist' });
    });
};

export const getNews = (req: Request, res: Response, next: NextFunction): void => {
  const { username } = req.params;
  const { customer_ids: customerIds } = req.query;

  let sendParams = '';
  if (customerIds !== undefined) {
    let first = true;
    customerIds.forEach((customer: string) => {
      if (first) first = false;
      else sendParams += '|';
      sendParams += customer;
    });
    sendParams = `customer_ids=${encodeURIComponent(sendParams)}`;
  } else {
    sendParams = `username=${encodeURIComponent(username)}`;
  }

  const apiUrl = `${endpoints.news.full_url}/news/get?${sendParams}`;

  axios.get(apiUrl).then((rs: AxiosResponse) => {
    res.status(200).send(rs.data);
  }).catch((err) => next({ err }));
};

const _tryGetIdToken = (username: string): Promise<UserCacheValue> => (
  new Promise<UserCacheValue>((resolve, reject): void => {
    userCache.get(username, (err, val: object | undefined): void => {
      if (!err || val === undefined) {
        reject(new Error('Id token not found'));
      }
      resolve(val as UserCacheValue);
    });
  })
);

function _sendLoginCookies(res: Response, username: string,
  idToken: string, expiry: number): void {
  res.cookie('username', username, {
    expires: new Date(expiry * 1000 + Date.now()),
    httpOnly: false,
    secure: false,
    domain: 'localhost',
    path: '/login',
  });

  res.cookie('id_token', idToken, {
    expires: new Date(expiry * 1000 + Date.now()),
    httpOnly: false,
    secure: false,
  });
}

const _reqNewIdToken = (username: string, password: string): Promise<IdTokenRes> => {
  const getUrl = `${endpoints.asp.full_url}/user/login`
    + `?username=${username}&password=${password}`;
  return new Promise<IdTokenRes>((resolve, reject): void => {
    axios.get(getUrl).then((resp) => {
      if (resp.status >= 400 || resp.data.id_token === undefined) {
        reject(new Error('Server Returned Error'));
      } else {
        const idTokenRes: IdTokenRes = {
          idToken: resp.data.id_token,
          username: resp.data.username,
          expiresIn: resp.data.expiry,
        };
        resolve(idTokenRes);
      }
    }).catch(reject);
  });
};

const _getCustomersDB = (username: string): Promise<Array<string>> => {
  const encUsername = encodeURIComponent(username);
  const getUrl = `${endpoints.db.full_url}/user/${encUsername}/customers/get`;

  return new Promise<Array<string>>((resolve, reject): void => {
    axios.get(getUrl).then((rs: AxiosResponse) => {
      if (rs.data.customers === undefined) {
        return reject(new Error('Couldnt get Customer Data'));
      }
      return resolve(rs.data.customers);
    }).catch(reject);
  });
};

const _getCustDataDB = (customers: Array<string>): Promise<object> => {
  let customerString = '';
  let first = true;
  customers.forEach((customer: string) => {
    if (first) first = false;
    else customerString += '|';
    customerString += customer;
  });
  const encCustomers = encodeURIComponent(customerString);
  const getUrl = `${endpoints.db.full_url}/customer/${encCustomers}/getdetails/`;

  return new Promise<object>((resolve, reject): void => {
    axios.get(getUrl).then((rs: AxiosResponse) => {
      if (rs.data.customer_dets === undefined) {
        return reject(new Error('Couldnt get Customer Details'));
      }
      return resolve(rs.data);
    }).catch(reject);
  });
};
