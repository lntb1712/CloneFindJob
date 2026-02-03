import * as cheerio from 'cheerio';
import { mySkills } from '../constants';
import { IJob } from '../interfaces';
import { hasSkills } from '../utils';

function ItViet() {
    const crawl = async (url: string) => {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);

        const items = $('.job-card');

        const result: Array<IJob> = [];

        items.each((index, item) => {
            const text = $(item).text();

            if (hasSkills(mySkills, text)) {
                // find element in item has atribute `data-url`
                const jobUrl =
                    $(item).find('[data-url]').attr('data-url') ?? '';

                // get title from h3 element
                const title = $(item)
                    .find('h3')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();

                // get time from `small-text text-dark-grey` class
                const time = $(item).find('.small-text.text-dark-grey').text();

                if (time.includes('2 days ago') || time.includes('1 day ago'))
                    result.push({ title, url: jobUrl, page: url });
            }
        });

        return result;
    };

    return { crawl };
}

export default ItViet;
