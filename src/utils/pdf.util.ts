import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import env from '../config/env';
import { PaymentWithRental } from '../types';

export const generateReceiptPDF = async (
  payment: PaymentWithRental
): Promise<string> => {
  const doc = new PDFDocument({ margin: 50 });

  const receiptDir = path.join(env.UPLOAD_DIR, 'receipts');
  if (!fs.existsSync(receiptDir)) {
    fs.mkdirSync(receiptDir, { recursive: true });
  }

  const filename = `receipt-${payment.id}.pdf`;
  const filepath = path.join(receiptDir, filename);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('Vehicle Rental Receipt', { align: 'center' });
    doc.moveDown();

    // Receipt Details
    doc.fontSize(12);
    doc.text(`Receipt ID: ${payment.id}`, { align: 'left' });
    doc.text(`Date: ${payment.createdAt.toLocaleDateString()}`, { align: 'left' });
    doc.moveDown();

    // Rental Details
    doc.fontSize(14).text('Rental Details', { underline: true });
    doc.fontSize(12);
    doc.text(`Vehicle: ${payment.rentalRequest.vehicle.title}`);
    doc.text(`Store: ${payment.rentalRequest.vehicle.store.name}`);
    doc.text(`Location: ${payment.rentalRequest.vehicle.store.location}`);
    doc.moveDown();

    // Rental Period
    doc.text(
      `Rental Period: ${payment.rentalRequest.startDate.toLocaleDateString()} - ${payment.rentalRequest.endDate.toLocaleDateString()}`
    );
    doc.moveDown();

    // Payment Details
    doc.fontSize(14).text('Payment Details', { underline: true });
    doc.fontSize(12);
    doc.text(`Amount: $${payment.amount.toFixed(2)}`);
    doc.text(`Method: ${payment.method.toUpperCase()}`);
    doc.text(`Status: ${payment.status.toUpperCase()}`);
    doc.moveDown();

    // Customer Details
    doc.fontSize(14).text('Customer Details', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${payment.rentalRequest.customer.name}`);
    doc.text(`Email: ${payment.rentalRequest.customer.email}`);
    doc.moveDown();

    // Footer
    doc.fontSize(10).text('Thank you for your business!', { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      resolve(`/receipts/${filename}`);
    });

    stream.on('error', reject);
  });
};

export const generateReceiptJSON = (payment: PaymentWithRental): string => {
  const receipt = {
    receiptId: payment.id,
    date: payment.createdAt.toISOString(),
    rental: {
      vehicle: payment.rentalRequest.vehicle.title,
      store: payment.rentalRequest.vehicle.store.name,
      location: payment.rentalRequest.vehicle.store.location,
      startDate: payment.rentalRequest.startDate.toISOString(),
      endDate: payment.rentalRequest.endDate.toISOString(),
    },
    payment: {
      amount: payment.amount.toString(),
      method: payment.method,
      status: payment.status,
    },
    customer: {
      name: payment.rentalRequest.customer.name,
      email: payment.rentalRequest.customer.email,
    },
  };

  const receiptDir = path.join(env.UPLOAD_DIR, 'receipts');
  if (!fs.existsSync(receiptDir)) {
    fs.mkdirSync(receiptDir, { recursive: true });
  }

  const filename = `receipt-${payment.id}.json`;
  const filepath = path.join(receiptDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(receipt, null, 2));

  return `/receipts/${filename}`;
};


