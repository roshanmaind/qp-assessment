import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class GroceryOrder {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4();
}