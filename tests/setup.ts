import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rentalRequest.deleteMany();
  await prisma.vehicleImage.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
});


