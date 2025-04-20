const API_READ_KEY = "vfxvljbNYWkluUCXn5Q0Obgr868PJBWXq2XHLpMn5SUHU5gz5c";
const API_WRITE_KEY = "HC6pQfEKvvXoC9MPxDeXwBc911oEqgh19OzV0WY2jppinuEwkP";

export async function queryObjects(query) {
    const response = await fetch(`https://api.cosmicjs.com/v3/buckets/project-bop-production/objects/?read_key=${API_READ_KEY}&query=${encodeURIComponent(JSON.stringify(query))}&limit=100`);

    const result = await response.json();
    return result.objects || [];
}

export async function postObject(object) {
    await fetch(
        `https://api.cosmicjs.com/v3/buckets/project-bop-production/objects/`,
        {
            method: "POST",
            body: JSON.stringify(object),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_WRITE_KEY}`
            }
        }
    );
}

export async function deleteObject(id) {
    await fetch(
        `https://api.cosmicjs.com/v3/buckets/project-bop-production/objects/${id}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${API_WRITE_KEY}`
            }
        }
    );
}