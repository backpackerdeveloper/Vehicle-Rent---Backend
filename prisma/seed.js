"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const SALT_ROUNDS = 10;
    const customerPassword = await bcrypt_1.default.hash('customer123', SALT_ROUNDS);
    const ownerPassword = await bcrypt_1.default.hash('owner123', SALT_ROUNDS);
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
                        imageUrl: '/vehicles/toyota-camry-1.jpg',
                    },
                ],
            },
        },
    });
    const vehicle2 = await prisma.vehicle.upsert({
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
                        imageUrl: '/vehicles/honda-accord-1.jpg',
                    },
                ],
            },
        },
    });
    const vehicle3 = await prisma.vehicle.upsert({
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
                        imageUrl: '/vehicles/ford-f150-1.jpg',
                    },
                ],
            },
        },
    });
    const rentalRequest = await prisma.rentalRequest.upsert({
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
    console.log(`- Vehicles: 3`);
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
//# sourceMappingURL=seed.js.map