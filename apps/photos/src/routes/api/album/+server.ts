import { serverApi } from '$lib/server/api/index.js'
import { json } from '@sveltejs/kit'

export const POST = async ({ request }) => {
    return json(await serverApi.album.create(await request.json()))
}

export const DELETE = async ({ request }) => {
    return json(await serverApi.album.delete(await request.json()))
}

// export const PATCH = async ({ request }) => {
//     return json(await serverApi.album.edit(await request.json()))
// }