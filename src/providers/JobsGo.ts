import * as cheerio from 'cheerio';
import { mySkills } from '../constants';
import { IJob } from '../interfaces';
import { hasSkills } from '../utils';

// read data from file
// const data = fs.readFileSync('C:/code/crawl-jobs/source/jobsGo.html', 'utf8');

function JobsGo() {
    const crawl = async (url: string) => {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);

        const items = $('.brows-job-list > .col-sm-12');

        const result: Array<IJob> = [];

        items.each((index, item) => {
            const text = $(item).text();

            if (hasSkills(mySkills, text)) {
                const title = $(item)
                    .find('h3')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();
                const jobUrl = $(item).find('h3 a').attr('href') ?? '';

                if (
                    text.includes('2 ngày trước') ||
                    text.includes('1 ngày trước') ||
                    text.includes('giờ trước')
                )
                    result.push({ title, url: jobUrl, page: url });
            }
        });

        return result;
    };

    return { crawl };
}

export default JobsGo;
