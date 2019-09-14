import { Response, Request, NextFunction, Router } from 'express'; // eslint-disable-line
import { endpoints } from 'f10-util/configs';
import axios from 'f10-util/axios';
import NodeCache from 'node-cache';
import { AxiosResponse, AxiosError } from 'axios';
import { CustCacheValue } from '../models/CustCacheValue';
import { IdTokenRes } from '../models/IdTokenRes';

const custCache: NodeCache = new NodeCache();

export const router = Router();

export const getLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { username: id, password } = req.query;

  _tryGetIdToken(id).then((cacheValue: CustCacheValue) => {
    _sendLoginCookies(res, cacheValue.id, cacheValue.idToken,
      cacheValue.expiry);
    res.status(200).json({
      login_success: true,
      id: cacheValue.id,
    });
  }).catch(() => _reqNewIdToken(id, password))
    .then((idTokenObj: IdTokenRes | void) => {
      if (idTokenObj === undefined) {
        throw new Error();
      }
      const { idToken, expiresIn } = idTokenObj;
      const loginResponse: object = {
        loginStatus: true,
        idToken,
        username: id,
      };
      _sendLoginCookies(res, id, idToken, expiresIn);
      res.status(200).json(loginResponse);
    })
    .catch((err) => {
      const extraParams: object = { loginStatus: false };
      next({
        err,
        extraParams,
        msg: 'Login failed: Wrong id/Password',
      });
    });
};

export const postEditDetails = (req: Request, res: Response,
  next: NextFunction): void => {
  const { customer } = req.params;
  const { details } = req.body;
  _dbEditDetails(customer, details).then(() => {
    res.status(200).send({ msg: 'Response Succeeded' });
  }).catch((err: Error) => {
    next({ err, msg: 'Failed to change data' });
  });
};

export const postAddReqUpload = (req: Request, res: Response,
  next: NextFunction): void => {
  const { customer } = req.params;
  const { upload }: { upload: Array<string> } = req.body;
  const apiUrl = `${endpoints.db.full_url}/customer/${customer}/upload/add`;
  axios.post(apiUrl, { upload }).then(() => {
    res.status(200).json({ msg: 'Uploads added' });
  }).catch((err: Error) => next({ err }));
};

export const getReqUpload = (req: Request, res: Response, next: NextFunction): void => {
  const { customer } = req.params;
  const apiUrl = `${endpoints.db.full_url}/customer/${customer}/upload/get`;
  axios.get(apiUrl).then((rs: AxiosResponse) => {
    res.status(200).json(rs.data);
  }).catch((err: AxiosError) => next({ err }));
};

export const getProcess = (req: Request, res: Response, next: NextFunction): void => {
  const { customer } = req.params;
  const apiUrl = `${endpoints.gather.full_url}/gather/${customer}/a`;
  axios.get(apiUrl).then((rs: AxiosResponse) => {
    res.status(200).json(rs.data);
  }).catch((err: AxiosError) => next({ err }));
};

function _dbEditDetails(customer: string,
  details: object): Promise<AxiosResponse> {
  const apiUrl = `${endpoints.db.full_url}/customer/${customer}/details/edit`;
  const postBody: object = details;

  return new Promise<AxiosResponse>((resolve, reject): void => {
    axios.post(apiUrl, postBody).then((rs: AxiosResponse) => {
      resolve(rs);
    }).catch(reject);
  });
}

const _tryGetIdToken = (id: string): Promise<CustCacheValue> => (
  new Promise<CustCacheValue>((resolve, reject): void => {
    custCache.get(id, (err, val: object | undefined): void => {
      if (!err || val === undefined) {
        reject(new Error('Id token not found'));
      }
      resolve(val as CustCacheValue);
    });
  })
);

function _sendLoginCookies(res: Response, id: string,
  idToken: string, expiry: number): void {
  res.cookie('id', id, {
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

const _reqNewIdToken = (id: string, password: string): Promise<IdTokenRes> => {
  const getUrl = `${endpoints.asp.full_url}/customer/login`
    + `?id=${id}&password=${password}`;
  return new Promise<IdTokenRes>((resolve, reject): void => {
    axios.get(getUrl).then((resp) => {
      if (resp.status >= 400 || resp.data.id_token === undefined) {
        reject(new Error('Server Returned Error'));
      } else {
        const idTokenRes: IdTokenRes = {
          idToken: resp.data.id_token,
          username: resp.data.id,
          expiresIn: resp.data.expiry,
        };
        resolve(idTokenRes);
      }
    }).catch(reject);
  });
};
