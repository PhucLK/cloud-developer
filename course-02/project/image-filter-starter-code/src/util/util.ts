
import { Request } from 'express';
import fs from 'fs'
import Jimp from 'jimp'
require('dotenv').config();

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
    return new Promise(async (resolve: Function, reject: Function) => {
        try {
            const photo: any = await Jimp.read(inputURL);
            const outpath: string =
                "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
            await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(__dirname + outpath, () => {
                    resolve(__dirname + outpath);
                });
        } catch (error) {
            reject(error);
        }
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>): Promise<void> {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}


export function verifySecretToken(req: Request): Boolean {
    const token: string = req.headers.authorization.split(' ')[1]
    return token === process.env.SECRET_TOKEN
}