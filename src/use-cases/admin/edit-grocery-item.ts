import getDataRepository from "../../setup/database/get-data-repository";
import { Grocery } from "../../entity/Grocery.entity";

interface IEditGroceryItemInput {
  groceryId: string;
  name?: string;
  price?: number;
}

export default async function editGroceryItemUseCase(
  input: IEditGroceryItemInput
): Promise<string | null> {
  // Extract the groceryId, name, and price from the input
  const { groceryId, name, price } = input;

  // Validate the input
  const changes = JSON.parse(JSON.stringify(input));
  delete changes.groceryId;
  if (Object.keys(changes).length === 0) {
    return "No changes to make";
  }

  // Find the grocery item by id
  const groceryRepository = await getDataRepository(Grocery);
  const groceryItem = await groceryRepository.findOne({
    where: { id: groceryId },
  });
  if (!groceryItem) {
    return "Grocery item not found";
  }

  // Update the grocery item
  groceryItem.name = name || groceryItem.name;
  groceryItem.price = price || groceryItem.price;
  await groceryRepository.save(groceryItem);

  // Return null if no error
  return null;
}
