import { redirect } from "@sveltejs/kit";

export function load({cookies}) {
    const accessToken=cookies.get("access_token");

    // cookie expired
    if (!accessToken) {
        throw redirect(303, '/login');
    }

    try {
        // base64 decode payload
        const payloadB64 = accessToken.split('.');
        const payload = JSON.parse(Buffer.from(payloadB64[1], 'base64url').toString('utf8'));
        
        const user = {
            "id" : payload['id'],
            "email" : payload['userEmail'],
            "fullName" : payload['userName'],
            "role" : payload['role'],
        }

        return {
            user : user,
        }
    } catch (error) {
        cookies.delete("access_token",{path:"/"})
        throw redirect(303, '/login');
    }
}
