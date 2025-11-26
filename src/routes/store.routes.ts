import { Router } from 'express';
import { StoreController } from '../controllers/store.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createStoreSchema,
  updateStoreSchema,
  getStoresSchema,
  getStoreSchema,
} from '../schemas/store.schema';

const router = Router();
const storeController = new StoreController();

router.get('/', validate(getStoresSchema), storeController.getStores);
router.get('/:id', validate(getStoreSchema), storeController.getStore);

router.use(authenticate);

router.post('/', authorize('owner'), validate(createStoreSchema), storeController.createStore);
router.get('/owner/my-stores', authorize('owner'), storeController.getOwnerStores);
router.put(
  '/:id',
  authorize('owner'),
  validate(updateStoreSchema),
  storeController.updateStore
);
router.delete('/:id', authorize('owner'), validate(getStoreSchema), storeController.deleteStore);

export default router;


