import { serverApi } from "$lib/server/api"
import { json } from "@sveltejs/kit"

export const POST = async ({ request }) => {
    return json(await serverApi.image.create(await request.json()))
}

// export const DELETE = async ({ request }) => {
//     return json(await serverApi.image.delete(await request.json()))
// }
