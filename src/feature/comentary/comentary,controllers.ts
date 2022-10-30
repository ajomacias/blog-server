import { NextFunction as N, Request as R } from "express";
import { AppResponse as Res } from "../../types";
import { AppDataSource } from "../../database";
import { Comentary, commentarySaveDTO } from ".";
import { User } from "../user";
import { getPageable } from "../../utils";
import { validate } from "class-validator";
import { Post } from "../post";

async function getComments(req: R, res: Res, next: N) {
  const { limit, page } = getPageable(req);
  
  const  id  = req.params.id ? JSON.parse(req.params.id.toString()) : null;

  if(!id) return next({status : 400, message : 'post id must be present'});

  try {
    const repository = AppDataSource.getRepository(Comentary)
    const comentaries = await repository.find({
      where : {
        post : { id : id }
      },
      relations : { user : { profile : true},  },
      select: { user: { id: true,name: true, profile : { img : true } } },
     skip : page,
     take : limit 
  });

  const count = await repository.countBy({ post : { id : id } });
    
    return res.json({ success: true, data : { values : comentaries, count } });
    

 
  } catch (err) {
    return next({ status: 500, message: "error to get comentaries" });
  }
}

async function getComment(req: R, res: Res, next: N) {
  const id = req.params.id ? JSON.parse(req.params.id.toString()) : null;

  if (!id) return next({ status: 400, message: "id musts be present" });

  try {
    const comentary = await AppDataSource.manager.findOne(Comentary, {
      where: { id: id },
      relations: {
        user: { profile: true, },
     },
      select: {
        user: {
          password: false,
          created: false,
          profile: { img : true },
        },
      },
    });

    return res.json({ success: true, data: comentary }).status(200);
  } catch (err) {
    console.log(err);
    return next({ status: 500, message: "err to find comentary" });
  }
}
async function deleteComment(req: R, res: Res, next: N) {
  const id = req.params.id ? JSON.parse(req.params.id.toString()) : null;

  if (!id) return next({ status: 400, message: "id musts be present" });
  try {
    const repository = AppDataSource.getRepository(Comentary);
    const count = await repository.count({ where: { id: id } });

    if (count < 0) return next({ status: 404, message: "commentary don't exist" });

    await repository.delete(id);

    res.json({ success: true }).status(200);
  } catch (err) {
    next({ status: 500, message: "error to delete post" });
  }
}

async function saveComment(req: R, res: Res, next: N) {
  const newComentary = req.body as commentarySaveDTO;
  
  if(!newComentary?.post || !newComentary?.user )
  return next({ status : 400, message : 'user id aannd post id musst be present' });

  let comentary: Comentary;

  try {
    const user = await AppDataSource.manager.findOne(User, {
      where: { id: newComentary.user },
      select: {
        id: true,
        name: true,
      },
    });
    const post = await AppDataSource.manager.findOne(Post, {
      where: { id: newComentary.post },
      select: {
        id: true,
        name: true,
      },
      relations: {
        comentaries: false,
        user: false,
      },
    });


    if (!post) return next({ status: 404, message: "post not found" });

    if (!user) return next({ status: 404, message: "user not found" });

    comentary = new Comentary();
    comentary.user = user;
    comentary.description = newComentary.description;
    comentary.post = post;

    const errors = await validate(comentary);

    console.log(errors)

    if (errors.length > 0)
      return next({ status: 400, message: errors.join("\n") });
    
    await AppDataSource.manager.save(comentary);
  } catch (err) {
    return next({ status: 500, message: err });
  }

  return res.json({ success: true, data: comentary }).status(201);
}

async function updateComment(req: R, res: Res, next: N) {
  const comentary = req.body as commentarySaveDTO;

  if (!comentary.id)
    return next({ status: 400, message: "the propperty id must be present" });

  try {
    const repository = AppDataSource.getRepository(Comentary);
    const count = await repository.count({ where: { id: comentary.id } });
    if (count < 0)
      return next({ status: 404, message: "comentary don't exist" });
    const updateComentary = await repository.update(comentary.id, {
      description: comentary.description,
    });

    res.json({ success: true, data: updateComentary }).status(200);
  } catch (err) {
    next({ status: 500, message: "error to update post" });
  }
}

export { saveComment, getComment, getComments, updateComment, deleteComment };
