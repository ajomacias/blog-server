import { Router } from "express";
import { comentaryController } from '.'

const comentaryRoutes = Router();

comentaryRoutes.get('/post/:id',comentaryController.getComments);
comentaryRoutes.get('/:id', comentaryController.getComment);
comentaryRoutes.post('', comentaryController.saveComment);
comentaryRoutes.put('', comentaryController.updateComment);
comentaryRoutes.delete('/:id', comentaryController.deleteComment);

export { comentaryRoutes }