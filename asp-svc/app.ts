import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const svc = 'asp';
process.env.SVC = `${svc}-svc`;
import { cfg, endpoints } from 'f10-util/configs';
import { reqLogger } from 'f10-util/logger';
import { errorHandler } from 'f10-util/error';

// Controllers
import * as userController from './controllers/user';

const app: express.Application = express();

// Engine Setup
app.use(bodyParser()); // Body Parser Middle Ware
app.use(cookieParser(cfg.client_secret)); // Cookie MiddleWare
app.use(reqLogger); // Logger Middleware

// Add custom routes here
app.get('/login', userController.getLogin);

// Error Handling Middleware goes here
app.use(errorHandler);

app.listen(endpoints[svc].http_port, () => {
  console.log(`App listening on port ${endpoints[svc].http_port}`);
});

module.exports = {
  app,
};
