import prisma from '../config/prismaClient';
import logger from '../config/logger';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { sendRentalReminderEmail } from '../utils/email.util';
import { queue } from './queue';

const refreshTokenRepository = new RefreshTokenRepository();

export const setupWorkers = (): void => {
  queue.register('cleanup-expired-tokens', async () => {
    try {
      const count = await refreshTokenRepository.deleteExpired();
      logger.info({ count }, 'Cleaned up expired refresh tokens');
    } catch (error) {
      logger.error({ error }, 'Failed to cleanup expired tokens');
      throw error;
    }
  });

  queue.register('complete-expired-rentals', async () => {
    try {
      const expiredRentals = await prisma.rentalRequest.findMany({
        where: {
          status: 'APPROVED',
          endDate: {
            lt: new Date(),
          },
        },
        include: {
          customer: true,
          vehicle: true,
        },
      });

      for (const rental of expiredRentals) {
        await prisma.rentalRequest.update({
          where: { id: rental.id },
          data: { status: 'COMPLETED' },
        });
      }

      logger.info({ count: expiredRentals.length }, 'Completed expired rentals');
    } catch (error) {
      logger.error({ error }, 'Failed to complete expired rentals');
      throw error;
    }
  });

  queue.register('send-rental-reminders', async () => {
    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const rentals = await prisma.rentalRequest.findMany({
        where: {
          status: 'APPROVED',
          endDate: {
            gte: new Date(),
            lte: threeDaysFromNow,
          },
        },
        include: {
          customer: true,
          vehicle: true,
        },
      });

      for (const rental of rentals) {
        try {
          await sendRentalReminderEmail(
            rental.customer.email,
            rental.customer.name,
            rental.vehicle.title,
            rental.endDate
          );
        } catch (error) {
          logger.error({ error, rentalId: rental.id }, 'Failed to send reminder email');
        }
      }

      logger.info({ count: rentals.length }, 'Sent rental reminders');
    } catch (error) {
      logger.error({ error }, 'Failed to send rental reminders');
      throw error;
    }
  });
};

export const startScheduledJobs = (): void => {
  if (typeof setInterval !== 'undefined') {
    setInterval(() => {
      queue.add('cleanup-expired-tokens', {});
    }, 60 * 60 * 1000);

    setInterval(() => {
      queue.add('complete-expired-rentals', {});
    }, 60 * 60 * 1000);

    setInterval(() => {
      queue.add('send-rental-reminders', {});
    }, 24 * 60 * 60 * 1000);
  }
};

