import { Router } from "express";
import { postController } from '.'

const postRoutes = Router();

postRoutes.get('',postController.getPosts);
postRoutes.get('/search', postController.searchPosts);
postRoutes.get('/:id', postController.getPost);
postRoutes.get('/user/:id',postController.getPostsByUser);
postRoutes.post('', postController.savePosts);
postRoutes.put('', postController.updatePosts);
postRoutes.delete('/:id', postController.deletePost);

export { postRoutes }