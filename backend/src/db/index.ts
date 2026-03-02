import { DataSource } from "typeorm";
import { Article } from "../entities/Article";
import { Category } from "../entities/Category";
import env from "../env";

const db = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASS,
  port: env.DB_PORT,
  database: env.DB_NAME,
  entities: [Article, Category],
  synchronize: true,
});

export async function clearDB() {
  const runner = db.createQueryRunner();
  const tableDroppings = db.entityMetadatas.map((entity) =>
    runner.query(`DROP TABLE IF EXISTS "${entity.tableName}" CASCADE`),
  );
  await Promise.all(tableDroppings);
  await runner.release();
  await db.synchronize();
}

export default db;
