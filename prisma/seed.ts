import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const seedSuperAdmin = async () => {
  try {
    const isExistsSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.superAdmin,
      },
    });

    if (isExistsSuperAdmin) {
      console.log("Super admin is already exists!");
      return;
    }

    const hashedPassword: string = await bcrypt.hash("superAdmin123", 12);
    const superAdminData = await prisma.user.create({
      data: {
        email: "superAdmin@gmail.com",
        password: "superAdmin123",
        role: UserRole.superAdmin,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "01936276482",
          },
        },
      },
    });
    console.log("SUper Admin Created Successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();

// async function main() {
//   try {
//     // Delete all entries for each model

//     await prisma.prescription.deleteMany();
//     await prisma.review.deleteMany();
//     await prisma.payment.deleteMany();
//     await prisma.appointment.deleteMany();
//     await prisma.doctorSchedules.deleteMany();
//     await prisma.schedule.deleteMany();
//     console.log("All data deleted successfully.");
//   } catch (error) {
//     console.error("Error deleting data:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main().catch((error) => {
//   console.error("Error in main:", error);
//   process.exit(1);
// });
