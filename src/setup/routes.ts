import { Application } from "express";

import makeExpressCallback from "../utils/express-callback";

import addGroceryItemController from "../controllers/admin/add-grocery-item";
import listGroceryItemsController from "../controllers/admin/list-grocery-items";
import adjustInventoryOfGroceryItemController from "../controllers/admin/adjust-inventory-of-grocery-item";
import editGroceryItemController from "../controllers/admin/edit-grocery-item";
import deleteGroceryItemController from "../controllers/admin/remove-grocery-item";
import listGroceryItemsForUserController from "../controllers/user/list-grocery-items";
import placeOrderController from "../controllers/user/place-order";

export default async function setupRoutes(app: Application) {
  /**
   * Admin Routes
   */
  app.post(
    "/api/v1/admin/grocery/add",
    makeExpressCallback(addGroceryItemController)
  );
  app.post(
    "/api/v1/admin/grocery/list",
    makeExpressCallback(listGroceryItemsController)
  );
  app.post(
    "/api/v1/admin/grocery/adjust-inventory",
    makeExpressCallback(adjustInventoryOfGroceryItemController)
  );
  app.post(
    "/api/v1/admin/grocery/edit",
    makeExpressCallback(editGroceryItemController)
  );
  app.post(
    "/api/v1/admin/grocery/remove",
    makeExpressCallback(deleteGroceryItemController)
  );

  /**
   * User Routes
   */
  app.post(
    "/api/v1/user/grocery/list",
    makeExpressCallback(listGroceryItemsForUserController)
  );

  app.post(
    "/api/v1/user/grocery/order",
    makeExpressCallback(placeOrderController)
  );
}
