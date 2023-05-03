import { PrismaClient } from '@prisma/client';
import { withPresets } from '@zenstackhq/runtime';
import dotEnv from 'dotenv';

dotEnv.config();

const prisma = new PrismaClient();

async function main() {
    await prisma.diagramDocument.deleteMany();
    await prisma.document.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.create({
        data: {
            projects: {
                create: {
                    documents: {
                        create: {
                            isPublic: true,
                            diagramDocuments: {
                                create: {},
                            },
                        },
                    },
                },
            },
        },
    });

    const db = withPresets(prisma);
    const docs = await db.document.findMany();
    console.log(docs);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
