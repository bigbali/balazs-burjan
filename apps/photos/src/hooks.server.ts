import { SvelteKitAuth } from '@auth/sveltekit';
import { ADMIN_PASSWORD, AUTH_SECRET, PASSWORD } from '$env/static/private';
import Credentials from '@auth/core/providers/credentials';
import type { Session } from '@auth/core/types';

export const handle = SvelteKitAuth({
    providers: [
        Credentials({
            name: 'BEJELENTKEZÉS',
            credentials: {
                password: { label: 'Jelszó', type: 'password' }
            },
            async authorize(credentials) {
                if (credentials.password === ADMIN_PASSWORD) {
                    return { id: '0', name: 'Admin', role: 'admin' };
                }

                if (credentials.password === PASSWORD) {
                    return { id: '1', name: 'Családtag', role: 'family_member' };
                }

                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = profile?.id;
            }

            if (user) {
                token = {
                    ...token,
                    ...user
                };
            }

            return token;
        },
        async session({ session, token }) {
            const { id, name, role } = token as Session['user'];

            session.user = {
                id, name, role
            };

            return session;
        }
    },
    secret: AUTH_SECRET,
    pages: {
        signIn: '/bejelentkezes',
        signOut: '/kijelentkezes'
    },
    trustHost: true
});