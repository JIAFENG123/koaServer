const path = require('path')
const fs = require('fs')

async function handleFile(file) {
    // 创建可读流
    const reader = await fs.createReadStream(file.path);
    // 获取上传文件扩展名
    console.log(path.resolve(__dirname, '..'))
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
const { mkdirsSync } = require('../../utils/initDir');
const uploadPath = path.join(__dirname, 'uploads');
const fss = require('fs-extra');

//上传文件分片
async function uploadChunk(ctx) {
    console.log('file upload...')
    // 根据文件hash创建文件夹，把默认上传的文件移动当前hash文件夹下。方便后续文件合并。
    const {
        name,
        total,
        index,
        size,
        hash
    } = ctx.request.body;

    const chunksPath = path.join(uploadPath, hash, '/');
    if (!fss.existsSync(chunksPath)) mkdirsSync(chunksPath);

    // 创建可读流
    const reader = await fs.createReadStream(ctx.request.files.file.path);
    // fss.renameSync(ctx.request.files.file.path, chunksPath + hash + '-' + index);
    let filePath = path.join(chunksPath, hash + '-' + index);
    // 创建可写流
    const upStream = await fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    await reader.pipe(upStream);
    ctx.body = {
        message: "文件上传成功",
        code: 0
    }
}

//合并文件分片
async function mergeChunks(ctx) {
    const {
        size,
        name,
        total,
        hash
    } = ctx.request.body;
    // 根据hash值，获取分片文件。
    // 创建存储文件
    // 合并
    const chunksPath = path.join(uploadPath, hash, '/');
    const filePath = path.join(uploadPath, name);
    // 读取所有的chunks 文件名存放在数组中
    const chunks = fs.readdirSync(chunksPath);

    if (chunks.length !== total || chunks.length === 0) {
        ctx.body = {
            message: "切片文件数量不符合",
            code: -1
        }
        return;
    }
    let buff = [];
    for (let i = 0; i < total; i++) {
        // 追加写入到文件中
        buff.push(fs.readFileSync(chunksPath + hash + '-' + i))
    }
    console.log(Buffer.concat(buff))
    // 创建存储文件
    fs.writeFileSync(filePath, Buffer.concat(buff));
    // 文件合并成功，可以把文件信息进行入库。
    ctx.body = {
        message: "合并成功",
        code: 0
    }
}
module.exports = {
    upload,
    uploadChunk,
    mergeChunks
}