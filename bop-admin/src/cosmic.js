import { createBucketClient } from "@cosmicjs/sdk";

export const cosmic = createBucketClient({
    bucketSlug: "project-bop-production",
    readKey: "vfxvljbNYWkluUCXn5Q0Obgr868PJBWXq2XHLpMn5SUHU5gz5c",
    writeKey: "HC6pQfEKvvXoC9MPxDeXwBc911oEqgh19OzV0WY2jppinuEwkP"
});