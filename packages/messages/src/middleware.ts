import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const withHeaders = (response: Response | NextResponse) => {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set(
        'Access-Control-Allow-Headers',
        // eslint-disable-next-line max-len
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Cookie, Date, X-Api-Version'
    );

    return response;
};

export function middleware({ method }: NextRequest) {
    if (method === 'OPTIONS') { // Preflight request, does not work with 'NextResponse.next()'
        return withHeaders(new Response());
    }

    return withHeaders(NextResponse.next());
}

export const config = {
    matcher: '/:path*'
};
