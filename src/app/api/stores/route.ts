import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      select: {
        storeId: true,
        name: true,
        ownerName: true,
        latitude: true,
        longitude: true,
        status: true,
        address: true,
        phone: true,
        email: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json(
      { error: "Error al obtener las tiendas" },
      { status: 500 }
    );
  }
}
