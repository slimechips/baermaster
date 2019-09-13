import { Request, Response, NextFunction, Router } from 'express';
import { cfg } from 'f10-util/configs';
import { pool } from './init';
import { MySQLResponse } from '../models/MySQLResponse';
import { getGenericData, formatString } from './common';
import { NewsDetails, NewsObj } from '../models/NewsDetails';
import { CustData } from '../models/CustData';

export const router = Router();

export const postEditDetails = (req: Request, res: Response,
  next: NextFunction): void => {
  let { customer } = req.params;
  customer = decodeURIComponent(customer);
  const details = req.body;
  const cond = `(id = '${customer}')`;

  _editCustomerData(details, cond).then(() => {
    res.status(200).json({ success: true });
  }).catch((err: Error) => next({ err }));
};

export const getPassword = (req: Request, res: Response,
  next: NextFunction): void => {
  const cond = `id = '${req.params.id}' LIMIT 1`;
  _getCustData('password', cond).then((rs: CustData) => {
    const json: object = {
      id: req.params.id,
      password: rs.password,
    };
    res.status(200).send(json);
  }).catch((err) => next({ err }));
};

export const getCustomerDetails = (req: Request, res: Response,
  next: NextFunction): void => {
  const customersStr: string = decodeURIComponent(req.params.customers);
  const customers: Array<string> = _splitStrData(customersStr);
  const fieldsParam = '*';

  let allCustData: object = {};
  let iterationsLeft: number = customers.length;
  customers.forEach((customer: string) => {
    const cond = `id = '${customer}' LIMIT 1`;
    _getCustData(fieldsParam, cond).then((custData: object) => {
      allCustData = { ...allCustData, [customer]: custData };
    }).catch(() => {
      const custData = 'Customer data unavailable';
      allCustData = { ...allCustData, [customer]: custData };
    }).then(() => {
      iterationsLeft -= 1;
      if (iterationsLeft <= 0) {
        res.status(200).send({ customer_dets: allCustData });
      }
    })
      .catch((err: Error) => next({ err }));
  });
};

export const getNews = (req: Request, res: Response,
  next: NextFunction): void => {
  const customersStr: string = decodeURIComponent(req.params.customers);
  const customers: Array<string> = _splitStrData(customersStr);
  const fieldsParam = 'news_article_1, news_article_2, news_article_3, news_article_4, '
  + 'news_title_1, news_title_2, news_title_3, news_title_4, '
  + 'news_url_1, news_url_2, news_url_3, news_url_4, '
  + 'news_imgurl_1, news_imgurl_2, news_imgurl_3, news_imgurl_4, '
  + 'name';

  let allCustData: object = {};
  let iterationsLeft: number = customers.length;
  customers.forEach((customer: string) => {
    const cond = `id = '${customer}' LIMIT 1`;
    _getCustData(fieldsParam, cond).then((custData: object) => {
      allCustData = { ...allCustData, [customer]: custData };
    }).catch(() => {
      const custData = 'Customer data unavailable';
      allCustData = { ...allCustData, [customer]: custData };
    }).then(() => {
      iterationsLeft -= 1;
      if (iterationsLeft <= 0) {
        res.status(200).send(allCustData);
      }
    })
      .catch((err: Error) => next({ err }));
  });
};

export const postNews = (req: Request, res: Response,
  next: NextFunction): void => {
  let { customer } = req.params;
  customer = decodeURIComponent(customer);
  const { news }: { news: NewsDetails } = req.body;
  const toUpload: NewsObj = {};
  for (let i = 1; i <= 4; i += 1) {
    toUpload[`news_article_${i}`] = news.articles[i - 1];
    toUpload[`news_title_${i}`] = news.titles[i - 1];
    toUpload[`news_url_${i}`] = news.urls[i - 1];
    toUpload[`news_imgurl_${i}`] = news.imgurls[i - 1];
  }
  const cond = `(id = '${customer}')`;

  _editCustomerData(toUpload, cond).then(() => {
    res.status(200).json({ success: true });
  }).catch((err: Error) => next({ err }));
};

const _editCustomerData = (toAdd: object, cond: string): Promise<MySQLResponse> => {
  let sqlCommand = `UPDATE ${cfg.db_details.cust_dir_table} SET `;
  let first = true;

  Object.entries(toAdd).forEach(([column, detail]: [string, string]) => {
    if (!first) {
      sqlCommand += ', ';
    } else {
      first = false;
    }
    const formattedDetail = formatString(detail);
    sqlCommand += `${column} = "${formattedDetail}"`;
  });

  const where: string = cond == null ? '' : ` WHERE ${cond}`;
  sqlCommand += where;
  console.info(`_addCustomerData: sqlCommand=${sqlCommand}`);

  return new Promise((resolve, reject): void => {
    pool.query(sqlCommand, (err: Error, rs: MySQLResponse) => {
      if (err) return reject(err);
      console.info(`Db data: ${JSON.stringify(rs)}`);
      if (rs.affectedRows === 0) return reject(new Error('Customer not found'));
      return resolve(rs);
    });
  });
};

const _splitStrData = (data: string): Array<string> => {
  const splitData: Array<string> = data.split('|');
  return splitData;
};

/**
 * Get data about a customerr
 * @param fieldsParam Fields to get info about
 * @param cond Which condition(customer) to get from
 */
const _getCustData = (fieldsParam: string,
  cond: string): Promise<CustData> => getGenericData('Customer',
    cfg.db_details.cust_dir_table, fieldsParam, cond) as Promise<CustData>;
