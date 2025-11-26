import {
  IVehicleRepository,
  VehicleRepository,
} from '../repositories/vehicle.repository';
import {
  IStoreRepository,
  StoreRepository,
} from '../repositories/store.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
} from '../schemas/vehicle.schema';
import { getPaginationParams, createPaginatedResponse } from '../utils/pagination.util';

export class VehicleService {
  private vehicleRepository: IVehicleRepository;
  private storeRepository: IStoreRepository;

  constructor(
    vehicleRepository?: IVehicleRepository,
    storeRepository?: IStoreRepository
  ) {
    this.vehicleRepository = vehicleRepository || new VehicleRepository();
    this.storeRepository = storeRepository || new StoreRepository();
  }

  async createVehicle(ownerId: string, input: CreateVehicleInput) {
    const store = await this.storeRepository.findById(input.storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    if (store.ownerId !== ownerId) {
      throw new ForbiddenError('You can only add vehicles to your own stores');
    }

    const vehicle = await this.vehicleRepository.create({
      title: input.title,
      description: input.description,
      rentPerDay: input.rentPerDay,
      rentPerMonth: input.rentPerMonth,
      isAvailable: input.isAvailable ?? true,
      store: {
        connect: { id: input.storeId },
      },
    });

    return vehicle;
  }

  async getVehicle(id: string) {
    const vehicle = await this.vehicleRepository.findWithStore(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }
    return vehicle;
  }

  async getVehiclesByStore(
    storeId: string,
    page?: string,
    limit?: string,
    availableOnly = false
  ) {
    const pagination = getPaginationParams(page, limit);

    if (availableOnly) {
      const [vehicles, total] = await Promise.all([
        this.vehicleRepository.findAvailableByStoreId(
          storeId,
          pagination.page,
          pagination.limit
        ),
        this.vehicleRepository.countAvailableByStoreId(storeId),
      ]);

      return createPaginatedResponse(vehicles, total, pagination);
    }

    const [vehicles, total] = await Promise.all([
      this.vehicleRepository.findByStoreId(
        storeId,
        pagination.page,
        pagination.limit
      ),
      this.vehicleRepository.countByStoreId(storeId),
    ]);

    return createPaginatedResponse(vehicles, total, pagination);
  }

  async updateVehicle(
    vehicleId: string,
    ownerId: string,
    input: UpdateVehicleInput
  ) {
    const vehicle = await this.vehicleRepository.findWithStore(vehicleId);
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    if (vehicle.store.ownerId !== ownerId) {
      throw new ForbiddenError('You can only update vehicles in your own stores');
    }

    return this.vehicleRepository.update(vehicleId, input);
  }

  async deleteVehicle(vehicleId: string, ownerId: string) {
    const vehicle = await this.vehicleRepository.findWithStore(vehicleId);
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    if (vehicle.store.ownerId !== ownerId) {
      throw new ForbiddenError('You can only delete vehicles in your own stores');
    }

    await this.vehicleRepository.delete(vehicleId);
  }
}


