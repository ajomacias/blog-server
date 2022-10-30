import { UploadApiOptions, v2 } from 'cloudinary'

v2.config();

export const default_url ='https://res.cloudinary.com/dx5lme7oc/image/upload/v1666200165/blog/Sample_User_Icon_a1iwgj.png'

async function uploadImage(imgUrl:string){

    const options : UploadApiOptions = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder : 'blog'
        
      };

    try{

        const res = await v2.uploader.upload(imgUrl,options);
        
        return res.url;

    }catch(err){
        console.log(err)
        throw new Error('error to save image');

    }
    
}

export { uploadImage };