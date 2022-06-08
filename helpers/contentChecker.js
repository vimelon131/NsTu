

async function contentChecker(text, keyWords) {
    
    const textLW = text.toLowerCase();
    let cnt = 0;
    keyWords.forEach(el => {
        if (textLW.includes(el)) {
            cnt += 1;
        }
    })
    return cnt > 0 ? true : false;
}

export default contentChecker;