import { Request as R, NextFunction as N } from "express";
import * as fs from 'fs-extra'
import { AppResponse as Res } from "../../types";
import { AppDataSource } from "../../database";
import { uploadImage } from "../../utils";
import { Profile, profileSaveDTO } from "./";

function getProfiles(req: R, res: Res, next : N) {
  return res.json({success : true}).status(200);
}
function getProfile(req: R, res: Res, next : N) {
    const { id } = req.params;
    //return res.json(id).status(200);
}
function deleteProfile(req: R, res: Res, next : N) {
    const { id } = req.params;
    //return res.json(id).status(200);
}

function saveProfile(req: R, res: Res, next : N) {
  const profile = req.body.profile;

  console.log(profile)
  //return res.json(req.body).status(200);
}

async function updateProfiles(req: R, res: Res, next : N) {
  let file = req.file;
  let profile = req.body as profileSaveDTO ;

  try{
    
    const repository = AppDataSource.getRepository(Profile);
    
    const oldProfle = await repository.findOneBy({ id : profile.id });

    if(!oldProfle) return next({ status : 404, message: 'profile not found'})

    const url = req.file ? await uploadImage(req.file.path) : oldProfle.img  ;
    
    if(file) await fs.remove(file.path);
    await repository.update(profile.id, {
      description : profile.detail || undefined,
      img : url
    });

    return res.json({success : true}).status(200);

  }catch(err){
     const error = err as Error
     console.log(err)
    return next({status : 500, message : error.message});
  }

}

export {
    saveProfile,
    getProfile,
    getProfiles,
    updateProfiles,
    deleteProfile,
}