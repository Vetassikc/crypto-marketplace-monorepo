import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- ШАБЛОНИ ХАРАКТЕРИСТИК ---
  const smartphoneTemplate = {
    "Екран": "",
    "Процесор": "",
    "Пам'ять": "",
    "Камера": "",
    "Батарея": ""
  };

  const laptopTemplate = {
    "Діагональ екрану": "",
    "Процесор": "",
    "Оперативна пам'ять": "",
    "Тип накопичувача": "",
    "Об'єм накопичувача": ""
  };
  
  const headphonesTemplate = {
    "Тип": "Накладні / Вакуумні",
    "Підключення": "Дротове / Бездротове",
    "Час роботи": ""
  };

  const clothesTemplate = {
    "Матеріал": "",
    "Розмір": "",
    "Стать": "Чоловіча / Жіноча / Унісекс",
    "Сезон": ""
  }

  // Дані категорій з шаблонами
  const categoriesData = [
    {
      name: 'Електроніка',
      children: [
        { name: 'Смартфони', template: smartphoneTemplate },
        { name: 'Ноутбуки', template: laptopTemplate },
        { name: 'Навушники', template: headphonesTemplate },
        { name: 'Телевізори', template: {} },
      ],
    },
    {
      name: 'Мода та стиль',
      children: [
        { name: 'Чоловічий одяг', template: clothesTemplate },
        { name: 'Жіночий одяг', template: clothesTemplate },
        { name: 'Взуття', template: {} },
        { name: 'Аксесуари', template: {} },
      ],
    },
    {
      name: 'Дім та сад',
      children: [
        { name: 'Меблі', template: {} },
        { name: 'Декор', template: {} },
        { name: 'Освітлення', template: {} },
      ]
    }
  ];

  // 1. Створюємо Категорії
  for (const category of categoriesData) {
    const parent = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
    console.log(`Upserted category: ${parent.name}`);

    for (const subcategory of category.children) {
      await prisma.category.upsert({
        where: { name: subcategory.name },
        update: {
            specificationsTemplate: subcategory.template || {},
        },
        create: {
          name: subcategory.name,
          parentId: parent.id,
          specificationsTemplate: subcategory.template || {},
        },
      });
      console.log(`  - Upserted subcategory: ${subcategory.name}`);
    }
  }

  // 2. Створюємо Користувача (Власника)
  const user = await prisma.user.upsert({
    where: { walletAddress: '0x1234567890abcdef1234567890abcdef12345678' },
    update: {},
    create: {
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      name: 'Demo Seller',
      sellerStatus: 'APPROVED'
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // 3. Створюємо Магазин для цього користувача
  const store = await prisma.store.upsert({
    where: { ownerId: user.id },
    update: {},
    create: {
      name: "Demo Store",
      description: "The best crypto goods provided by seed script",
      ownerId: user.id,
    },
  });

  console.log(`Created store with id: ${store.id}`);

  // 4. Створюємо Товари, прив'язані до Магазину
  // Знаходимо категорію для товарів (наприклад, "Смартфони")
  const smartphoneCategory = await prisma.category.findFirst({ where: { name: 'Смартфони' } });

  if (smartphoneCategory) {
      const productsData = [
        {
          name: 'iPhone 15 Pro',
          description: 'Latest iPhone model',
          price: 999.00,
          imageUrls: ['https://via.placeholder.com/150'],
          categoryId: smartphoneCategory.id,
          storeId: store.id,
          specifications: { "Екран": "6.1", "Пам'ять": "128GB" }
        },
        {
          name: 'Samsung Galaxy S24',
          description: 'Newest Samsung flagship',
          price: 899.00,
          imageUrls: ['https://via.placeholder.com/150'],
          categoryId: smartphoneCategory.id,
          storeId: store.id,
          specifications: { "Екран": "6.2", "Пам'ять": "256GB" }
        },
      ];

      for (const p of productsData) {
        // Перевіряємо, чи існує товар, щоб уникнути дублікатів (спрощено за назвою)
        // Але оскільки name не unique, просто створюємо
        const product = await prisma.product.create({
          data: p,
        });
        console.log(`Created product with id: ${product.id}`);
      }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });