import * as cheerio from 'cheerio';
import { mySkills } from '../constants';
import { IJob } from '../interfaces';
import { hasSkills } from '../utils';

// const data = fs.readFileSync('C:/code/crawl-jobs/source/topDev.html', 'utf8');

function TopDev() {
    const crawl = async (url: string) => {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);

        const items = $('#tab-job ul > li');

        const result: Array<IJob> = [];

        items.each((index, item) => {
            const text = $(item).text();

            if (hasSkills(mySkills, text)) {
                // find element in item has atribute `data-url`
                const jobUrl = $(item).find('> a').attr('href') ?? '';

                // get title from h3 element
                const title = $(item)
                    .find('h3')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();

                if (
                    text.includes('hours ago') ||
                    text.includes('2 days ago') ||
                    text.includes('1 day ago')
                )
                    result.push({
                        title,
                        url: `https://topdev.vn${jobUrl}`,
                        page: url,
                    });
            }
        });

        return result;
    };

    return { crawl };
}

export default TopDev;
