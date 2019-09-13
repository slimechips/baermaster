import { Router, Response, Request, NextFunction } from 'express'; // eslint-disable-line
import { endpoints } from 'f10-util/configs';
import axios from 'f10-util/axios';
import rand from 'randomstring';

export const router = Router();

interface IdTokenRes {
  idToken: string;
  expiresIn: number;
  id: string;
}

/**
 * Return the login token of the user, if valid
 * @param req Request
 * @param res Response
 */
export const getLogin = (req: Request, res: Response, next: NextFunction) => {
  const {
    id,
    password,
  } = req.query;

  checkCustomerCredentials(id, password).then(() => generateIdToken(id))
    .then((idTokenObj) => {
      const status: number = 200;
      const json: object = {
        id_token: idTokenObj.idToken,
        expiry: idTokenObj.expiresIn,
        username: idTokenObj.id,
      };
      res.status(status).json(json);
    }).catch((err) => {
      next({ err });
    });
};

interface DBLoginRes {
  valid: boolean;
  username: boolean;
}

/**
 * Check if user credentials are valid
 * @param id username
 * @param password pw
 */
function checkCustomerCredentials(id: string, password: string): Promise<DBLoginRes> {
  const getUrl = `${endpoints.db.full_url}/customer/${id}/password`;
  return new Promise((resolve, reject) => {
    axios.get(getUrl).then((resp) => {
      if (resp.status >= 400 || resp.data.password !== password) {
        reject(new Error('Invalid User Or Wrong Password!'));
      } else {
        resolve(resp.data);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Generate ID token (fake)
 */
function generateIdToken(id: string): IdTokenRes {
  const idToken = rand.generate({ length: 50, charset: 'alphanumeric' });
  const expiresIn = 3600 * 24;
  return { idToken, expiresIn, id };
}
