import getDataRepository from "../../setup/database/get-data-repository";
import { Grocery } from "../../entity/Grocery.entity";

interface IDeleteGroceryItemInput {
  groceryId: string;
}

export default async function deleteGroceryItemUseCase(
  input: IDeleteGroceryItemInput
): Promise<string | null> {
  // Extract the groceryId from the input
  const { groceryId } = input;

  // Find the grocery item by id
  const groceryRepository = await getDataRepository(Grocery);
  const groceryItem = await groceryRepository.findOne({
    where: { id: groceryId },
  });
  if (!groceryItem) {
    return "Grocery item not found";
  }

  // Delete the grocery item
  await groceryRepository.delete(groceryItem);

  // Return null if no error
  return null;
}
