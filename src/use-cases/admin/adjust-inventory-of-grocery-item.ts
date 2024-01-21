import getDataRepository from "../../setup/database/get-data-repository";
import { Grocery } from "../../entity/Grocery.entity";
import {
  GroceryInventoryLog,
  GroceryInventoryLogReason,
} from "../../entity/GroceryInventoryLogs.entity";
import { appDataSource } from "../../setup/database/app-data-source";
import logger from "../../setup/logging";

interface IAdjustInventoryOfGroceryItemInput {
  groceryId: string;
  adjustment: number;
}

export default async function adjustInventoryOfGroceryItemUseCase(
  input: IAdjustInventoryOfGroceryItemInput
): Promise<string | null> {
  // Extract the groceryId and adjustment from the input
  const { groceryId, adjustment } = input;

  // Get the grocery repository
  const groceryRepository = await getDataRepository(Grocery);

  // Find the grocery item by id
  const groceryItem = await groceryRepository.findOne({
    where: { id: groceryId },
  });
  if (!groceryItem) {
    return "Grocery item not found";
  }

  // Update the grocery item
  groceryItem.inventoryLevel += adjustment;
  groceryItem.version += 1;

  // Validate the inventory level
  if (groceryItem.inventoryLevel < 0) {
    return "Grocery item inventory cannot be negative";
  }
  // Create inventory log
  const groceryInventoryLog = new GroceryInventoryLog();
  groceryInventoryLog.groceryId = groceryItem.id;
  groceryInventoryLog.reason = GroceryInventoryLogReason.ADJUSTMENT;
  groceryInventoryLog.difference = adjustment;
  groceryInventoryLog.groceryVersion = groceryItem.version;

  try {
    await appDataSource.transaction(async (manager) => {
      // Save the grocery item
      await manager.save(groceryItem);

      // Save the inventory log
      await manager.save(groceryInventoryLog);
    });
  } catch (err) {
    logger.error(
      "adjustInventoryOfGroceryItemUseCase: error. Input:",
      input,
      "Error:"
    );
    console.error(err);
    return "Failed to adjust inventory. Please try again.";
  }

  // Return null if no error
  return null;
}
