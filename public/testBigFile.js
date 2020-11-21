$(document).ready(() => {
    const chunkSize = 2 * 1024 * 1024; //分片大小
    // 使用Blob.slice方法来对文件进行分割。
    // 同时该方法在不同的浏览器使用方式不同。
    const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    //将文件hash
    const hashFile = (file) => {
        return new Promise((resolve, reject) => {
            const chunks = Math.ceil(file.size / chunkSize) //计算切片数
            let currentIndex = 0; //定义当前上传的切片序号
            const spark = new SparkMD5.ArrayBuffer();
            const filereader = new FileReader();

            function loadNext() {
                const start = currentIndex * chunkSize;//记录位置
                const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                filereader.readAsArrayBuffer(blobSlice.call(file, start, end))
            }

            filereader.onload = e => {
                spark.append(e.target.result); // 装进arrybuffer
                currentIndex++;  //当前切片加
                if (currentIndex < chunks) { //如果当前切片序号小于总数，则没有读完
                    loadNext();
                } else { //已加载完
                    console.log('finished!')
                    const result = spark.end() //取到二进制流
                    // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
                    // 想保留两个文件无法保留。所以把文件名称加上。
                    const sparkMd5 = new SparkMD5();
                    sparkMd5.append(result);
                    sparkMd5.append(file.name);
                    const hexHash = sparkMd5.end();
                    resolve(hexHash);
                }
            }
            filereader.onerror = () => {
                alert('file read error')
            }

            loadNext() //第一次执行读取
        }).catch(err => reject(err))
    }
    let file = null;
    //获取文件
    $('#file').change(function (e) {
        file = e.target.files[0]
    })

    //提交文件
    $('button').click(async function (params) {
        if (!file) {
            alert('file err');
            return;
        }
        const blockCount = Math.ceil(file.size / chunkSize)
        const axiosPromiseArray = []; // axiosPromise数组
        const hash = await hashFile(file); //文件 hash 
        // 获取文件hash之后，如果需要做断点续传，可以根据hash值去后台进行校验。
        // 看看是否已经上传过该文件，并且是否已经传送完成以及已经上传的切片。
        console.log(hash);

        const totalSize = file.size; //定义文件大小
        let loadedSize = 0; //定义加载的大小
        const BASE_URL = `http://localhost:8088`

        for (let i = 0; i < blockCount; i++) {
            const start = i * chunkSize;
            const end = Math.min(file.size, start + chunkSize);
            // 构建表单
            const form = new FormData();
            form.append('file', blobSlice.call(file, start, end));
            form.append('name', file.name);
            form.append('total', blockCount);
            form.append('index', i);
            form.append('size', file.size);
            form.append('hash', hash);
            // ajax提交 分片，此时 content-type 为 multipart/form-data
            const axiosOptions = {
                onUploadProgress: e => {
                    // 处理上传的进度
                    // console.log(e.loaded / e.total * 100);
                    // loadedSize += e.loaded;
                    // if(loadedSize >= totalSize) loadedSize = totalSize
                    // console.log(loadedSize / totalSize * 100)
                    if(e.loaded / e.total * 100 === 100){ //当前切片加载完毕
                        loadedSize += e.total
                    } 
                    
                },
            };
            // 加入到 Promise 数组中
            axiosPromiseArray.push(axios.post(BASE_URL + '/file/uploadChunk', form, axiosOptions));
        }
        // 所有分片上传后，请求合并分片文件
        await axios.all(axiosPromiseArray).then((res) => {
            console.log(res)
            // 合并chunks
            const data = {
                size: file.size,
                name: file.name,
                total: blockCount,
                hash
            };
            axios.post(BASE_URL + '/file/merge_chunks', data).then(res => {
                console.log('上传成功');
                console.log(res.data, file);
                alert('上传成功');
            }).catch(err => {
                console.log(err);
            });
        });
    });
})