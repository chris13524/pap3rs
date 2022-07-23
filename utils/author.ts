import { queryTable, writeToTable } from "../utils/tableland";
import { v4 as uuidv4 } from 'uuid';

const tableName: string = 'author_80001_587';

export type Author = {
    /**
     * Author's unique uuid
     */
     uuid: string,

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
    return await queryTable(`SELECT * from ${tableName};`); // TODO: squiqqly alert!
}

export async function addAuthor(author:Author): Promise<[Author]> {
    author.uuid = uuidv4();
    console.log(`Going to add Author: `,author);
    return await writeToTable(`INSERT INTO ${tableName} (uuid,name,address) values ('${author.uuid}','${author.name}','${author.address}');`); // TODO: squiqqly alert!
}