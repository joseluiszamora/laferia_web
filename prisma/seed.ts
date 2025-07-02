import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seeding...");

  // Crear categorías de ejemplo
  // const categories = await Promise.all([
  //   prisma.category.upsert({
  //     where: { slug: "alimentos" },
  //     update: {},
  //     create: {
  //       name: "Alimentos",
  //       slug: "alimentos",
  //       description: "Comida fresca y productos alimenticios",
  //       isActive: true,
  //       sortOrder: 1,
  //     },
  //   }),
  //   prisma.category.upsert({
  //     where: { slug: "artesanias" },
  //     update: {},
  //     create: {
  //       name: "Artesanías",
  //       slug: "artesanias",
  //       description: "Productos artesanales y manualidades",
  //       isActive: true,
  //       sortOrder: 2,
  //     },
  //   }),
  //   prisma.category.upsert({
  //     where: { slug: "ropa" },
  //     update: {},
  //     create: {
  //       name: "Ropa",
  //       slug: "ropa",
  //       description: "Vestimenta y accesorios",
  //       isActive: true,
  //       sortOrder: 3,
  //     },
  //   }),
  //   prisma.category.upsert({
  //     where: { slug: "hogar" },
  //     update: {},
  //     create: {
  //       name: "Hogar",
  //       slug: "hogar",
  //       description: "Productos para el hogar y decoración",
  //       isActive: true,
  //       sortOrder: 4,
  //     },
  //   }),
  // ]);

  // console.log(`${categories.length} categorías creadas/actualizadas`);

  // Crear tiendas de ejemplo
  const tiendas = await Promise.all([
    prisma.store.upsert({
      where: { slug: "frutas-don-pepe" },
      update: {},
      create: {
        name: "Frutas Don Pepe",
        slug: "frutas-don-pepe",
        ownerName: "José Pérez",
        email: "jose@frutasdonpepe.com",
        phone: "+506 8888-9999",
        whatsapp: "+506 8888-9999",
        latitude: 9.9281,
        longitude: -84.0907,
        categoryId: 1, // Asumiendo que existe una categoría con ID 1
        address: "Mercado Central, Local 15, San José",
        daysAttention: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ],
        openingHours: "6:00 AM - 4:00 PM",
        status: "ACTIVE",
        description:
          "Las frutas más frescas del mercado central. Más de 20 años de experiencia.",
        averageRating: 4.8,
        totalComments: 45,
      },
    }),
    prisma.store.upsert({
      where: { slug: "artesanias-maria" },
      update: {},
      create: {
        name: "Artesanías María",
        slug: "artesanias-maria",
        ownerName: "María González",
        email: "maria@artesaniasmaria.com",
        phone: "+506 7777-8888",
        whatsapp: "+506 7777-8888",
        latitude: 9.9345,
        longitude: -84.0876,
        categoryId: 1, // Asumiendo que existe una categoría con ID 1
        address: "Calle 7, Avenida 2, San José",
        daysAttention: [
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        openingHours: "9:00 AM - 6:00 PM",
        status: "ACTIVE",
        description: "Artesanías tradicionales costarricenses hechas a mano.",
        averageRating: 4.5,
        totalComments: 23,
      },
    }),
    prisma.store.upsert({
      where: { slug: "boutique-elena" },
      update: {},
      create: {
        name: "Boutique Elena",
        slug: "boutique-elena",
        ownerName: "Elena Rodríguez",
        email: "elena@boutiqueelena.com",
        phone: "+506 6666-7777",
        latitude: 9.9311,
        longitude: -84.089,
        categoryId: 1, // Asumiendo que existe una categoría con ID 1
        address: "Plaza de la Cultura, Local 22",
        daysAttention: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        openingHours: "10:00 AM - 7:00 PM",
        status: "PENDING",
        description: "Ropa de moda para damas y caballeros.",
        averageRating: 0,
        totalComments: 0,
      },
    }),
    prisma.store.upsert({
      where: { slug: "decoracion-hogar-carlos" },
      update: {},
      create: {
        name: "Decoración y Hogar Carlos",
        slug: "decoracion-hogar-carlos",
        ownerName: "Carlos Jiménez",
        email: "carlos@decoracioncarlos.com",
        phone: "+506 5555-6666",
        whatsapp: "+506 5555-6666",
        latitude: 9.9298,
        longitude: -84.0921,
        categoryId: 1, // Asumiendo que existe una categoría con ID 1
        address: "Avenida Central, Frente al Teatro Nacional",
        daysAttention: ["monday", "wednesday", "friday", "saturday"],
        openingHours: "8:00 AM - 5:00 PM",
        status: "ACTIVE",
        description: "Todo para decorar tu hogar con estilo.",
        averageRating: 4.2,
        totalComments: 18,
      },
    }),
    prisma.store.upsert({
      where: { slug: "panaderia-sol" },
      update: {},
      create: {
        name: "Panadería El Sol",
        slug: "panaderia-sol",
        ownerName: "Ana Solís",
        email: "ana@panaderiasol.com",
        phone: "+506 4444-5555",
        latitude: 9.9267,
        longitude: -84.0934,
        categoryId: 1, // Asumiendo que existe una categoría con ID 1
        address: "Barrio Escalante, 200m norte del Farolito",
        daysAttention: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        openingHours: "5:00 AM - 8:00 PM",
        status: "INACTIVE",
        description: "Pan fresco todos los días.",
        averageRating: 4.1,
        totalComments: 67,
      },
    }),
  ]);

  console.log(`${tiendas.length} tiendas creadas/actualizadas`);

  console.log("Seeding completado exitosamente!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
