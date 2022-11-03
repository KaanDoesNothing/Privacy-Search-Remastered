import { webkit } from "playwright";

export class Scraper {
    public name: string;
    constructor() {
        this.main();
        this.log();
    }

    main() {

    }

    setName(name: string) {
        this.name = name;
    }

    log() {
        console.log(`Scraper: ${this.name} has been loaded!`);
    }
    
    async getBrowser() {
        const browser = await webkit.launch({headless: true});
        const context = await browser.newContext({viewport: {width: 1280, height: 720}});
        const page = await context.newPage();

        page.on("close", () => browser.close());

        return page;
    }
}