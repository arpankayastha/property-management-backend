import moment from "moment/moment";
import fs from "fs";

export async function uploadImageToS3(fileParams: any, nsp?: any, socketId?: string) {
    console.log("uploadImageToS3 function is called ");
    const AWS = require('aws-sdk');

    // if (process.env.NODE_ENV === "development") {
    AWS.config.update({
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        region: process.env.S3_REGION
    });
    // }

    const s3 = new AWS.S3({
        params: {
            Bucket: process.env.S3_BUCKET
        }
    });

    /* turn off the timeout (Optional) */
    AWS.config.httpOptions.timeout = 0;

    return new Promise((resolve, reject) => {
        // upload file
        s3.upload(fileParams).on('httpUploadProgress', function (evt: { loaded: number; total: number; }) {
            let uploaded = Math.round(evt.loaded / evt.total * 100);
            console.log("uploaded percentage %j", uploaded);
        }).send(async function (err: any, data: any) {
            if (err) {
                console.log('upload error =>>>>>>>>>>> %j', err);
                reject(err);
                return;
            }
            console.log("file uploaded %j", data.Location);
            let key = data.Location;
            // return uploaded image url
            resolve(key);
        });
    }).catch(() => {
        console.log('upload error =>>>>>>>>>>> %j');
        return '';
    });
}

export async function preUploadImageToS3(file: any, type = "testing"): Promise<string> {
    const mime = require('mime');
    let extension = mime.getExtension(file.mimetype);
    let referencePath = "image/";
    const ContentType = "photo";
    let path = file.path;
    let Key = referencePath + moment().unix() + "." + extension;
    if (ContentType === "photo") {
        const webp = require('webp-converter');
        webp.grant_permission();
        const newPath = `${"./uploads/" + moment().unix() + "." + "webp"}`;
        await webp.cwebp(path, newPath, "-q 80");
        Key = referencePath + moment().unix() + "." + "webp";
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        path = newPath;
    }
    let url: any = '';
    url = await uploadImageToS3({
        Key,
        Body: fs.readFileSync(path),
        ACL: 'public-read',
        ContentType,
        mimeType: file.mimetype,
        referencePath
    });
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
    return url;
}

export async function preUploadImageToS3WithPath(path: any, type = "testing", extension = 'png'): Promise<string> {
    let referencePath = "photos/";
    const ContentType = "photo";
    let momentObj = moment();
    let Key = referencePath + momentObj.valueOf() + "." + extension;
    /*if (ContentType === "photo") {
        const webp = require('webp-converter');
        webp.grant_permission();
        const newPath = `${"./uploads/" + momentObj.valueOf() + ".webp"}`;
        await webp.cwebp(path, newPath, "-metadata all -q 100");
        Key = referencePath + momentObj.valueOf() + ".webp";
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        path = newPath;
    }*/
    let url: any = '';
    url = await uploadImageToS3({
        Key,
        Body: fs.readFileSync(path),
        ACL: 'public-read',
        ContentType,
        mimeType: 'image/png',
        referencePath
    });
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
    return url;
}

export async function savePhotoToS3WithBase64(file: any) {
    // file = file.replace("data:image/png;base64,", "");
    // file = file.split(",");
    return new Promise((resolve, reject) => {
        let buff = Buffer.from(file, 'base64');
        let savePath = `uploads/photos/${moment().valueOf()}.jpg`;
        fs.writeFileSync(savePath, buff);
        resolve(preUploadImageToS3WithPath(savePath, 'photo', 'jpg'));
    });
}
