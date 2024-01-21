import Joi from "joi";
import logger from "../../setup/logging";
import listGroceryItemsForUserUseCase from "../../use-cases/user/list-grocery-items";

const schema = Joi.object({
  pagination: Joi.object({
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
  }),
  searchKeyword: Joi.string().max(255).optional(),
});

interface Response {
  statusCode: number;
  body: {
    error?: string;
    groceries?: any;
    total?: number;
  };
}
export default async function listGroceryItemsForUserController(
  httpRequest: any
): Promise<Response> {
  // Validate the request body against the schema
  const validation = schema.validate(httpRequest.body);
  if (validation.error) {
    logger.debug("listGroceryItemsRequest: validation error", {
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
  const { pagination, searchKeyword } = httpRequest.body;
  const { error, groceries, total } = await listGroceryItemsForUserUseCase({
    pagination,
    searchKeyword,
  });
  if (error) {
    logger.debug("listGroceryItemsForUserController: use case error", {
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
      groceries,
      total,
    },
  };
}
