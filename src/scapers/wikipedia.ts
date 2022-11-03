import { Scraper } from "../lib/scraper";
import Axios from "axios";
import Cheerio from "cheerio";

export class Wikipedia extends Scraper {
    main(): void {
        this.setName("Wikipedia");
    }
    
    async scrape({query}: {query: string}) {
        let dataToReturn: any = [];

        const res = await Axios.post(`https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrsearch='${query}'`);

        const json = res.data;
    
        for(let i in json.query?.pages || []) {
            let page = json.query.pages[i];
    
            dataToReturn.push({
                title: page.title,
                content: `Wikipedia article: ${page.pageid}`,
                url: encodeURI(`https://en.wikipedia.org/wiki/${page.title}`)
            });
        }
    
        return dataToReturn;
    }
}