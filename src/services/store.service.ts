import {
  IStoreRepository,
  StoreRepository,
} from '../repositories/store.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { CreateStoreInput, UpdateStoreInput } from '../schemas/store.schema';
import { getPaginationParams, createPaginatedResponse } from '../utils/pagination.util';
import { IUserRepository, UserRepository } from '../repositories/user.repository';

export class StoreService {
  private storeRepository: IStoreRepository;
  private userRepository: IUserRepository;

  constructor(
    storeRepository?: IStoreRepository,
    userRepository?: IUserRepository
  ) {
    this.storeRepository = storeRepository || new StoreRepository();
    this.userRepository = userRepository || new UserRepository();
  }

  async createStore(ownerId: string, input: CreateStoreInput) {
    const user = await this.userRepository.findById(ownerId);
    if (!user || user.role !== 'OWNER') {
      throw new ForbiddenError('Only owners can create stores');
    }

    const store = await this.storeRepository.create({
      name: input.name,
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      owner: {
        connect: { id: ownerId },
      },
    });

    return store;
  }

  async getStore(id: string) {
    const store = await this.storeRepository.findWithOwner(id);
    if (!store) {
      throw new NotFoundError('Store not found');
    }
    return store;
  }

  async getStores(page?: string, limit?: string, location?: string) {
    const pagination = getPaginationParams(page, limit);
    const [stores, total] = await Promise.all([
      this.storeRepository.findAll(
        pagination.page,
        pagination.limit,
        location
      ),
      this.storeRepository.count(location),
    ]);

    return createPaginatedResponse(stores, total, pagination);
  }

  async getOwnerStores(ownerId: string) {
    return this.storeRepository.findByOwnerId(ownerId);
  }

  async updateStore(storeId: string, ownerId: string, input: UpdateStoreInput) {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    if (store.ownerId !== ownerId) {
      throw new ForbiddenError('You can only update your own stores');
    }

    return this.storeRepository.update(storeId, input);
  }

  async deleteStore(storeId: string, ownerId: string) {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    if (store.ownerId !== ownerId) {
      throw new ForbiddenError('You can only delete your own stores');
    }

    await this.storeRepository.delete(storeId);
  }
}


