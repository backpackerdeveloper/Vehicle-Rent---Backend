import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { sendSuccess } from '../utils/response.util';
import { ProcessPaymentInput } from '../schemas/payment.schema';
import fs from 'fs';
import path from 'path';

export class PaymentController {
  private paymentService: PaymentService;

  constructor(paymentService?: PaymentService) {
    this.paymentService = paymentService || new PaymentService();
  }

  processPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rentalRequestId = req.params.rentalRequestId;
      const input = req.body as ProcessPaymentInput;
      const payment = await this.paymentService.processPayment(
        rentalRequestId,
        input
      );
      sendSuccess(res, payment, 'Payment processed successfully');
    } catch (error) {
      next(error);
    }
  };

  getPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paymentId = req.params.id;
      const payment = await this.paymentService.getPayment(paymentId);
      sendSuccess(res, payment);
    } catch (error) {
      next(error);
    }
  };

  downloadReceipt = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const paymentId = req.params.id;
      const format = (req.query.format as 'pdf' | 'json') || 'pdf';
      const { filePath } = await this.paymentService.downloadReceipt(
        paymentId,
        format
      );

      if (!fs.existsSync(filePath)) {
        throw new Error('Receipt file not found');
      }

      const filename = path.basename(filePath);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
      } else {
        res.setHeader('Content-Type', 'application/pdf');
      }

      return res.sendFile(path.resolve(filePath));
    } catch (error) {
      next(error);
    }
  };
}

