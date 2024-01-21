import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { v4 as uuidv4 } from "uuid";

@Entity()
export class Grocery {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4();

  @Column({
    length: 255,
  })
  name: string = "";

  @Column("double precision")
  price: number = 0;

  @Column("integer")
  inventoryLevel: number = 0;

  @Column({
    type: "integer",
    default: 0,
  })
  version: number = 0;
}
