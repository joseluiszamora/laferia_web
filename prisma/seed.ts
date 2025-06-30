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
    prisma.tienda.upsert({
      where: { slug: "frutas-don-pepe" },
      update: {},
      create: {
        nombre: "Frutas Don Pepe",
        slug: "frutas-don-pepe",
        nombrePropietario: "José Pérez",
        email: "jose@frutasdonpepe.com",
        telefono: "+506 8888-9999",
        whatsapp: "+506 8888-9999",
        latitud: 9.9281,
        longitud: -84.0907,
        categoriaId: "00849615-e3ca-4d0a-8c90-afca4701a92b",
        direccion: "Mercado Central, Local 15, San José",
        diasAtencion: [
          "lunes",
          "martes",
          "miercoles",
          "jueves",
          "viernes",
          "sabado",
        ],
        horarioAtencion: "6:00 AM - 4:00 PM",
        status: "ACTIVA",
        descripcion:
          "Las frutas más frescas del mercado central. Más de 20 años de experiencia.",
        calificacionPromedio: 4.8,
        totalComentarios: 45,
      },
    }),
    prisma.tienda.upsert({
      where: { slug: "artesanias-maria" },
      update: {},
      create: {
        nombre: "Artesanías María",
        slug: "artesanias-maria",
        nombrePropietario: "María González",
        email: "maria@artesaniasmaria.com",
        telefono: "+506 7777-8888",
        whatsapp: "+506 7777-8888",
        latitud: 9.9345,
        longitud: -84.0876,
        categoriaId: "00849615-e3ca-4d0a-8c90-afca4701a92b",
        direccion: "Calle 7, Avenida 2, San José",
        diasAtencion: [
          "martes",
          "miercoles",
          "jueves",
          "viernes",
          "sabado",
          "domingo",
        ],
        horarioAtencion: "9:00 AM - 6:00 PM",
        status: "ACTIVA",
        descripcion: "Artesanías tradicionales costarricenses hechas a mano.",
        calificacionPromedio: 4.5,
        totalComentarios: 23,
      },
    }),
    prisma.tienda.upsert({
      where: { slug: "boutique-elena" },
      update: {},
      create: {
        nombre: "Boutique Elena",
        slug: "boutique-elena",
        nombrePropietario: "Elena Rodríguez",
        email: "elena@boutiqueelena.com",
        telefono: "+506 6666-7777",
        latitud: 9.9311,
        longitud: -84.089,
        categoriaId: "00849615-e3ca-4d0a-8c90-afca4701a92b",
        direccion: "Plaza de la Cultura, Local 22",
        diasAtencion: ["lunes", "martes", "miercoles", "jueves", "viernes"],
        horarioAtencion: "10:00 AM - 7:00 PM",
        status: "PENDIENTE",
        descripcion: "Ropa de moda para damas y caballeros.",
        calificacionPromedio: 0,
        totalComentarios: 0,
      },
    }),
    prisma.tienda.upsert({
      where: { slug: "decoracion-hogar-carlos" },
      update: {},
      create: {
        nombre: "Decoración y Hogar Carlos",
        slug: "decoracion-hogar-carlos",
        nombrePropietario: "Carlos Jiménez",
        email: "carlos@decoracioncarlos.com",
        telefono: "+506 5555-6666",
        whatsapp: "+506 5555-6666",
        latitud: 9.9298,
        longitud: -84.0921,
        categoriaId: "00849615-e3ca-4d0a-8c90-afca4701a92b",
        direccion: "Avenida Central, Frente al Teatro Nacional",
        diasAtencion: ["lunes", "miercoles", "viernes", "sabado"],
        horarioAtencion: "8:00 AM - 5:00 PM",
        status: "ACTIVA",
        descripcion: "Todo para decorar tu hogar con estilo.",
        calificacionPromedio: 4.2,
        totalComentarios: 18,
      },
    }),
    prisma.tienda.upsert({
      where: { slug: "panaderia-sol" },
      update: {},
      create: {
        nombre: "Panadería El Sol",
        slug: "panaderia-sol",
        nombrePropietario: "Ana Solís",
        email: "ana@panaderiasol.com",
        telefono: "+506 4444-5555",
        latitud: 9.9267,
        longitud: -84.0934,
        categoriaId: "00849615-e3ca-4d0a-8c90-afca4701a92b",
        direccion: "Barrio Escalante, 200m norte del Farolito",
        diasAtencion: [
          "lunes",
          "martes",
          "miercoles",
          "jueves",
          "viernes",
          "sabado",
          "domingo",
        ],
        horarioAtencion: "5:00 AM - 8:00 PM",
        status: "INACTIVA",
        descripcion: "Pan fresco todos los días.",
        calificacionPromedio: 4.1,
        totalComentarios: 67,
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
