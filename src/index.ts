import express from "express";

import { DuckDuckGo } from "./scapers/duckduckgo";
import { StartPage } from "./scapers/startpage";
import { Wikipedia } from "./scapers/wikipedia";
import { Google } from "./scapers/google";
import { Yahoo } from "./scapers/yahoo";
import { searchResult } from "./entities/searchResult";
import { db } from "./db";

db.connect();

const scrapers = [new DuckDuckGo, new StartPage, new Wikipedia, new Google, new Yahoo];

const app = express();

app.get("/", async (req, res) => {
    let {q} = req.query;
    if(!q) return;

    q = (q as string).toLowerCase();

    const dateStarted = Date.now();

    let result: any = [];
    
    const cached = await searchResult.findOne({where: {query: q as string}});

    if(cached) {
        result = JSON.parse(cached.result);
    }else {
        const rawResult = await Promise.all(scrapers.map(scraper => scraper.scrape({query: q as string})));

        rawResult.forEach(resultRow => {
            resultRow.forEach((row: iRow) => {
                if(result.filter((row1: iRow) => row1.url === row.url).length < 1) result.push(row);
            });
        });

        const newSearchResult = searchResult.create({
            query: q as string,
            result: JSON.stringify(result)
        });

        await newSearchResult.save();
    }

    const timeTaken = Date.now() - dateStarted;

    return res.json({process_time: timeTaken, cached: cached !== null, result});
});

app.listen(8030);