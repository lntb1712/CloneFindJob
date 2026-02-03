import * as cheerio from 'cheerio';
import { mySkills } from '../constants';
import { IJob } from '../interfaces';
import { formatDate, hasSkills } from '../utils';

function CareerViet() {
    const crawl = async (url: string) => {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);

        const items = $('.job-item');

        const result: Array<IJob> = [];

        items.each((index, item) => {
            const text = $(item).text();

            if (hasSkills(mySkills, text)) {
                // find element in item has atribute `data-url`
                const jobUrl = $(item).find('.job_link').attr('href') ?? '';

                // get title from h3 element
                const title = $(item)
                    .find('h2')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();

                // get time from `small-text text-dark-grey` class
                const time = $(item).find('time').text();

                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                const todayFormat = formatDate(today);
                const yesterdayFormat = formatDate(yesterday);

                if (
                    time.includes(todayFormat) ||
                    time.includes(yesterdayFormat)
                )
                    result.push({ title, url: jobUrl, page: url });
            }
        });

        return result;
    };

    return { crawl };
}

export default CareerViet;
