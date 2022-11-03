import {DataSource} from "typeorm";
import { searchResult } from "./entities/searchResult";
import { getConfig } from "./utils";

const config = getConfig();

export const db = new DataSource({
    type: "mysql",
    url: `mysql://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}`,
    synchronize: true,
    logging: false,
    entities: [searchResult]
});