import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createVehicleSchema,
  updateVehicleSchema,
  getVehiclesSchema,
  getVehicleSchema,
} from '../schemas/vehicle.schema';
import { uploadVehicleImage } from '../utils/upload.util';
import { VehicleImageController } from '../controllers/vehicleImage.controller';

const router = Router();
const vehicleController = new VehicleController();
const vehicleImageController = new VehicleImageController();

router.get('/store/:storeId', validate(getVehiclesSchema), vehicleController.getVehiclesByStore);
router.get('/:id', validate(getVehicleSchema), vehicleController.getVehicle);

router.use(authenticate);
router.use(authorize('owner'));

router.post('/', validate(createVehicleSchema), vehicleController.createVehicle);
router.post(
  '/:id/images',
  uploadVehicleImage.single('image'),
  vehicleImageController.uploadImage
);
router.delete('/:id/images/:imageId', vehicleImageController.deleteImage);
router.put('/:id', validate(updateVehicleSchema), vehicleController.updateVehicle);
router.delete('/:id', validate(getVehicleSchema), vehicleController.deleteVehicle);

export default router;

