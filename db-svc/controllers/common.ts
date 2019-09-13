import { pool } from './init';

/**
 * Get data about a row
 * @param fieldsParam Fields to get info about
 * @param cond Which condition to get from
 */
export const getGenericData = (rowType: string, table: string,
  fieldsParam: string, cond: string): Promise<object> => {
  const fields: string = fieldsParam === null ? '*' : fieldsParam;

  const where: string = cond == null ? '' : `WHERE ${cond}`;
  const sqlCommand: string = `SELECT ${fields} FROM `
    + `${table} ${where}`;
  console.info(`sqlCommand=${sqlCommand}`);

  return new Promise((resolve, reject): void => {
    pool.query(sqlCommand, (err: Error, rs: Array<object>) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.info(`Db data: ${JSON.stringify(rs)}`);
      if (rs.length === 0) reject(new Error(`${rowType} not found`));
      return resolve(rs[0]);
    });
  });
};

export const formatString = (str: string): string => {
  return str.replace(/"/g, '\'');
};

export const destructureSQL = (command: string):
  Array<string> => command.split(',');
