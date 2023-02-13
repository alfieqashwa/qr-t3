import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const weddingEO = await prisma.eventOrganizer.create({
    data: {
      name: "Qashwa Wedding",
      phone: "081122224444",
      address: {
        create: {
          street: "Komp Diknas RT 003/06, Block C No.5, Cipayung",
          city: "Tangerang Selatan",
          postalCode: "15411"
        }
      },
      events: {
        create: {
          title: "Anya & Ryan Wedding",
          date: "2023-03-13T20:00:00.000Z",
          location: "The Tribata Dharmawangsa"
        }
      },
      users: {
        connect: {
          email: process.env.emailQ
        }
      }
    }
  })

  const musicEO = await prisma.eventOrganizer.create({
    data: {
      name: "Cello Music Organizer",
      phone: "081244443333",
      address: {
        create: {
          street: "Komp Kejaksaan, Block G No.10, Cipayung",
          city: "Tangerang Selatan",
          postalCode: "15415"
        }
      },
      events: {
        create: {
          title: "Konser Padi 2023",
          date: "2023-05-20T21:30:00.000Z",
          location: "Lapangan D Senayan"
        }
      },
      users: {
        connect: {
          email: process.env.emailC
        }
      }
    }
  })

  console.log({ weddingEO, musicEO })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })