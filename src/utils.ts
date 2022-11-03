import fs from "fs";
import path from "path";

export const getConfig = () => {
    const raw = fs.readFileSync(path.join(__dirname, "../config.json"), "utf-8");

    return JSON.parse(raw);
}