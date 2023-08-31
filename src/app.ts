import 'dotenv/config'
import { join } from 'node:path';
import express, { Express, Request, Response } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { engine } from 'express-handlebars';
import expressLogger from './logger.ts';
import helmet from 'helmet';
import { initDatabase } from './models/index.ts';

import accountManagementPages from './pages/pageRoutes.ts';
import subscribeEndpoints from './endpoints/subscribe.ts';

const app: Express = express();
const port: number = parseInt(process.env.HTTP_PORT as string) || 3000;

const limiter: RateLimitRequestHandler = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 20, // 20 requests per IP over windowMs
	standardHeaders: true
});

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(expressLogger);

app.get('/', (req: Request, res: Response) => {
	res.json({ status: "online" });
});

// Static subscription management pages.
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', join(__dirname, 'pages'));
accountManagementPages(app);

// API (un)subscription endpoints
subscribeEndpoints(app);

// // Initialise database by syncing models
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: resolve(process.env.DB_FILE as string)
// });
// sequelize.sync();
(async () => {
  const i = await initDatabase();
})()

app.listen(port, () => {
  console.log(`[HERMES] HTTP server started on port ${port}`);
});