import exp from "constants";
import path from "path"

export const getImgDirectory = () =>{
    const dir = path.join(__dirname, "../../../../../public/images/")
    return dir;
}

export const getImageFilePath = (fileName:string) =>{
    const fp = path.join(getImgDirectory(), fileName);
    console.log('file path to save:', fp)

    return fp;

}