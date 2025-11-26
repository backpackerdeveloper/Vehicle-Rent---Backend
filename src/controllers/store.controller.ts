import { Request, Response, NextFunction } from 'express';
import { StoreService } from '../services/store.service';
import { sendSuccess } from '../utils/response.util';
import { CreateStoreInput, UpdateStoreInput, GetStoresQuery } from '../schemas/store.schema';

export class StoreController {
  private storeService: StoreService;

  constructor(storeService?: StoreService) {
    this.storeService = storeService || new StoreService();
  }

  createStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const input = req.body as CreateStoreInput;
      const store = await this.storeService.createStore(req.user.userId, input);
      sendSuccess(res, store, 'Store created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const storeId = req.params.id;
      const store = await this.storeService.getStore(storeId);
      sendSuccess(res, store);
    } catch (error) {
      next(error);
    }
  };

  getStores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as GetStoresQuery;
      const result = await this.storeService.getStores(
        query.page,
        query.limit,
        query.location
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  getOwnerStores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const stores = await this.storeService.getOwnerStores(req.user.userId);
      sendSuccess(res, stores);
    } catch (error) {
      next(error);
    }
  };

  updateStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const storeId = req.params.id;
      const input = req.body as UpdateStoreInput;
      const store = await this.storeService.updateStore(
        storeId,
        req.user.userId,
        input
      );
      sendSuccess(res, store, 'Store updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const storeId = req.params.id;
      await this.storeService.deleteStore(storeId, req.user.userId);
      sendSuccess(res, null, 'Store deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}


