import { Scraper } from "../lib/scraper";
import Axios from "axios";
import Cheerio from "cheerio";

export class StartPage extends Scraper {
    main(): void {
        this.setName("StartPage");
    }
    
    async scrape({query}: {query: string}) {
        let dataToReturn: any = [];

        const res = await Axios.post(`https://www.startpage.com/sp/search?query=${query}`, {
            "query": query,
            "page": 1,
            "cat": "web",
            "cmd": "process_search",
            "engine0": "v1all",
        }, {
            headers: {
                "Content-Length": 0,
                "User-Agent": "PostmanRuntime/7.26.8",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            }
        });

        const rawHTML = res.data;
    
        const $ = Cheerio.load(rawHTML);
    
        let results = $(".w-gl__result__main");
    
        results.each((i) => {
            let element = $(results[i]);
    
            let title = element.find(".w-gl__result-title").text().trim();
            let content = element.find(".w-gl__description").text().trim();
            let url = element.find(".w-gl__result-url").text().trim();
    
            dataToReturn.push({
                title,
                content,
                url
            });
        });
    
        return dataToReturn;
    }
}