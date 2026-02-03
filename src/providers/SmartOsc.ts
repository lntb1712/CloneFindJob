import * as cheerio from 'cheerio';
import { mySkills } from '../constants';
import { IJob } from '../interfaces';
import { hasSkills } from '../utils';

// const data = fs.readFileSync('C:/code/crawl-jobs/source/smartOsc.html', 'utf8');

function SmartOsc() {
    const crawl = async (url: string) => {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);

        const items = $('.item-job');

        const result: Array<IJob> = [];

        items.each((index, item) => {
            const text = $(item).text();

            if (hasSkills(mySkills, text)) {
                // find element in item has atribute `data-url`
                const jobUrl =
                    $(item).find('.employer-logo > a').attr('href') ?? '';

                // get title from h3 element
                const title = $(item)
                    .find('h3.job-title')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();

                result.push({
                    title,
                    url: `${jobUrl}`,
                    page: url,
                });
            }
        });

        return result;
    };

    return { crawl };
}

export default SmartOsc;
