import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { sendSuccess } from '../utils/response.util';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  GetVehiclesQuery,
} from '../schemas/vehicle.schema';

export class VehicleController {
  private vehicleService: VehicleService;

  constructor(vehicleService?: VehicleService) {
    this.vehicleService = vehicleService || new VehicleService();
  }

  createVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const input = req.body as CreateVehicleInput;
      const vehicle = await this.vehicleService.createVehicle(
        req.user.userId,
        input
      );
      sendSuccess(res, vehicle, 'Vehicle created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vehicleId = req.params.id;
      const vehicle = await this.vehicleService.getVehicle(vehicleId);
      sendSuccess(res, vehicle);
    } catch (error) {
      next(error);
    }
  };

  getVehiclesByStore = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const storeId = req.params.storeId;
      const query = req.query as unknown as GetVehiclesQuery;
      const availableOnly = req.query.available === 'true';
      const result = await this.vehicleService.getVehiclesByStore(
        storeId,
        query.page,
        query.limit,
        availableOnly
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  updateVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const vehicleId = req.params.id;
      const input = req.body as UpdateVehicleInput;
      const vehicle = await this.vehicleService.updateVehicle(
        vehicleId,
        req.user.userId,
        input
      );
      sendSuccess(res, vehicle, 'Vehicle updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const vehicleId = req.params.id;
      await this.vehicleService.deleteVehicle(vehicleId, req.user.userId);
      sendSuccess(res, null, 'Vehicle deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}


