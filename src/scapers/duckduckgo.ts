import { Scraper } from "../lib/scraper";
import Axios from "axios";
import Cheerio from "cheerio";

export class DuckDuckGo extends Scraper {
    main(): void {
        this.setName("DuckDuckGo");
    }
    
    async scrape({query}: {query: string}) {
        let dataToReturn: any = [];

        const res = await Axios.post(`https://html.duckduckgo.com/html?q=${query}`);
    
        const $ = Cheerio.load(res.data);
    
        let results = $(".web-result");
    
        results.each(i => {
            let element = $(results[i]);
    
            let title = element.find(".result__title").text().trim();
            let content = element.find(".result__snippet").text().trim();
            let url = element.find(".result__url").text().trim();
            let icon = element.find(".result__icon__img").attr("src");
    
            dataToReturn.push({
                title,
                content,
                url,
                icon 
            });
        });
    
        return dataToReturn;
    }
}