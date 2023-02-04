import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USERS = [
    'Jonathan',
    'Busa',
    'Tusa',
    'Geralt',
    'Johnny',
    'Bonny'
] as const;

const MESSAGES = [
    'I could never have guessed that such things are possible. Long live the King, dear Gandalf, the White!',
    'Lorem ipsum dolor sit amet',
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
     Eu mi bibendum neque egestas congue. Dignissim suspendisse in est ante in nibh.
     Ac ut consequat semper viverra nam libero justo laoreet. Mollis aliquam ut porttitor leo a diam sollicitudin tempor.
     Vitae tempus quam pellentesque nec. Sem nulla pharetra diam sit amet nisl. Ut etiam sit amet nisl.
     Magna fermentum iaculis eu non diam phasellus. Eu sem integer vitae justo eget magna fermentum.
     Orci eu lobortis elementum nibh tellus molestie nunc. Tempor nec feugiat nisl pretium fusce id velit.
     Varius duis at consectetur lorem donec massa sapien faucibus. Purus in mollis nunc sed.
     Ligula ullamcorper malesuada proin libero nunc consequat interdum. Bibendum est ultricies integer quis.
     Varius vel pharetra vel turpis nunc.`,
] as const;

async function main() {
    const messageCreateOrUpdate = {
        create: MESSAGES.map(message => ({
            content: message,
        }))
    };

    for (const user of USERS) {
        const userSeed = await prisma.user.upsert({
            where: { email: `${user.toLowerCase()}@balazsburjan-examples.com` },
            update: {
                messages: messageCreateOrUpdate
            },
            create: {
                email: `${user.toLowerCase()}@balazsburjan-examples.com`,
                name: user,
                messages: messageCreateOrUpdate
            }
        });

        console.log('Seeding database: ', userSeed);
    }

    const x = await prisma.message.findMany();
    console.log('Messages', x);

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
