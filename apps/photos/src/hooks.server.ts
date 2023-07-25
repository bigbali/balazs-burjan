import { SvelteKitAuth } from '@auth/sveltekit';
import { AUTH_SECRET, PASSWORD } from '$env/static/private';
import Credentials from '@auth/core/providers/credentials';

export const handle = SvelteKitAuth({
    providers: [
        Credentials({
            name: 'BEJELENTKEZÉS',
            credentials: {
                password: { label: 'Jelszó', type: 'password' }
            },
            async authorize(credentials) {
                const user = { id: '1', name: 'Családtag' };

                return credentials.password === PASSWORD ? user : null;
            }
        })
    ],
    secret: AUTH_SECRET,
    pages: {
        signIn: '/bejelentkezes',
        signOut: '/kijelentkezes',
        error: '/hiba'
    },
    trustHost: true
});