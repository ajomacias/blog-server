import { NextFunction as N, Request as R } from "express";
import { AppResponse as Res } from "../../types";
import { AppDataSource } from "../../database";
import { postSaveDTO, verifyProps, Post, User } from "../";
import { ILike } from "typeorm";
import { getPageable, StringUtils } from "../../utils";

async function getPosts(req: R, res: Res, next: N) {

  const { limit, page }= getPageable(req);  
  
  try {
    const repository = AppDataSource.getRepository(Post)
    const posts = await repository

      .find({
        
        relations : { 
          user : { profile : true },
          comentaries :false
        },
        select : {
          user : {name : true,id : true,profile : {img : true }}
        },
        skip : page,
        take : limit
   
      },
      );

      const count = await repository.count();

      return res.json({ success: true, data: { count : count,values : posts } });


    
  } catch (err) {
    console.log(err)
    return next({ status: 500, message: "error to get posts" });
  }
 
}
async function getPost(req: R, res: Res, next: N) {
  const id = req.params.id ? parseInt(req.params.id.toString()) : null;

  if (!id) return next({ status: 400, message: "id musts be present" });

  try {
    const post = await AppDataSource.manager.findOne(Post, {
      where : { id : id },
      relations : {user : {profile : true}, comentaries : { user : true } },
      
    select : { 
      user : { id : true, name : true, profile : { img : true } }, 
      comentaries : { 
        id : true, description : true, created : true,user : { id : true,name : true}  
      },
      
    }
   });

   return res.json({ success: true, data: post }).status(200);
  } catch (err) {
    console.log(err)
    return next({ status: 500, message: "err to find post" });
  }
}
async function deletePost(req: R, res: Res, next: N) {
  const id = req.params.id ? JSON.parse(req.params.id.toString()) : null;

  if (!id) return next({ status: 400, message: "id musts be present" });
  try {
    const repository = AppDataSource.getRepository(Post);
    const count = await repository.count({where : { id : id}});

    if (count < 0) return next({ status: 404, message: "post don't exist" });

    await repository.delete(id);

    res.json({ success: true }).status(200);
  } catch (err) {
    next({ status: 500, message: "error to delete post" });
  }
}

async function savePosts(req: R, res: Res, next: N) {
  const newPost = req.body as postSaveDTO;
  if (!verifyProps(newPost))
    return next({ status: 400, message: "some inputs are incorrects" });
  let post: Post;

  try {
    const user = await AppDataSource.manager.findOne(User, {
       where : { id : newPost.user },
       select : {
        id : true,
        name : true
       }
      
    });

    if (!user) return next({ status: 404, message: "user not found" });

    post = new Post();
    post.user = user!;
    post.name = newPost.name;
    post.description = newPost.description;

    await AppDataSource.manager.save(post);
  } catch (err) {
    console.log(err)
    return next({ status: 500, message: err });
  }

  return res.json({ success: true, data: post }).status(201);
}

async function updatePosts(req: R, res: Res, next : N) {
  const post = req.body as postSaveDTO;

  if(!post.id) return next({status : 400, message : 'the propperty id must be present'})

  try{

    const repository = AppDataSource.getRepository(Post);
    const count = await repository.count({where : { id : post.id }});
    if(count < 0) return next({status : 404, message : "post don't exist"});
    const updatePost = await repository.update(post.id,{
      name : post.name,
      description : post.description
    })
    
    res.json({success : true, data : updatePost}).status(200)

  }catch(err){
    next({status : 500, message : 'error to update post'})
  }

}

async function searchPosts( req : R,res : Res, next : N){

  let { limit, page  } = getPageable(req);
  const word = req.query.post ? req.query.post?.toString() : '';

  if(StringUtils.isEmpty({word, min : 2})) return next({ status : 400, message : 'the word must have min 3 letters' })

  try{
    const repository= AppDataSource.getRepository(Post);
    const posts = await repository.find({
      where : [
      { name : ILike(`%${word}%`) },
      { description : ILike(`%${word}%`) } 
      ],
      skip : page,
      take : limit,
      relations : { 
        user : { profile : true },
        comentaries :false
      },
      select : {
        user : {name : true,id : true,profile : {img : true }}
      },
    });
    
    const count = await repository.count({
      where :[
        { name : ILike(`%${word}%`) },
        { description : ILike(`%${word}%`) }
      ]
    })
      return res.json({success : true, data : { values : posts, count : count }})
      
    
  }catch(err){

    console.log(err)

    return next({ status :500, message : 'error to get posts' });
  }

}

async function getPostsByUser(req : R, res : Res , next : N){
  
  let userId = req.params.id ? parseInt(req.params.id) : NaN;
  const { limit, page } = getPageable(req);
  
  if(!Boolean(userId)) return next({status: 400,  success : false,message : 'Invalid input' });
  
  try{
    const repository = AppDataSource.getRepository(Post);
    
    const posts = await repository.find({
      where : {
        user : { id : userId } 
      },
      take : limit,
      skip : page,
      order : {
        created : "DESC"
      }
    });
    
    const count = await repository.count({
      where : {
        user : { id : userId }
      }
    });
      return res.json({ success: true, data : { count : count, values : posts } })
      .status(200);
      
    
    
  }catch(err){
    
    return next({status : 500 ,succes : false, message : 'internal error' });
    
  }
  
}

export 
{ 
  savePosts, getPost, getPosts, updatePosts,
   deletePost, searchPosts, getPostsByUser 
};