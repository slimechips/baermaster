import { Response, Request, NextFunction } from 'express'; // eslint-disable-line
import { endpoints } from 'f10-util/configs';
import axios from 'f10-util/axios';
import rand from 'randomstring';

interface IdTokenRes {
  idToken: string;
  expiresIn: number;
  username: string;
}

/**
 * Return the login token of the user, if valid
 * @param req Request
 * @param res Response
 */
export const getLogin = (req: Request, res: Response, next: NextFunction) => {
  const {
    username,
    password,
  } = req.query;

  checkUserCredentials(username, password).then(() => generateIdToken(username))
    .then((idTokenObj) => {
      const status: number = 200;
      const json: object = {
        id_token: idTokenObj.idToken,
        expiry: idTokenObj.expiresIn,
        username: idTokenObj.username,
      };
      res.status(status).json(json);
    }).catch((err) => {
      next({ err });
    });
};

export const hello = 'l';

interface DBLoginRes {
  valid: boolean;
  username: boolean;
}

/**
 * Check if user credentials are valid
 * @param username username
 * @param password pw
 */
function checkUserCredentials(username: string, password: string): Promise<DBLoginRes> {
  const getUrl = `${endpoints.db.full_url}/user/${username}/password`;
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
function generateIdToken(username: string): IdTokenRes {
  const idToken = rand.generate({ length: 50, charset: 'alphanumeric' });
  const expiresIn = 3600 * 24;
  return { idToken, expiresIn, username };
}
