import { connect, resultsToObjects } from "@tableland/sdk";

export async function queryTable(sql: string) {
    console.log(`Going to run (read) sql query: ${sql}`);
    let connection = await connect({ network: "testnet", chain: "polygon-mumbai" });
    const queryResult = await connection.read(sql);
    console.log('queryResult:', queryResult);
    const entries = resultsToObjects(queryResult);
    console.log(`Response from query => resultsToObjects: ${sql}:`, entries);
    return entries;
}
