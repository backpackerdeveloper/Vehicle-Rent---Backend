import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  processPaymentSchema,
  getPaymentSchema,
  downloadReceiptSchema,
} from '../schemas/payment.schema';

const router = Router();
const paymentController = new PaymentController();

router.use(authenticate);

router.post(
  '/rental/:rentalRequestId',
  validate(processPaymentSchema),
  paymentController.processPayment
);
router.get('/:id', validate(getPaymentSchema), paymentController.getPayment);
router.get(
  '/:id/receipt',
  validate(downloadReceiptSchema),
  paymentController.downloadReceipt
);

export default router;


