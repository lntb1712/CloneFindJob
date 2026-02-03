import * as cheerio from 'cheerio';
import { mySkills } from '../constants';
import { IJob } from '../interfaces';
import { hasSkills } from '../utils';

function Joboko() {
    const crawl = async (url: string) => {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);

        const items = $('.nw-job-list__list > .item');

        const result: Array<IJob> = [];

        items.each((index, item) => {
            const text = $(item).text();

            if (hasSkills(mySkills, text)) {
                // find element in item has atribute `data-url`
                const jobUrl =
                    $(item).find('h2.item-title a').attr('href') ?? '';

                // get title from h3 element
                const title = $(item)
                    .find('h2.item-title')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();

                result.push({
                    title,
                    url: `https://vn.joboko.com${jobUrl}`,
                    page: url,
                });
            }
        });

        return result;
    };

    return { crawl };
}

export default Joboko;
