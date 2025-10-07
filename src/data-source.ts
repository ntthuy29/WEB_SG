import "reflect-metadata";
import { DataSource } from "typeorm";
import { Workspace } from "./entities/workspace.js";
import { Board } from "./entities/boards.js";
import { List } from "./entities/list.js";
import { Card } from "./entities/card.js";
import { Comment } from "./entities/comment.js";
import { User } from "./entities/user.js";

const databaseUrl = process.env.DATABASE_URL ?? process.env.MONGO_URL;

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  entities: [Workspace, Board, List, Card, Comment, User],
  logging: false,
  synchronize: true, 
});
