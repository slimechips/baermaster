import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const svc = 'web';
process.env.SVC = `${svc}-svc`;
import { cfg, endpoints } from 'f10-util/configs';
import { reqLogger } from 'f10-util/logger';
import { errorHandler } from 'f10-util/error';

// Controllers
import * as userController from './controllers/user';
import * as custController from './controllers/customer';

const app: express.Application = express();

// Engine Setup
app.use(bodyParser.urlencoded({ extended: true })); // Body Parser Middle Ware
app.use(bodyParser.json()); // Body Parser Middle Ware
app.use(cookieParser(cfg.client_secret)); // Cookie MiddleWare
app.use(cors({ origin: '*' })); // Cors middleware
app.use(reqLogger); // Logger Middleware

// Init User controller internal routes here
userController.router.get('/login', cors(), userController.getLogin);
userController.router.get('/:username/customers/get', userController.getCustomers);
userController.router.get('/:username/news', userController.getNews);

// Init Customer controller internal routes here
custController.router.get('/:customer/details/get', custController.getDetails);
custController.router.post('/:customer/details/edit', custController.postEditDetails);
custController.router.get('/login', custController.getLogin);
custController.router.post('/:customer/upload/add', custController.postAddReqUpload);
custController.router.get('/:customer/upload/get', custController.getReqUpload);
custController.router.get('/:customer/gather/a', custController.getProcess);

// Add custom routes here
app.use('/user', userController.router);
app.use('/customer', custController.router);

// Error Handling Middleware goes here
app.use(errorHandler);

app.listen(endpoints[svc].http_port, () => {
  console.log(`App listening on port ${endpoints[svc].http_port}`);
});

module.exports = {
  app,
};
