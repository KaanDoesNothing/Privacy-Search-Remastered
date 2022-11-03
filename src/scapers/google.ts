import { Scraper } from "../lib/scraper";
import Axios from "axios";
import Cheerio from "cheerio";

export class Google extends Scraper {
    main(): void {
        this.setName("Google");
    }
    
    async scrape({query}: {query: string}) {
        const page = await this.getBrowser();

        const url = new URL("https://www.google.com/search");
        url.searchParams.append("q", query);

        await page.goto(url.toString());

        await page.waitForSelector(".MjjYud");

        const result = await page.evaluate(() => {
            let result: any = [];

            document.querySelectorAll(".MjjYud").forEach(element => {
                const title = element.querySelector("h3[class='LC20lb MBeuO DKV0Md']")?.textContent;
                const url = element.querySelector("a[href]")?.getAttribute("href");
                const content = element.querySelector(".VwiC3b")?.textContent;

                if(title && url && content) {
                    result.push({
                        title,
                        content,
                        url
                    });
                }
             });

             return result;
        });

        await page.close();
    
        return result;
    }
}