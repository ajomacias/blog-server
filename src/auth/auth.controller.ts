import { AppDataSource } from "../database";
import { Profile, User } from "../feature";
import { AppResponse, NoHashToken } from "../types";
import { NextFunction, Request } from "express";
import { TokenResponse } from "../types";
import { generateToken, decodeToken } from "../utils/generateToken";
import { default_url } from "../utils";

async function register(req: Request, res: AppResponse, next: NextFunction) {
  const { name, password } = req.body;


  if (!name || !password)
  return next({ status: 400, message: "password or name must be present" });

  try {
    let user: User | null;

    user = await AppDataSource.manager.findOne(User, { where: { name } });
    if (user)
      return next({ status: 400, message: "username is already exists" });

    user = new User();
    user.name = name;
    user.hashPassword(password);
    const profile = new Profile();
    profile.img = default_url;
    profile.description = 'Holaa 👋​'

    await AppDataSource.manager.save(profile)
    user.profile =profile;
    await AppDataSource.manager.save(user);

  } catch (err  ) {
    console.log(err)
    return next({ status: 400, message : err });
  }
  return res
    .json({
      success: true,
     
    })
    .status(201);
}

async function logIn(req: Request, res: AppResponse, next: NextFunction) {
  const { name, password } = req.body;


  if (!name || !password)
    return next({ status: 400, message: "password or name must be present" });
  let resToken: TokenResponse;

  try {
    const user = await AppDataSource.manager.findOne(User, { where:{name : `${name}`}
  , relations : { profile : true }
  });

    if (!user) return next({ status: 404, message: "user not found" });
    const correctPass: boolean = await user.comparePassword(password);
    if (!correctPass)
      return next({ status: 401, message: "password or user incorrect" });
    
    const token: string = generateToken({ id_user: user.id });



    resToken = { token, user: user.name, id : user.id };
    return res.json({ success: true, data: {...resToken,profile : user.profile }})
    .status(200);
  } catch (err) {
    console.log(err)
    return next({ status: 500, message: "Error" });
  }


}

async function getUserByToken(req : Request, res : AppResponse, next : NextFunction) {

  let token = req.get('Authorization');


  
  if(!token) return next({ status : 400, message : 'token is not present' });

  try{
    let decode : NoHashToken | null; 
    token = token.split('Bearer')[1].trim();

    decode = decodeToken(token);

    if(!decode) return next({ status: 400, message : 'token is malformed' });

    const user = await AppDataSource.manager.findOne(User, {
      where : { id : decode.id_user },
      relations : { profile : true },
      select : { name : true, id : true, profile : { img : true } }
    })

    if(!user) return next({ status : 404, message : 'user not found' });

    
    return res.json({ success : true, data : user });


  }catch(err){

    console.log(err)
    
    return res.json({ success : false, error: 'internal server error' }).status(500);

  }
  
}

export { register, logIn, getUserByToken };
