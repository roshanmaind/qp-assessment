import Joi from "joi";
import logger from "../../setup/logging";
import placeOrderUseCase from "../../use-cases/user/place-order";

const lineItemSchema = Joi.object({
  groceryId: Joi.string().guid().required(),
  quantity: Joi.number().integer().min(1).required(),
});
const schema = Joi.object({
  lineItems: Joi.array().items(lineItemSchema).min(1).required(),
});

interface Response {
  statusCode: number;
  body: {
    error?: string;
    message?: string;
  };
}

export default async function placeOrderController(
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
  const { lineItems } = httpRequest.body;
  const error = await placeOrderUseCase({
    lineItems,
  });
  if (error) {
    logger.debug("placeOrderController: use case error", {
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
      message: "Order placed successfully!",
    },
  };
}
