import { Scraper } from "../lib/scraper";

export class Yahoo extends Scraper {
    main(): void {
        this.setName("Yahoo");
    }
    
    async scrape({query}: {query: string}) {
        const page = await this.getBrowser();

        const url = new URL("https://search.yahoo.com/search");
        url.searchParams.append("q", query);

        await page.goto(url.toString());

        if(page.url().includes("consent")) {
            await page.waitForSelector("button[name='agree']");
            await page.click("button[name='agree']");
        }

        await page.waitForSelector(".algo");

        const result = await page.evaluate(() => {
            let result: any = [];

            document.querySelectorAll(".algo").forEach(element => {
                element.querySelector(".compTitle")?.querySelector("a")?.querySelector("span")?.remove();
                const title = element.querySelector(".compTitle")?.querySelector("a")?.textContent;
                const url = element.querySelector(".compTitle")?.querySelector("a")?.getAttribute("href");
                const content = element.querySelector(".fc-falcon")?.textContent;

                if(title && content) {
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