import { PostgreSqlContainer } from "@testcontainers/postgresql";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test", quiet: true });

console.log("Starting PostgresSql test container...");
const postgresContainer = await new PostgreSqlContainer(
  "postgres:18.0-alpine3.22",
).start();
console.log("Started PostgresSql test container");

// Inject env for `start/env`, which then be used in `config/database.ts`.
process.env.DB_HOST = postgresContainer.getHost();
process.env.DB_PORT = String(postgresContainer.getPort());
process.env.DB_USER = postgresContainer.getUsername();
process.env.DB_PASSWORD = postgresContainer.getPassword();
process.env.DB_DATABASE = postgresContainer.getDatabase();
