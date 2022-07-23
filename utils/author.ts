import { connect, resultsToObjects } from "@tableland/sdk";

const tableName: string = 'temp1_80001_541';

/*
TODO: shift this into tableland service
*/
async function queryTable(sql: string) {
    console.log(`Going to run sql query: ${sql}`);
    let connection = await connect({ network: "testnet", chain: "polygon-mumbai" });
    const queryResult = await connection.read(sql);
    console.log('queryResult:', queryResult);
    const entries = resultsToObjects(queryResult);
    console.log(`Response from query => resultsToObjects: ${sql}:`, entries);
    let allAuthors: Author[] = entries;
    return allAuthors
}

export type Author = {
    /**
     * Author's name e.g. Vitalik Buterin
     */
    name: string,

    /**
     * Author's wallet address e.g. 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
     */
    address: string,
};

export async function allAuthors(): Promise<Author[]> {
    return await queryTable(`SELECT * from ${tableName};`);
}
