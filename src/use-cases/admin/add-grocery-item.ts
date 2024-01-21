import getDataRepository from "../../setup/database/get-data-repository";
import { Grocery } from "../../entity/Grocery.entity";

interface IGroceryItem {
  name: string;
  price: number;
  inventoryLevel: number;
}
export default async function addGroceryItemUseCase(
  groceryItem: IGroceryItem
): Promise<string | null> {
  // Get the grocery repository
  const groceryRepository = await getDataRepository(Grocery);

  // Create the grocery item
  const newGroceryItem = await groceryRepository.create(groceryItem);

  // Save the grocery item
  await groceryRepository.save(newGroceryItem);

  // Return null if no error
  return null;
}
