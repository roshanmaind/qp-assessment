import Joi from "joi";
import logger from "../../setup/logging";
import editGroceryItemUseCase from "../../use-cases/admin/edit-grocery-item";

const schema = Joi.object({
  groceryId: Joi.string().guid().required(),
  name: Joi.string().max(255).optional(),
  price: Joi.number().min(0).optional(),
});

interface Response {
  statusCode: number;
  body: {
    error?: string;
    message?: string;
  };
}
export default async function editGroceryItemController(
  httpRequest: any
): Promise<Response> {
  // Validate the request body against the schema
  const validation = schema.validate(httpRequest.body);
  if (validation.error) {
    logger.debug("editGroceryItemRequest: validation error", {
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
  const error = await editGroceryItemUseCase({
    groceryId,
    price,
    name,
  });
  if (error) {
    logger.debug("editGroceryItemController: use case error", {
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
      message: "Grocery item edited successfully!",
    },
  };
}
