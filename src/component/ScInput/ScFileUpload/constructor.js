//单据附件列表转文件列表
export const voucherFilesToFiles = (voucherFiles) => {
    if (!voucherFiles) {
        return [];
    }
    let files = []; 
    voucherFiles.forEach(voucherFile => {
        if (voucherFile.dr === 0 && voucherFile.file.fileid > 0) {
            files.push(voucherFile.file);
        }
    });
    return files;
}

//文件列表转换为单据附件列表
export const filesToVoucherFiles = (voucherFiles, files) => {
    if (!voucherFiles) {
        return [];
    }
    //筛选出删除的文件（voucherFiles中存在,但是files中不存在）
    for (let i = 0; i < voucherFiles.length; i++) {
        let fileIndex = files.findIndex(file => file.fileid === voucherFiles[i].file.fileid);
        // console.log("i:", i, "fileIndex:", fileIndex);
        if (fileIndex < 0) {
            voucherFiles[i].dr = 1;
        }
    }
 
    //筛选出新增的文件
    let newVoucherFiles = [];
    for (let i = 0; i < files.length; i++) {
        let voucherFileIndex = voucherFiles.findIndex(voucherFile => voucherFile.file.fileid === files[i].fileid);
        if (voucherFileIndex < 0) {
            let newVoucherFile = { id: 0, billhid: 0, billbid: 0, file: files[i], dr: 0 };
            newVoucherFiles.push(newVoucherFile);
        } else {
            if (voucherFiles[voucherFileIndex].dr === 1) {
                voucherFiles[voucherFileIndex].dr = 0;
            }
        }
    }    
    const fs = [...voucherFiles, ...newVoucherFiles];
    //整理fs,将id为0，dr为1的删除掉
    for (let i=0;i<fs.length;i++) {
        if (fs[i].id === 0 && fs[i].dr === 1) {
            fs.splice(i,1);
            i--
        }
    }

    return fs;
};