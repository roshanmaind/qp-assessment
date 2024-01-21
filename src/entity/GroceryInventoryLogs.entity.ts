import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

import { v4 as uuidv4 } from "uuid";

export enum GroceryInventoryLogReason {
  ADJUSTMENT = "ADJUSTMENT",
  SALE = "SALE",
}

@Entity()
@Unique(["groceryId", "groceryVersion"]) // this is to prevent duplicate inventory logs for the same grocery item (to prevent double counting)
export class GroceryInventoryLog {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4();

  @Column("uuid")
  groceryId: string = uuidv4();

  @Column()
  reason: GroceryInventoryLogReason = GroceryInventoryLogReason.ADJUSTMENT;

  @Column()
  difference: number = 0;

  @Column()
  timestamp: Date = new Date();

  @Column({
    type: "uuid",
    nullable: true,
  })
  groceryOrderId?: string;

  @Column({
    type: "integer",
    default: 0,
  })
  groceryVersion: number = 0; // the updated version of the grocery item after the inventory transaction
}
