import { Service, Web3Storage } from "web3.storage";

export const web3Storage = new Web3Storage({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweERiMUE0ZDk2MkI4NmE5RTBFQkZkNDEwODg5NzQ2MzU3ZEFjMEI2MzEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc3NDYxOTgzMzEsIm5hbWUiOiJwYXAzcnMifQ.4B2ZNk0N-lnux76blYlWGxvVG3ZN4_McwzhSX9t08yU"
} as Service);

export async function storeJson<T>(json: T) {
    return await web3Storage.put([new File([JSON.stringify(json)], "data.json", { type: "application/json" })]);
}

export async function retrieveJson<T>(cid: string): Promise<T> {
    const res = await web3Storage.get(cid);
    if (!res) throw new Error("res is falsy");

    const files = await res.files();
    const data = await files[0].text();

    return JSON.parse(data);
}
