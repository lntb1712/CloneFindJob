import * as cheerio from 'cheerio';
import { mySkills } from '../constants';
import { IJob } from '../interfaces';
import { hasSkills } from '../utils';

// read data from file
// const data = fs.readFileSync('C:/code/crawl-jobs/source/viecoi.html', 'utf8');

function ViecOi() {
    const crawl = async (url: string) => {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);

        const items = $('.jobs_container > .related-inner');

        const result: Array<IJob> = [];

        items.each((index, item) => {
            const text = $(item).text();

            if (hasSkills(mySkills, text)) {
                const title = $(item)
                    .find('h4.jobs-title')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();
                const jobUrl =
                    $(item).find('h4.jobs-title a').attr('href') ?? '';

                result.push({ title, url: jobUrl, page: url });
            }
        });

        return result;
    };

    return { crawl };
}

export default ViecOi;
