import jsSHA from "jssha";
// import exifr from "exifr";

import exifReader from "exifreader";
// import dayjs from "dayjs";
// import customformat from "dayjs/plugin/customParseFormat";
// dayjs.extend(customformat);
import dayjs from "./myDayjs";

/* const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量 */

export const getFileInfo = async (file) => {
    let name = file.name; //获取文件名   
    let fileType = name.substring(name.lastIndexOf("."), name.length); //获取文件类型
    const arrayBuffer = await file.arrayBuffer(); //转化为二进制数据流
    // const fileHash = await sha256(arrayBuffer); //生成fileHash
    const shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
    shaObj.update(arrayBuffer);
    const fileHash = shaObj.getHash("HEX");

    //设定文件属性的默认值
    let isImage = 0; //是否图片
    let imageWidth = 0; //图片宽度
    let imageHeight = 0; //图片高度
    let Model = "n"; //相机型号,默认为"none"
    let DateTimeOriginal = dayjs(file.lastModifiedDate).format("YYYYMMDDHHmm"); //最近更新日期

    let latitude = 0.01;  //纬度
    let longitude = 0.01;//经度
    //检查文件类型
    const uint8Array = new Uint8Array(arrayBuffer);
    const checkRes = checkIsImage(uint8Array);
    if (checkRes.isImage === 1) { //如果是图片
        isImage = checkRes.isImage;
        fileType = checkRes.type //更新真实的文件类型
        // let exifTags = await exifr.parse(file, ["Model", "DateTimeOriginal", "GPSLatitude", "GPSLongitude"]);
        const tags = await exifReader.load(arrayBuffer);
       
        // console.log("tags:",tags);
        //如果正确获取了图片的exif信息则修改默认值
        if (tags) {
            // if (tags.DateTimeOriginal) { console.log("tags:", dayjs(tags.DateTimeOriginal.description)) } ;
            if (tags.Model) { Model = tags.Model.description };
            if (tags.DateTimeOriginal) { DateTimeOriginal = dayjs(tags.DateTimeOriginal.description,"YYYY:MM:DD HH:mm").format("YYYYMMDDHHmm") };
            if (tags.GPSLatitude) { latitude = tags.GPSLatitude.description };
            if (tags.GPSLongitude) { longitude = tags.GPSLongitude.description };
            if (tags["Image Height"]) (imageHeight = tags["Image Height"].value);
            if (tags["Image Width"]) (imageWidth = tags["Image Width"].value);
        }
    }

    return {
        name,
        fileType,
        fileHash,
        isImage,
        imageHeight,
        imageWidth,
        Model,
        DateTimeOriginal,
        latitude,
        longitude,
    };
};

const checkIsImage = (buf) => {
    const pngMagic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    const jpeg_jfif = [0x4a, 0x46, 0x49, 0x46];
    const jpeg_exif = [0x45, 0x78, 0x69, 0x66];
    const jpegMagic = [0xFF, 0xD8, 0xFF, 0xE0];
    const gifMagic0 = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61];
    const getGifMagic1 = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
    // 6 bytes
    const isGif = data => (arrayEquals(data, gifMagic0) || arrayEquals(data, getGifMagic1));
    // 4 bytes
    const isJpeg = data => (arrayEquals(data, jpegMagic) || arrayEquals(data, jpeg_jfif) || arrayEquals(data, jpeg_exif));
    // 8 bytes
    const isPng = data => arrayEquals(data, pngMagic);

    const arraycopy = (src, index, dist, distIndex, size) => {
        for (let i = 0; i < size; i++) {
            dist[distIndex + i] = src[index + i]
        }
    };
    const arrayEquals = (arr1, arr2) => {
        if (!arr1 || !arr2) {
            return false
        }
        if (arr1 instanceof Array && arr2 instanceof Array) {
            if (arr1.length !== arr2.length) {
                return false
            }
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false
                }
            }
            return true
        }
        return false;
    };

    if (!buf || buf.length < 8) {
        return { isImage: 0, type: "none" };
    }
    let bytes = [];
    arraycopy(buf, 0, bytes, 0, 6);
    if (isGif(bytes)) {
        return { isImage: 1, type: ".gif" };;
    }
    bytes = [];
    arraycopy(buf, 6, bytes, 0, 4);
    if (isJpeg(bytes)) {
        return { isImage: 1, type: ".jpg" };
    }
    bytes = [];
    arraycopy(buf, 0, bytes, 0, 8);
    if (isPng(bytes)) {

        return { isImage: 1, type: ".png" };;
    }
    return { isImage: 0, type: "none" };
};

/* //aes加密方法
export const Encrypt = (word) => {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
};

//aes解密方法
export const  Decrypt = (word) => {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}; */





