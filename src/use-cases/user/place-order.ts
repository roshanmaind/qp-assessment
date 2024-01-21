import { Grocery } from "../../entity/Grocery.entity";
import {
  GroceryInventoryLog,
  GroceryInventoryLogReason,
} from "../../entity/GroceryInventoryLogs.entity";
import { GroceryOrder } from "../../entity/GroceryOrders.entity";
import { GroceryOrderLineItem } from "../../entity/GroceryOrderLineItems.entity";
import { appDataSource } from "../../setup/database/app-data-source";
import getDataRepository from "../../setup/database/get-data-repository";

export interface ILineItem {
  groceryId: string;
  quantity: number; // integer
}

export interface IPlaceOrderInput {
  lineItems: ILineItem[];
}

export default async function placeOrderUseCase(
  input: IPlaceOrderInput
): Promise<string | null> {
  // extract the line items from the input
  const { lineItems } = input;

  const inventoryLogs: GroceryInventoryLog[] = [];
  const orderLineItems: GroceryOrderLineItem[] = [];

  const groceryRepository = await getDataRepository(Grocery);

  const order = new GroceryOrder();
  const modifiedGroceryItems: Grocery[] = [];

  for (const item of lineItems) {
    const alreadyModifiedGroceryItem = modifiedGroceryItems.find(
      (groceryItem) => groceryItem.id === item.groceryId
    );
    let groceryItem: Grocery | undefined | null = alreadyModifiedGroceryItem;
    if (!groceryItem) {
      groceryItem = (await groceryRepository.findOne({
        where: { id: item.groceryId },
      })) as Grocery | undefined | null;
    }
    if (!groceryItem) {
      return "Grocery item not found: " + item.groceryId;
    }

    // Update the grocery item
    groceryItem.inventoryLevel -= item.quantity;
    groceryItem.version += 1;
    modifiedGroceryItems.push(groceryItem);

    // Validate the inventory level
    if (groceryItem.inventoryLevel < 0) {
      return (
        "Not enough stock to fulfill: " +
        groceryItem.name +
        " (" +
        groceryItem.id +
        ")"
      );
    }

    // Create inventory log
    const groceryInventoryLog = new GroceryInventoryLog();
    groceryInventoryLog.groceryId = groceryItem.id;
    groceryInventoryLog.reason = GroceryInventoryLogReason.SALE;
    groceryInventoryLog.difference = -item.quantity;
    groceryInventoryLog.groceryVersion = groceryItem.version;
    groceryInventoryLog.groceryOrderId = order.id;

    inventoryLogs.push(groceryInventoryLog);

    // Create order line item
    const orderLineItem = new GroceryOrderLineItem();
    orderLineItem.groceryId = groceryItem.id;
    orderLineItem.quantity = item.quantity;
    orderLineItem.groceryOrderId = order.id;
    orderLineItem.perUnitCost = groceryItem.price;
    orderLineItems.push(orderLineItem);
  }

  // Attempt placing the order
  try {
    await appDataSource.transaction(async (manager) => {
      await manager.save(order);
      await manager.save(orderLineItems);
      await manager.save(inventoryLogs);
      await manager.save(modifiedGroceryItems);
    });
  } catch (err) {
    console.error(err);
    return "Failed to place order. Please try again.";
  }
  return null;
}
