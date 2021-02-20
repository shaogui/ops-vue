export function HandleChange(info) {
    const status = info.file.status;
    // if (status !== 'uploading') {
    //     console.log("handleChange !uploading", info.file, info.fileList);
    // }
    if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
    }

    let fileList = [...info.fileList];
    fileList = fileList.map(file => {
        if (file.response) {
            //获取返回的访问地址
            file.url = file.response.url
        }
        return file;
    });
    this.fileList = fileList;
}

export function BeforeUpload(file) {
    // console.log("beforeUpload", file, fileList)
    this.fileList = [...this.fileList, file]
}

export function CustomRequest(options) {
    const Path = require("path")
    console.log("customRequest", options)
    const formData = new FormData();
    for (let key in options.data) {
        formData.append(key, options.data[key])
    }
    formData.append(options.filename, options.file)
    formData.append("filename", options.file.name)
    const rootPath = options.file.webkitRelativePath.split('/')
    rootPath.shift()
    formData.append("webkitRelativePath", Path.join(...rootPath))
    this.$http({
        url: options.action,
        method: "post",
        data: formData,
        onUploadProgress: (e => {
            if (e.lengthComputable) {
                options.onProgress({percent: e.loaded / e.total * 100});
            }
        })
    }).then(res => {
        options.onSuccess(res.data, options.file);
    }).catch(res => {
        options.onError(res.data, options.file);
    })
}


export function CustomRequestPut(options) {
    console.log("customRequest", options)
    const formData = new FormData();
    formData.append("webkitRelativePath", options.file.webkitRelativePath)
    for (let key in options.data) {
        formData.append(key, options.data[key])
    }
    formData.append(options.filename, options.file)
    this.$http({
        url: options.action,
        method: "put",
        data: formData,
        onUploadProgress: (e => {
            if (e.lengthComputable) {
                options.onProgress({percent: e.loaded / e.total * 100});
            }
        })
    }).then(res => {
        options.onSuccess(res.data, options.file);
    }).catch(res => {
        options.onError(res.data, options.file);
    })
}