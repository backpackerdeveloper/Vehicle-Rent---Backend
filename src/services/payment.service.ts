import {
  IPaymentRepository,
  PaymentRepository,
} from '../repositories/payment.repository';
import {
  IRentalRepository,
  RentalRepository,
} from '../repositories/rental.repository';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { ProcessPaymentInput } from '../schemas/payment.schema';
import { generateReceiptPDF, generateReceiptJSON } from '../utils/pdf.util';
import path from 'path';
import env from '../config/env';

export class PaymentService {
  private paymentRepository: IPaymentRepository;
  private rentalRepository: IRentalRepository;

  constructor(
    paymentRepository?: IPaymentRepository,
    rentalRepository?: IRentalRepository
  ) {
    this.paymentRepository = paymentRepository || new PaymentRepository();
    this.rentalRepository = rentalRepository || new RentalRepository();
  }

  async processPayment(rentalRequestId: string, input: ProcessPaymentInput) {
    const rental = await this.rentalRepository.findWithRelations(rentalRequestId);
    if (!rental) {
      throw new NotFoundError('Rental request not found');
    }

    if (rental.status !== 'APPROVED') {
      throw new BadRequestError('Rental must be approved before payment');
    }

    let payment = await this.paymentRepository.findByRentalRequestId(
      rentalRequestId
    );

    if (!payment) {
      payment = await this.paymentRepository.create({
        rentalRequest: {
          connect: { id: rentalRequestId },
        },
        amount: input.amount,
        method: input.method.toUpperCase() as 'CARD' | 'UPI' | 'CASH' | 'MOCK',
        status: 'PENDING',
      });
    } else {
      if (payment.status === 'SUCCESS') {
        throw new BadRequestError('Payment already completed');
      }
      payment = await this.paymentRepository.update(payment.id, {
        amount: input.amount,
        method: input.method.toUpperCase(),
        status: 'PENDING',
      });
    }

    const paymentResult = await this.mockPaymentProcess(
      input.amount,
      input.method
    );

    if (paymentResult.success) {
      payment = await this.paymentRepository.update(payment.id, {
        status: 'SUCCESS',
      });

      const paymentWithRental = await this.paymentRepository.findWithRental(
        payment.id
      );
      if (!paymentWithRental) {
        throw new NotFoundError('Payment not found');
      }

      const receiptUrl = await generateReceiptPDF(paymentWithRental);
      payment = await this.paymentRepository.update(payment.id, {
        receiptUrl,
      });

      await this.rentalRepository.update(rentalRequestId, {
        status: 'COMPLETED',
      });
    } else {
      payment = await this.paymentRepository.update(payment.id, {
        status: 'FAILED',
      });
    }

    return payment;
  }

  async getPayment(id: string) {
    const payment = await this.paymentRepository.findWithRental(id);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }
    return payment;
  }

  async downloadReceipt(id: string, format: 'pdf' | 'json' = 'pdf') {
    const payment = await this.paymentRepository.findWithRental(id);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    if (payment.status !== 'SUCCESS') {
      throw new BadRequestError('Payment must be successful to download receipt');
    }

    if (format === 'json') {
      const receiptUrl = generateReceiptJSON(payment);
      return {
        receiptUrl,
        filePath: path.join(env.UPLOAD_DIR, receiptUrl),
      };
    }

    if (!payment.receiptUrl) {
      const receiptUrl = await generateReceiptPDF(payment);
      await this.paymentRepository.update(id, { receiptUrl });
      return {
        receiptUrl,
        filePath: path.join(env.UPLOAD_DIR, receiptUrl),
      };
    }

    return {
      receiptUrl: payment.receiptUrl,
      filePath: path.join(env.UPLOAD_DIR, payment.receiptUrl),
    };
  }

  private async mockPaymentProcess(
    amount: number,
    method: string
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (method === 'mock') {
      return { success: true, message: 'Mock payment successful' };
    }

    if (amount < 0) {
      return { success: false, message: 'Invalid amount' };
    }

    if (method === 'cash') {
      return { success: true, message: 'Cash payment successful' };
    }

    const random = Math.random();
    return {
      success: random > 0.2,
      message: random > 0.2 ? 'Payment successful' : 'Payment failed',
    };
  }
}

