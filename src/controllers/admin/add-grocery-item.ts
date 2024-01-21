import Joi from "joi";
import logger from "../../setup/logging";
import addGroceryItemUseCase from "../../use-cases/admin/add-grocery-item";

const schema = Joi.object({
  name: Joi.string().max(255).required(), // max length 255
  price: Joi.number().min(0).required(),
  inventoryLevel: Joi.number().integer().min(0).required(),
});

interface Response {
  statusCode: number;
  body: {
    error?: string;
    message?: string;
  };
}
export default async function addGroceryItemController(
  httpRequest: any
): Promise<Response> {
  // Validate the request body against the schema
  const validation = schema.validate(httpRequest.body);
  if (validation.error) {
    logger.debug("addGroceryItemController: validation error", {
      error: validation.error.details[0].message,
      httpRequest: httpRequest.body,
    });
    return {
      statusCode: 400,
      body: {
        error: validation.error.details[0].message,
      },
    };
  }

  // Call the use case
  const { name, price, inventoryLevel } = httpRequest.body;
  const error = await addGroceryItemUseCase({ name, price, inventoryLevel });
  if (error) {
    logger.debug("addGroceryItemController: use case error", {
      error,
      httpRequest: httpRequest.body,
    });
    return {
      statusCode: 400,
      body: {
        error,
      },
    };
  }
  return {
    statusCode: 200,
    body: {
      message: "Grocery item added successfully!",
    },
  };
}
