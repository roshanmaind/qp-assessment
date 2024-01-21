import getDataRepository from "../../setup/database/get-data-repository";
import { Grocery } from "../../entity/Grocery.entity";
import { Like } from "typeorm";

interface IListGroceryItemsInput {
  pagination: {
    page: number; // starts from 1
    limit: number;
  };
  searchKeyword: string;
}

interface IListGroceryItemsResponse {
  groceries?: Grocery[];
  total?: number;
  error?: string;
}

export default async function listGroceryItemsUseCase(
  listGroceryItemsInput: IListGroceryItemsInput
): Promise<IListGroceryItemsResponse> {
  // Extract the pagination and searchKeyword from the input
  const { pagination, searchKeyword } = listGroceryItemsInput;

  // Set the default pagination values
  let take = 200;
  let skip = 0;
  if (pagination) {
    take = pagination.limit;
    skip = pagination.limit * (pagination.page - 1);
  }

  // Find the grocery items
  const groceryRepository = await getDataRepository(Grocery);
  const [result, total] = await groceryRepository.findAndCount({
    where: {
      name: searchKeyword ? Like("%" + searchKeyword + "%") : undefined,
    },
    order: { name: "DESC" },
    take,
    skip,
  });

  // Return the grocery items and total
  return {
    groceries: result,
    total,
  };
}
