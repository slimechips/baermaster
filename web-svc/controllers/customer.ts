import { Response, Request, NextFunction, Router } from 'express'; // eslint-disable-line
import { endpoints } from 'f10-util/configs';
import axios from 'f10-util/axios';
import { AxiosResponse } from 'axios';

export const router = Router();

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
