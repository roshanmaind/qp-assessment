import Joi from "joi";
import logger from "../../setup/logging";
import deleteGroceryItemUseCase from "../../use-cases/admin/remove-grocery-item";

const schema = Joi.object({
  groceryId: Joi.string().guid().required(),
});

interface Response {
  statusCode: number;
  body: {
    error?: string;
    message?: string;
  };
}
export default async function deleteGroceryItemController(
  httpRequest: any
): Promise<Response> {
  // Validate the request body against the schema
  const validation = schema.validate(httpRequest.body);
  if (validation.error) {
    logger.debug("deleteGroceryItemRequest: validation error", {
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
  const { groceryId, price, name } = httpRequest.body;
  const error = await deleteGroceryItemUseCase({
    groceryId,
  });
  if (error) {
    logger.debug("deleteGroceryItemController: use case error", {
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
      message: "Grocery item deleted successfully!",
    },
  };
}
