import { createBucketClient } from "@cosmicjs/sdk";

export const cosmic = createBucketClient({
    bucketSlug: "project-bop-production",
    readKey: "vfxvljbNYWkluUCXn5Q0Obgr868PJBWXq2XHLpMn5SUHU5gz5c",
    writeKey: "HC6pQfEKvvXoC9MPxDeXwBc911oEqgh19OzV0WY2jppinuEwkP"
});

export async function cosmicFind(arg) {
    const response = await cosmic.objects.find(arg);

    return response.objects
        .map(raw => ({
            ...raw,
            ...raw.metadata,
            metadata: undefined
        }));
}

export function dateFormat(dateStr) {
    const date = new Date(dateStr);

    const options = { month: "short", day: "numeric", year: "numeric" };
    const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);

    let month = parts.find(p => p.type === "month").value;
    const day = parts.find(p => p.type === "day").value;
    const year = parts.find(p => p.type === "year").value;

    const abbreviatedMonths = ["Jan", "Feb", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (abbreviatedMonths.includes(month)) month += ".";

    return `${month} ${day}, ${year}`;
}