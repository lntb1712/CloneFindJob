import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { IJob } from './interfaces';
import { prisma } from './lib/prisma';
import CareerViet from './providers/CareerViet';
import ItJob from './providers/ItJob';
import ItViet from './providers/ItViet';
import Joboko from './providers/Joboko';
import JobsGo from './providers/JobsGo';
import SmartOsc from './providers/SmartOsc';
import TopCV from './providers/TopCV';
import TopDev from './providers/TopDev';
import ViecOi from './providers/ViecOi';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

const itViet = ItViet();
const careerViet = CareerViet();
const jobsGo = JobsGo();
const viecOi = ViecOi();
const topCV = TopCV();
const joboko = Joboko();
const itJob = ItJob();
const topDev = TopDev();
const smartOsc = SmartOsc();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Express with TypeScript!');
});

app.get('/jobs', async (req: Request, res: Response) => {
    const result = await Promise.allSettled([
        jobsGo.crawl(
            'https://jobsgo.vn/viec-lam-frontend-tai-ho-chi-minh.html?sort=created',
        ),
        jobsGo.crawl(
            'https://jobsgo.vn/viec-lam-backend-tai-ho-chi-minh.html?sort=created',
        ),
        itViet.crawl('https://itviec.com/it-jobs/javascript'),
        itViet.crawl('https://itviec.com/it-jobs/.net-core'),
        itViet.crawl('https://itviec.com/it-jobs/asp.net'),
        itViet.crawl('https://itviec.com/it-jobs/nextjs'),
        itViet.crawl('https://itviec.com/it-jobs/nestjs'),
        itViet.crawl('https://itviec.com/it-jobs/nodejs'),
        itViet.crawl('https://itviec.com/it-jobs/reactjs'),
        itViet.crawl('https://itviec.com/it-jobs/typescript'),
        itViet.crawl('https://itviec.com/it-jobs/backend/ho-chi-minh-hcm'),
        itViet.crawl('https://itviec.com/it-jobs/frontend/ho-chi-minh-hcm'),
        careerViet.crawl(
            'https://careerviet.vn/viec-lam/cntt-phan-mem-tai-ho-chi-minh-c1l8e2d3-vi.html',
        ),
        viecOi.crawl(
            'https://it.viecoi.vn/tim-viec/linh-vuc-it-phan-mem-lap-trinh-211-khu-vuc-tp-ho-chi-minh-1-theo-kinh-nghiem-khong-yeu-cau-1-theo-tu-khoa-developer-thoi-gian-14-ngay-qua.html',
        ),
        topCV.crawl(
            'https://www.topcv.vn/tim-viec-lam-software-engineering-tai-ho-chi-minh-l2cr257cb258?sort=new&type_keyword=0&category_family=r257%7Eb258&locations=l2&sba=1',
        ),
        joboko.crawl('https://vn.joboko.com/jobs?q=backend&l=3&ind=124&pr=1'),
        joboko.crawl('https://vn.joboko.com/jobs?q=back+end&l=3&ind=124&pr=1'),
        joboko.crawl('https://vn.joboko.com/jobs?q=frontend&l=3&ind=124&pr=1'),
        joboko.crawl('https://vn.joboko.com/jobs?q=front+end&l=3&ind=124&pr=1'),
        itJob.crawl(
            'https://www.itjobs.com.vn/vi/search?Text=&FunctionalLevelKey=NewGrad&CityId=58',
        ),
        topDev.crawl(
            'https://topdev.vn/it-jobs/ho-chi-minh-intern-fresher-kl79',
        ),
        smartOsc.crawl(
            'https://careers.smartosc.com/job-category/viec-lam-it/?jobs_ppp=-1&paged=1&filter-orderby=newest',
        ),
    ]);

    const jobs: Array<IJob> = [];
    const errors: Array<string> = [];

    result.forEach((item) => {
        if (item.status === 'fulfilled') {
            jobs.push(
                ...item.value.map((job) => ({
                    ...job,
                    url: job.url.split('?')[0],
                })),
            );
        } else {
            errors.push(item.reason);
        }
    });

    res.send({ jobs, errors });
});

app.post('/jobs', async (req: Request, res: Response) => {
    try {
        const { url: urlPre } = req.body;

        const url = urlPre.split('?')[0];

        // Validate input
        if (!url) {
            throw new Error('Hết lượt tạo job');
        }

        // Kiểm tra job đã tồn tại chưa
        const existingJob = await prisma.job.findFirst({
            where: {
                id: url,
            },
        });

        if (existingJob) {
            throw new Error('Job này đã tồn tại trong database');
        }

        // Tạo job mới
        const job = await prisma.job.create({
            data: {
                id: url,
            },
        });

        res.status(201).json(job);
    } catch (error) {
        console.error('Lỗi khi tạo job:', error);
        res.status(500).json({
            error: (error as any).message || 'Đã xảy ra lỗi khi tạo job',
        });
    }
});

app.get('/jobs-viewed', async (req: Request, res: Response) => {
    const jobs = await prisma.job.findMany();
    res.send(jobs.map((job) => job.id.split('?')[0]));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
