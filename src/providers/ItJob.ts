import * as cheerio from 'cheerio';
import fs from 'fs';
import { mySkills } from '../constants';
import { IJob } from '../interfaces';
import { formatDate, hasSkills } from '../utils';

// const data = fs.readFileSync('C:/code/crawl-jobs/source/itJobs.html', 'utf8');

function ItJob() {
    const crawl = async (url: string) => {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);

        const items = $('#jobs-list > .jp_job_post_link');

        const result: Array<IJob> = [];

        items.each((index, item) => {
            const text = $(item).text();

            if (hasSkills(mySkills, text)) {
                // find element in item has atribute `data-url`
                const jobUrl = $(item).attr('href') ?? '';

                // get title from h3 element
                const title = $(item)
                    .find('h3')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();

                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                const todayFormat = formatDate(today, 'DD/MM/YYYY');
                const yesterdayFormat = formatDate(yesterday, 'DD/MM/YYYY');

                if (
                    text.includes(todayFormat) ||
                    text.includes(yesterdayFormat)
                )
                    result.push({
                        title,
                        url: `https://www.itjobs.com.vn${jobUrl}`,
                        page: url,
                    });
            }
        });

        return result;
    };

    return { crawl };
}

export default ItJob;
