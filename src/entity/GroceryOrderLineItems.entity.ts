import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class GroceryOrderLineItem {

  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4();

  @Column("uuid")
  groceryOrderId: string = uuidv4();

  @Column("uuid")
  groceryId: string = uuidv4();

  @Column()
  quantity: number = 0;

  @Column("double precision")
  perUnitCost: number = 0;
}