import Joi from "joi";
import logger from "../../setup/logging";
import adjustInventoryOfGroceryItemUseCase from "../../use-cases/admin/adjust-inventory-of-grocery-item";

const schema = Joi.object({
  groceryId: Joi.string().guid().required(),
  adjustment: Joi.number().integer().required(),
});

interface Response {
  statusCode: number;
  body: {
    error?: string;
    message?: string;
  };
}
export default async function adjustInventoryOfGroceryItemController(
  httpRequest: any
): Promise<Response> {
  // Validate the request body against the schema
  const validation = schema.validate(httpRequest.body);
  if (validation.error) {
    logger.debug("adjustInventoryOfGroceryItemRequest: validation error", {
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
  const { groceryId, adjustment } = httpRequest.body;
  const error = await adjustInventoryOfGroceryItemUseCase({
    groceryId,
    adjustment,
  });
  if (error) {
    logger.debug("adjustInventoryOfGroceryItemController: use case error", {
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
      message: "Grocery item inventory adjusted successfully!",
    },
  };
}
