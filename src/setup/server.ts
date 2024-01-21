import { Application, json } from 'express';
import { appDataSource } from "./database/app-data-source"
import logger from './logging';
import setupRoutes from './routes';

/**
 * Setup the express server
 */
export default async function serverSetup(app: Application) {
  // Add middleware to express app
  app.use(json());

  /**
   * Initialize the data source
   * Connect to the postgres database using typeorm
   */
  try {
    await appDataSource.initialize()
    logger.info("Data Source has been initialized!")
  } catch (err) {
    logger.error("Error during Data Source initialization:", err)
  }

  // Setup routes
  await setupRoutes(app);

  // start express server
  const port = process.env.PORT || 3000;
  app.listen(port)
  logger.info(`Express server has started on port ${port}`)
}