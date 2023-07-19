import { PrismaClient } from '@prisma/client';
import { range } from 'lodash';

const prisma = new PrismaClient();

const USERS = [
    'Balázs'
] as const;

async function main() {
    const createMessages = {
        create: (() => {
            const messages = new Array<{ content: string }>(100);

            for (const increment of range(1, 100)) {
                if (Math.random() <= 0.1) {
                    messages.push({
                        content: `This message is proud to be number ${increment} and has a 10% chance of existing.`
                    });
                    continue;
                }

                if (Math.random() <= 0.05) {
                    messages.push({
                        content: `This message is even prouder to be number ${increment} and has a 5% chance of being around for you.`
                    });
                    continue;
                }

                if (Math.random() <= 0.025) {
                    messages.push({
                        content: `I like the number ${increment}. Also, I'm a pair of socks and I smell like cheese.`
                    });
                    continue;
                }

                if (increment % 3 === 0) {
                    messages.push({
                        content: `This is message number ${increment}, but it has some additional content to make it look less boring.`
                    });
                } else {
                    messages.push({
                        content: `This is message number ${increment}.`
                    });
                }
            };

            messages.push({
                content: 'This is the last message :)'
            });

            return messages;
        })()
    };

    for (const user of USERS) {
        const userSeed = await prisma.user.upsert({
            where: { email: `${user.toLowerCase()}@balazsburjan-examples.com` },
            update: {
                messages: createMessages
            },
            create: {
                email: `${user.toLowerCase()}@balazsburjan-examples.com`,
                name: user,
                messages: createMessages
            }
        });

        console.log('Seeding database: ', userSeed);
    }
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
