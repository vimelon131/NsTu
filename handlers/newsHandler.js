import cherio from 'cherio';
import chalk from 'chalk';
import { taskQueue } from '../services/newsService.js';
import needle from 'needle';
import { News } from '../models/News.js';
import {fromStringToData} from '../helpers/dataConverter.js';
import contentChecker from '../helpers/contentChecker.js';
import config from 'config';

const SITE = config.get('siteURL');;

async function listPageHandler(url, keyWords) {
    try {
        const res = await needle("get", url);
        const $ = cherio.load(res.body, { decodeEntities: false });
        $('.bottomLine').each((i, el) => {
            const category = $(el).children().first().text();
            const otherData =  $(el).children().eq(1);
            const dateString = otherData.clone().children().remove().end().text().replace('\n', '').trim();
            const date = fromStringToData(dateString);
            const url = otherData.find('.text-bold').attr('href');
            const title = otherData.find('.text-bold').text();
            taskQueue.push(
                () => getNewsContent({  category 
                                        , date
                                        , url 
                                        , title}, keyWords),
                (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log(chalk.green.bold(`Success getting data from: \n${SITE}${url}\n`));
                }
            );
        });
    } 
    catch (err) {
        console.log(chalk.red('An error has occured \n'));
        console.log(err);
    }
}

async function getNewsContent(newsData, keyWords) {
    try {
        const pageContent = await needle("get", `${SITE}${newsData.url}`);
        const $ = cherio.load(pageContent.body, { decodeEntities: false });
        const result = [];
        $('.col-9').each((i, el)=> {
            result.push($(el).html());
        });
        const content = result.toString();
        const passed = contentChecker(content, keyWords);
        if (passed) {
            const imgs = [];
            const fotorama = $("div .fotorama");
            if (fotorama !== undefined){
                fotorama.children().each((i, el) => {
                    imgs.push($(el).attr('src'));
                })
            }
            const news = new News({
                category: newsData.category,
                date: newsData.date,
                title: newsData.title,
                url: newsData.url,
                content: result.toString(),
                images: imgs.length > 0 ? imgs : null
            });                                                             
            const newsExists = await News.findOne({url: newsData.url}).exec();
            if (newsExists == null) {
                await news.save();
                console.log("Сохранено");
            } else {
                await News.updateOne({_id: newsExists._id},{ $set: {
                    category: newsData.category,
                    date: newsData.date,
                    title: newsData.title,
                    url: newsData.url,
                    content: result.toString(),
                    images: imgs.length > 0 ? imgs : null
                }});
                console.log("Обновлено");
            }
        }
        
    } catch (err) {
        throw err;
    }
}

export default listPageHandler;