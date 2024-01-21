import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
  type: "postgres",
  name: "default",

  // Postgres database connection config START
  host: "host.docker.internal", // Use 'localhost' if you are not using Docker. Use 'host.docker.internal' if you are using Docker.
  port: 5432,
  username: "postgres",
  password: "password",
  database: "qp-assessment",
  // Postgres database connection config END

  synchronize: true,
  logging: false,
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});
