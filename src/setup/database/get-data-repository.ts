import { appDataSource } from "./app-data-source";
import { Repository } from "typeorm";

export default async function getDataRepository(Class: any): Promise<Repository<any>> {
  const repository = await appDataSource.getRepository(Class);
  return repository;
}