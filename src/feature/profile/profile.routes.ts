import { Router } from "express";
import { profileController } from '.'
import { upload } from "../../middleware/multer";

const profileRoutes = Router();

profileRoutes.get('',profileController.getProfiles);
profileRoutes.get(':id', profileController.getProfile);
profileRoutes.post('', profileController.saveProfile);
profileRoutes.put('',upload.single('img'), profileController.updateProfiles);
profileRoutes.delete(':id', profileController.deleteProfile);

export { profileRoutes };