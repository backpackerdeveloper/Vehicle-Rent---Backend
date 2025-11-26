import { Request, Response, NextFunction } from 'express';
import { RentalService } from '../services/rental.service';
import { sendSuccess } from '../utils/response.util';
import {
  CreateRentalRequestInput,
  RenewRentalInput,
} from '../schemas/rental.schema';

export class RentalController {
  private rentalService: RentalService;

  constructor(rentalService?: RentalService) {
    this.rentalService = rentalService || new RentalService();
  }

  createRentalRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const input = req.body as CreateRentalRequestInput;
      const rental = await this.rentalService.createRentalRequest(
        req.user.userId,
        input
      );
      sendSuccess(res, rental, 'Rental request created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getRentalRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const rentalId = req.params.id;
      const rental = await this.rentalService.getRentalRequest(rentalId);
      sendSuccess(res, rental);
    } catch (error) {
      next(error);
    }
  };

  getCustomerRentals = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const result = await this.rentalService.getCustomerRentals(
        req.user.userId,
        req.query.page as string,
        req.query.limit as string
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  getOwnerRentals = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const result = await this.rentalService.getOwnerRentals(
        req.user.userId,
        req.query.page as string,
        req.query.limit as string
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  approveRental = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const rentalId = req.params.id;
      const rental = await this.rentalService.approveRental(
        rentalId,
        req.user.userId
      );
      sendSuccess(res, rental, 'Rental approved successfully');
    } catch (error) {
      next(error);
    }
  };

  rejectRental = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const rentalId = req.params.id;
      const rental = await this.rentalService.rejectRental(
        rentalId,
        req.user.userId
      );
      sendSuccess(res, rental, 'Rental rejected');
    } catch (error) {
      next(error);
    }
  };

  renewRental = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const rentalId = req.params.id;
      const input = req.body as RenewRentalInput;
      const rental = await this.rentalService.renewRental(
        rentalId,
        req.user.userId,
        input
      );
      sendSuccess(res, rental, 'Rental renewed successfully');
    } catch (error) {
      next(error);
    }
  };
}


