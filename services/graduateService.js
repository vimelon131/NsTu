import  puppeteer  from "puppeteer";
import cherio from 'cherio';
import config from 'config';
import needle from 'needle';
import { Graduate } from "../models/Graduates.js";

async function edit(i, el,$) {
    const img = $(el).find('.success-stories__story-photo > img').attr('src');
    const name = $(el).find('.success-stories__story-header').text().trim();
    const graduationDate = $(el).find('.col-9 > div:nth-child(2) > b').text();
    const faculty = $(el).find('.col-9 > div:nth-child(3) > a').text();
    let job;
    $(el).find('.col-9').children().each((i, e) => {
        if ($(e).text().trim().includes('Место работы')) {
            job = $(e).find('b').text();
        }
    })
    const review = $(el).find('.success-stories__story-text').text();
    const graduate = new Graduate({img, name, graduationDate, faculty, review, job});                                                               
    const graduateExists = await Graduate.findOne({name: name.trim()}).exec();
    if (graduateExists == null) {
        await graduate.save();
        console.log("Сохранено");
    } else {
        await Graduate.updateOne(graduateExists, {img, name, graduationDate, faculty, review, job});
        console.log("Обновлено");
    }
}

class graduatesService {
    syncGraduates(pageContent) {
        return new Promise(((resolve, reject) => {
            try {
                const $ = cherio.load(pageContent.body, { decodeEntities: false });
                const promises = [];
                console.log("Начало отрабатывания Еасч");    
                $('.row.success-stories__story').each((i, el) => {
                    promises.push(edit(i, el, $));    
                })
                Promise.all(promises)
                .then(() => {resolve({message: "Succesful parsing"})})
            } catch (error) {
                console.log(error);
                return reject({message: "Error occured with !"});
            }
        })) 
    }
}

export default new graduatesService();