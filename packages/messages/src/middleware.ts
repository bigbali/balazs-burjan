import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const withHeaders = (response: Response | NextResponse, headers: Headers) => {
    // return incoming origin as allowed origin as there can only be one
    response.headers.set('Access-Control-Allow-Origin', headers.get('origin') ?? '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
    response.headers.set(
        'Access-Control-Allow-Headers',
        // eslint-disable-next-line max-len
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Cookie, Date, X-Api-Version'
    );

    return response;
};

// allow all origins to prevent CORS issues, since we are using URL rewrites
export function middleware({ method, headers }: NextRequest) {
    if (method === 'OPTIONS') {
        // preflight request, does not work with 'NextResponse.next()'
        return withHeaders(new Response(), headers);
    }

    return withHeaders(NextResponse.next(), headers);
}

export const config = {
    matcher: '/:path*'
};
