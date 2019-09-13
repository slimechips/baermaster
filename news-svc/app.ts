import express from 'express';
import bodyParser from 'body-parser';

const svc = 'news';
process.env.SVC = `${svc}-svc`;
import { endpoints } from 'f10-util/configs';
import { reqLogger } from 'f10-util/logger';
import { errorHandler } from 'f10-util/error';

// Controllers
import * as newsController from './controllers/news';

const app: express.Application = express();

// Engine Setup
app.use(bodyParser.urlencoded({ extended: true })); // Body Parser Middle Ware
app.use(bodyParser.json()); // Body Parser Middle Ware
app.use(reqLogger); // Logger Middleware

// Init user controller internal routes here
newsController.router.get('/get', newsController.getNews);

// Add custom controller routes here
app.use('/news', newsController.router);

// Error Handling Middleware goes here
app.use(errorHandler);

app.listen(endpoints[svc].http_port, () => {
  console.log(`App listening on port ${endpoints[svc].http_port}`);
});

module.exports = {
  app,
};
