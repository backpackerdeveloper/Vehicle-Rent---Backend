import {
  IRentalRepository,
  RentalRepository,
} from '../repositories/rental.repository';
import {
  IVehicleRepository,
  VehicleRepository,
} from '../repositories/vehicle.repository';
import {
  IStoreRepository,
  StoreRepository,
} from '../repositories/store.repository';
import {
  IPaymentRepository,
  PaymentRepository,
} from '../repositories/payment.repository';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import {
  CreateRentalRequestInput,
  RenewRentalInput,
} from '../schemas/rental.schema';
import { getPaginationParams, createPaginatedResponse } from '../utils/pagination.util';

export class RentalService {
  private rentalRepository: IRentalRepository;
  private vehicleRepository: IVehicleRepository;
  private storeRepository: IStoreRepository;
  private paymentRepository: IPaymentRepository;

  constructor(
    rentalRepository?: IRentalRepository,
    vehicleRepository?: IVehicleRepository,
    storeRepository?: IStoreRepository,
    paymentRepository?: IPaymentRepository
  ) {
    this.rentalRepository = rentalRepository || new RentalRepository();
    this.vehicleRepository = vehicleRepository || new VehicleRepository();
    this.storeRepository = storeRepository || new StoreRepository();
    this.paymentRepository = paymentRepository || new PaymentRepository();
  }

  async createRentalRequest(customerId: string, input: CreateRentalRequestInput) {
    const vehicle = await this.vehicleRepository.findWithStore(input.vehicleId);
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    if (!vehicle.isAvailable) {
      throw new BadRequestError('Vehicle is not available');
    }

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (startDate >= endDate) {
      throw new BadRequestError('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new BadRequestError('Start date cannot be in the past');
    }

    const activeRentals = await this.rentalRepository.findActiveRentalsByVehicleId(
      input.vehicleId
    );

    const hasConflict = activeRentals.some(
      (rental) =>
        (startDate >= rental.startDate && startDate <= rental.endDate) ||
        (endDate >= rental.startDate && endDate <= rental.endDate) ||
        (startDate <= rental.startDate && endDate >= rental.endDate)
    );

    if (hasConflict) {
      throw new BadRequestError('Vehicle is already rented for this period');
    }

    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalAmount =
      daysDiff >= 30
        ? Number(vehicle.rentPerMonth) * (daysDiff / 30)
        : Number(vehicle.rentPerDay) * daysDiff;

    const rentalRequest = await this.rentalRepository.create({
      vehicle: {
        connect: { id: input.vehicleId },
      },
      customer: {
        connect: { id: customerId },
      },
      startDate,
      endDate,
      totalAmount,
      status: 'PENDING',
    });

    return rentalRequest;
  }

  async getRentalRequest(id: string) {
    const rental = await this.rentalRepository.findWithRelations(id);
    if (!rental) {
      throw new NotFoundError('Rental request not found');
    }
    return rental;
  }

  async getCustomerRentals(customerId: string, page?: string, limit?: string) {
    const pagination = getPaginationParams(page, limit);
    const [rentals, total] = await Promise.all([
      this.rentalRepository.findByCustomerId(
        customerId,
        pagination.page,
        pagination.limit
      ),
      this.rentalRepository.countByCustomerId(customerId),
    ]);

    return createPaginatedResponse(rentals, total, pagination);
  }

  async getOwnerRentals(ownerId: string, page?: string, limit?: string) {
    const pagination = getPaginationParams(page, limit);
    const [rentals, total] = await Promise.all([
      this.rentalRepository.findByStoreOwnerId(
        ownerId,
        pagination.page,
        pagination.limit
      ),
      this.rentalRepository.countByStoreOwnerId(ownerId),
    ]);

    return createPaginatedResponse(rentals, total, pagination);
  }

  async approveRental(rentalId: string, ownerId: string) {
    const rental = await this.rentalRepository.findWithRelations(rentalId);
    if (!rental) {
      throw new NotFoundError('Rental request not found');
    }

    if (rental.vehicle.store.ownerId !== ownerId) {
      throw new ForbiddenError('You can only approve rentals for your own vehicles');
    }

    if (rental.status !== 'PENDING') {
      throw new BadRequestError('Rental request is not pending');
    }

    const updatedRental = await this.rentalRepository.update(rentalId, {
      status: 'APPROVED',
    });

    await this.paymentRepository.create({
      rentalRequest: {
        connect: { id: rentalId },
      },
      amount: rental.totalAmount,
      method: 'MOCK',
      status: 'PENDING',
    });

    return updatedRental;
  }

  async rejectRental(rentalId: string, ownerId: string) {
    const rental = await this.rentalRepository.findWithRelations(rentalId);
    if (!rental) {
      throw new NotFoundError('Rental request not found');
    }

    if (rental.vehicle.store.ownerId !== ownerId) {
      throw new ForbiddenError('You can only reject rentals for your own vehicles');
    }

    if (rental.status !== 'PENDING') {
      throw new BadRequestError('Rental request is not pending');
    }

    return this.rentalRepository.update(rentalId, {
      status: 'CANCELLED',
    });
  }

  async renewRental(rentalId: string, customerId: string, input: RenewRentalInput) {
    const rental = await this.rentalRepository.findWithRelations(rentalId);
    if (!rental) {
      throw new NotFoundError('Rental request not found');
    }

    if (rental.customerId !== customerId) {
      throw new ForbiddenError('You can only renew your own rentals');
    }

    if (rental.status !== 'APPROVED') {
      throw new BadRequestError('Only approved rentals can be renewed');
    }

    const newEndDate = new Date(input.newEndDate);
    if (newEndDate <= rental.endDate) {
      throw new BadRequestError('New end date must be after current end date');
    }

    const daysDiff = Math.ceil(
      (newEndDate.getTime() - rental.endDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const additionalAmount =
      daysDiff >= 30
        ? Number(rental.vehicle.rentPerMonth) * (daysDiff / 30)
        : Number(rental.vehicle.rentPerDay) * daysDiff;

    const updatedRental = await this.rentalRepository.update(rentalId, {
      endDate: newEndDate,
      totalAmount: Number(rental.totalAmount) + additionalAmount,
    });

    if (rental.payment) {
      await this.paymentRepository.update(rental.payment.id, {
        amount: updatedRental.totalAmount,
        status: 'PENDING',
      });
    }

    return updatedRental;
  }
}

