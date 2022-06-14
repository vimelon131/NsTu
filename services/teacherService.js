import  puppeteer  from "puppeteer";
import cherio from 'cherio';
import config from 'config';
import needle from 'needle';
import { Teacher } from "../models/Teacher.js";

async function teacherParser(el, $) {
    const subjTemplates = "/edu_actions/pcources";
    let content = await needle("get", `${el.url}${subjTemplates}`);
    let $1 = cherio.load(content.body, { decodeEntities: false });
    const table = $1('#t1').find('tr');
    const teacher = {...el, subjects: []};
    table.each((i,elem)=> {
        if ($(elem).find('td:nth-child(3)').text().trim() == "09.04.01" || $(elem).find('td:nth-child(3)').text().trim() == "09.04.03") {
            teacher.subjects.push($(elem).find('td:nth-child(1)').text().trim());
        }
    })
    content = await needle("get", `${el.url}`);
    $1 = cherio.load(content.body, { decodeEntities: false });
    const imgTemp = "https://ciu.nstu.ru/kaf/";
    teacher.img = imgTemp + $1('.contacts__card-image > img').attr("src");
    if (teacher.subjects.length > 0) {
        const teacherDB = new Teacher(teacher);                                                              
        const teacherExists = await Teacher.findOne({name: teacher.name.trim()}).exec();
        if (teacherExists == null) {
            await teacherDB.save();
            console.log("Сохранено");
        } else {
            await Teacher.updateOne({_id: teacherExists._id}, {$set: teacher});
            console.log("Обновлено");
        }           
    }
}

class teacherService {
    syncTeachers(pageContent) {
        return new Promise((resolve, reject) => {
            try {
                const $ = cherio.load(pageContent.body, { decodeEntities: false });
                const teachers = [];
                const promises = [];
                const el = $('.row.as-table').each((i,el) => {
                    const name = $(el).find('div:nth-child(1) > a').text();
                    const url = $(el).find('div:nth-child(1) > a').attr('href');
                    const jobTitle = $(el).find('div:nth-child(2)').text().trim();
                    teachers.push({name, url, jobTitle});
                });
                teachers.forEach((el) => {
                    promises.push(teacherParser(el, $)); 
                });
                Promise.all(promises)
                .then(() => {resolve({message: "Succesful parsing"})}).catch((e) => console.log('Oops', e));
            } catch(e) {
                console.log(e);
                reject("Error occured while parsing teachers");
            }
        })
    }

    addTeacherByLink(pageContent,link) {
        return new Promise((resolve, reject) => {
            try {
                const $ = cherio.load(pageContent.body, { decodeEntities: false });
                const name = $(".page-title").text().trim();
                const jobTitle = $(".contacts__card-post").text().trim();
                const promises = [];
                promises.push(teacherParser({name, jobTitle, url: link}, $)); 
                // const subjTemplates = "/edu_actions/pcources";
                // let content = await needle("get", `${link}${subjTemplates}`);
                // let $1 = cherio.load(content.body, { decodeEntities: false });
                // const table = $1('#t1').find('tr');
                // const teacher = {name, jobTitle, url: link, subjects: []};
                // table.each((i,elem)=> {
                //     if ($(elem).find('td:nth-child(3)').text().trim() == "09.04.01" || $(elem).find('td:nth-child(3)').text().trim() == "09.04.03") {
                //         teacher.subjects.push($(elem).find('td:nth-child(1)').text().trim());
                //     }
                // })
                // content = await needle("get", `${link}`);
                // $1 = cherio.load(content.body, { decodeEntities: false });
                // const imgTemp = "https://ciu.nstu.ru/kaf/";
                // teacher.img = imgTemp + $1('.contacts__card-image > img').attr("src");
                // if (teacher.subjects.length > 0) {
                //     const teacherDB = new Teacher(teacher);                                                              
                //     const teacherExists = await Teacher.findOne({name: teacher.name.trim()}).exec();
                //     if (teacherExists == null) {
                //         await teacherDB.save();
                //         console.log("Сохранено");
                //     } else {
                //         await Teacher.updateOne({_id: teacherExists._id}, {$set: teacher});
                //         console.log("Обновлено");
                //     }           
                // }
            
                Promise.all(promises)
                .then(() => {resolve({message: "Succesful parsing"})}).catch((e) => console.log(e));
            } catch(e) {
                console.log(e);
                reject("Error occured while parsing teachers");
            }
        })
    }
}
export default new teacherService();