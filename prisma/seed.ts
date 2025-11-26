import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const SALT_ROUNDS = 10;
  const customerPassword = await bcrypt.hash('customer123', SALT_ROUNDS);
  const ownerPassword = await bcrypt.hash('owner123', SALT_ROUNDS);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'John Customer',
      email: 'customer@example.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Jane Owner',
      email: 'owner@example.com',
      passwordHash: ownerPassword,
      role: 'OWNER',
    },
  });

  const store = await prisma.store.upsert({
    where: { id: 'store-1' },
    update: {},
    create: {
      id: 'store-1',
      ownerId: owner.id,
      name: 'Premium Vehicle Rentals',
      location: '123 Main Street, New York, NY 10001',
      latitude: 40.7128,
      longitude: -74.006,
    },
  });

  const vehicle1 = await prisma.vehicle.upsert({
    where: { id: 'vehicle-1' },
    update: {},
    create: {
      id: 'vehicle-1',
      storeId: store.id,
      title: '2023 Toyota Camry',
      description: 'Reliable and fuel-efficient sedan perfect for city driving',
      rentPerDay: 50.0,
      rentPerMonth: 1200.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c399107c9?w=800',
          },
        ],
      },
    },
  });

  await prisma.vehicle.upsert({
    where: { id: 'vehicle-2' },
    update: {},
    create: {
      id: 'vehicle-2',
      storeId: store.id,
      title: '2022 Honda Accord',
      description: 'Comfortable and spacious sedan with modern features',
      rentPerDay: 55.0,
      rentPerMonth: 1300.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
          },
        ],
      },
    },
  });

  await prisma.vehicle.upsert({
    where: { id: 'vehicle-3' },
    update: {},
    create: {
      id: 'vehicle-3',
      storeId: store.id,
      title: '2023 Ford F-150',
      description: 'Powerful pickup truck for heavy-duty tasks',
      rentPerDay: 80.0,
      rentPerMonth: 2000.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
          },
        ],
      },
    },
  });

  await prisma.vehicle.upsert({
    where: { id: 'vehicle-4' },
    update: {},
    create: {
      id: 'vehicle-4',
      storeId: store.id,
      title: '2022 Tesla Model 3',
      description: 'Electric sedan with autopilot features and long range',
      rentPerDay: 90.0,
      rentPerMonth: 2200.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1560959073-6d3a65d1f5a7?w=800',
          },
        ],
      },
    },
  });

  await prisma.vehicle.upsert({
    where: { id: 'vehicle-5' },
    update: {},
    create: {
      id: 'vehicle-5',
      storeId: store.id,
      title: '2023 BMW 3 Series',
      description: 'Luxury sedan with premium features and sporty performance',
      rentPerDay: 95.0,
      rentPerMonth: 2400.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
          },
        ],
      },
    },
  });

  await prisma.vehicle.upsert({
    where: { id: 'vehicle-6' },
    update: {},
    create: {
      id: 'vehicle-6',
      storeId: store.id,
      title: '2022 Mercedes-Benz C-Class',
      description: 'Elegant luxury sedan perfect for business or leisure',
      rentPerDay: 100.0,
      rentPerMonth: 2500.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
          },
        ],
      },
    },
  });

  await prisma.vehicle.upsert({
    where: { id: 'vehicle-7' },
    update: {},
    create: {
      id: 'vehicle-7',
      storeId: store.id,
      title: '2023 Jeep Wrangler',
      description: 'Rugged SUV perfect for off-road adventures',
      rentPerDay: 85.0,
      rentPerMonth: 2100.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800',
          },
        ],
      },
    },
  });

  await prisma.vehicle.upsert({
    where: { id: 'vehicle-8' },
    update: {},
    create: {
      id: 'vehicle-8',
      storeId: store.id,
      title: '2022 Audi A4',
      description: 'Premium compact sedan with advanced technology',
      rentPerDay: 88.0,
      rentPerMonth: 2150.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
          },
        ],
      },
    },
  });

  await prisma.vehicle.upsert({
    where: { id: 'vehicle-9' },
    update: {},
    create: {
      id: 'vehicle-9',
      storeId: store.id,
      title: '2023 Hyundai Elantra',
      description: 'Fuel-efficient compact car with modern design',
      rentPerDay: 45.0,
      rentPerMonth: 1100.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
          },
        ],
      },
    },
  });

  await prisma.vehicle.upsert({
    where: { id: 'vehicle-10' },
    update: {},
    create: {
      id: 'vehicle-10',
      storeId: store.id,
      title: '2022 Chevrolet Tahoe',
      description: 'Spacious full-size SUV ideal for families and groups',
      rentPerDay: 110.0,
      rentPerMonth: 2800.0,
      isAvailable: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800',
          },
        ],
      },
    },
  });

  await prisma.rentalRequest.upsert({
    where: { id: 'rental-1' },
    update: {},
    create: {
      id: 'rental-1',
      vehicleId: vehicle1.id,
      customerId: customer.id,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-05'),
      totalAmount: 200.0,
      status: 'PENDING',
    },
  });

  console.log('Seed data created:');
  console.log(`- Customer: ${customer.email}`);
  console.log(`- Owner: ${owner.email}`);
  console.log(`- Store: ${store.name}`);
  console.log(`- Vehicles: 10`);
  console.log(`- Rental Request: 1`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

