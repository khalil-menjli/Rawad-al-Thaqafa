import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Offers from './modules/offers Cultural/offers.model.js';

dotenv.config();

// Predefined Partner IDs
const predefinedPartnerIds = [
  "68018b32557a8dc65f3b94b7",
  "68018b32557a8dc65f3b94bc",
  "68018b32557a8dc65f3b94c3",
  "68018b32557a8dc65f3b94c5",
  "68018b32557a8dc65f3b94c7",
  "6806259170b1a070358a1b4e"
];

const categoriesList = ['Books', 'Cinema', 'Library', 'Museums'];

// Map partner IDs to categories
const partnerCategories = predefinedPartnerIds.map((id, index) => ({
  partnerId: id,
  category: categoriesList[index % categoriesList.length]
}));

const seedOffers = async () => {
  const offers = Array.from({ length: 50 }, () => {
    // Select a random partner from our predefined list
    const partnerInfo = faker.helpers.arrayElement(partnerCategories);
    const startDate = faker.date.soon({ days: 10 });
    const endDate = faker.date.future({ years: 0.1, refDate: startDate });

    return {
      title: `${faker.commerce.productName()} ${faker.string.alphanumeric(5)}`,
      description: faker.lorem.paragraph(),
      imageUrl: faker.image.url(),
      price: faker.commerce.price({ min: 20, max: 1000 }),
      location: `${faker.location.city()}, Lebanon`,
      dateStart: startDate,
      dateEnd: endDate,
      createdBy: new mongoose.Types.ObjectId(partnerInfo.partnerId),
      views: faker.number.int({ min: 0, max: 1000 }),
      reservation: faker.number.int({ min: 50, max: 200 }),
      categories: partnerInfo.category
    };
  });

  await Offers.insertMany(offers);
  console.log(`✅ Inserted ${offers.length} offers.`);
};

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('Missing MONGO_URI');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    await seedOffers();

    console.log('🎉 Database seeded successfully with offers only!');
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedDatabase();