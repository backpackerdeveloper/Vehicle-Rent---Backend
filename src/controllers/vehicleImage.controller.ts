import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prismaClient';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { sendSuccess } from '../utils/response.util';

export class VehicleImageController {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const vehicleId = req.params.id;
      const file = req.file;

      if (!file) {
        throw new Error('No file uploaded');
      }

      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        include: { store: true },
      });

      if (!vehicle) {
        throw new NotFoundError('Vehicle not found');
      }

      if (vehicle.store.ownerId !== req.user.userId) {
        throw new ForbiddenError('You can only upload images to your own vehicles');
      }

      const imageUrl = `/vehicles/${file.filename}`;

      const vehicleImage = await prisma.vehicleImage.create({
        data: {
          vehicleId,
          imageUrl,
        },
      });

      sendSuccess(res, vehicleImage, 'Image uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const imageId = req.params.imageId;

      const image = await prisma.vehicleImage.findUnique({
        where: { id: imageId },
        include: {
          vehicle: {
            include: { store: true },
          },
        },
      });

      if (!image) {
        throw new NotFoundError('Image not found');
      }

      if (image.vehicle.store.ownerId !== req.user.userId) {
        throw new ForbiddenError('You can only delete images from your own vehicles');
      }

      await prisma.vehicleImage.delete({
        where: { id: imageId },
      });

      sendSuccess(res, null, 'Image deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}


