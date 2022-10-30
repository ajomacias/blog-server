import { NextFunction as N, Request as R } from "express";
import { AppDataSource } from '../../database';
import { AppResponse as Res } from '../../types';
import { User } from './';

async function getUsers(req : R, res : Res, next : N)
{
  let users : User[] = []; 
    try{

        users = await AppDataSource.manager.find(User,{
          relations : {
            profile : true
          },
    
        })

    }catch(err){
        return next({status : 500, message : 'error to get users'});
    }

    return res.json({
        success : true,
        data : users
    }).status(200)
    
}

async function getUser(req: R, res : Res, next : N ){

    const id = req.params.id ? parseInt(req.params.id) : NaN;
    
     if(!Boolean(id)) return next({ status : 400, success : false, message : 'bad request' }) 
     
     try{
         const user = await AppDataSource.manager.findOne(User,{
             where : { id : id },
             relations : {
                 profile : true
             },
             select : {
                 id : true,
                 name : true,
                 created : true
             }
         })
         
         if(!user) return next({ success : false, status : 404, message : 'not found' })
         
         return res.json({ success : true, data : user });
         
     }catch(err){
         return next({ status : 500, message : 'internal error :(' })
     }

}

export {
    getUsers,
    getUser,
}