const path = require('path')
const fs = require('fs')

async function handleFile(file) {
    // 创建可读流
    const reader = await fs.createReadStream(file.path);
    // 获取上传文件扩展名
    console.log(path.resolve(__dirname,'..'))
    let filePath = path.join(__dirname, 'public/') + `/${file.name}`;
    // 创建可写流
    const upStream = await fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    await reader.pipe(upStream);
}


async function upload(ctx) {
    // 上传多个文件s
    const files = ctx.request.files.file; // 获取上传文件
    console.log(files)
    if (Object.prototype.toString.call(files) === '[object Array]') { //多个文件
        for (let file of files) {
            await handleFile(file)
        }
    } else {
        await handleFile(files)
    }

    return ctx.body = {
        message: "文件上传成功",
        code: 0
    }
}

module.exports = {
    upload
}