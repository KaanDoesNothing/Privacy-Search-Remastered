import express from "express";

import { DuckDuckGo } from "./scapers/duckduckgo";
import { StartPage } from "./scapers/startpage";
import { Wikipedia } from "./scapers/wikipedia";
import { Google } from "./scapers/google";
import { Yahoo } from "./scapers/yahoo";

const scrapers = [new DuckDuckGo, new StartPage, new Wikipedia, new Google, new Yahoo];

const cache = new Map();

const app = express();

app.get("/", async (req, res) => {
    const {q} = req.query;

    const dateStarted = Date.now();

    let result: any = [];
    let cached = false;

    if(cache.get(q)) {
        result = cache.get(q);
        cached = true;
    }else {
        const rawResult = await Promise.all(scrapers.map(scraper => scraper.scrape({query: q as string})));

        rawResult.forEach(resultRow => {
            resultRow.forEach((row: iRow) => {
                if(result.filter((row1: iRow) => row1.url === row.url).length < 1) result.push(row);
            });
        });

        cache.set(q, result);
    }

    const timeTaken = Date.now() - dateStarted;

    return res.json({process_time: timeTaken, cached, result});
});

app.listen(8030);