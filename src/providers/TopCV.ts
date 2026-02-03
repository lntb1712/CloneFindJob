import * as cheerio from 'cheerio';
import { mySkills } from '../constants';
import { IJob } from '../interfaces';
import { hasSkills } from '../utils';

// read data from file
// const data = fs.readFileSync('C:/code/crawl-jobs/source/topcv.html', 'utf8');

function TopCV() {
    const crawl = async (url: string) => {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);

        const items = $('.job-item-search-result');

        const result: Array<IJob> = [];

        items.each((index, item) => {
            const text = $(item).text();

            if (hasSkills(mySkills, text)) {
                const title = $(item)
                    .find('h3.title')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();
                const jobUrl = $(item).find('h3.title a').attr('href') ?? '';

                if (
                    text.includes('2 ngày trước') ||
                    text.includes('1 ngày trước')
                )
                    result.push({ title, url: jobUrl, page: url });
            }
        });

        return result;
    };

    return { crawl };
}

export default TopCV;
