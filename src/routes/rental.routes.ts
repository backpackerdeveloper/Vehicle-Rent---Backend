import { Router } from 'express';
import { RentalController } from '../controllers/rental.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createRentalRequestSchema,
  getRentalsSchema,
  getRentalSchema,
  approveRentalSchema,
  rejectRentalSchema,
  renewRentalSchema,
} from '../schemas/rental.schema';

const router = Router();
const rentalController = new RentalController();

router.use(authenticate);

router.post(
  '/',
  authorize('customer'),
  validate(createRentalRequestSchema),
  rentalController.createRentalRequest
);
router.get(
  '/customer/my-rentals',
  authorize('customer'),
  validate(getRentalsSchema),
  rentalController.getCustomerRentals
);
router.get(
  '/owner/my-rentals',
  authorize('owner'),
  validate(getRentalsSchema),
  rentalController.getOwnerRentals
);
router.get('/:id', validate(getRentalSchema), rentalController.getRentalRequest);
router.post(
  '/:id/approve',
  authorize('owner'),
  validate(approveRentalSchema),
  rentalController.approveRental
);
router.post(
  '/:id/reject',
  authorize('owner'),
  validate(rejectRentalSchema),
  rentalController.rejectRental
);
router.post(
  '/:id/renew',
  authorize('customer'),
  validate(renewRentalSchema),
  rentalController.renewRental
);

export default router;

