import React, { useState, useEffect } from 'react';
import { useSigner } from "wagmi";
import { NextPage } from "next";
import { useAsync } from "react-use";
import { connect, resultsToObjects } from "@tableland/sdk";
import { TextInput, Button } from "@mantine/core";

const Tableland: NextPage<{ cid: string }> = ({ cid }) => {
    const { data: signer } = useSigner();

    const [model, setModel] = useState({
        tableName: 'test',
        tableSchema: 'id int primary key, name text, address text',
        sql: "INSERT into test_80001_526  (id,name,address) values (2,'Dale W', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');"
    });

    function handleChange(key: string, value: object) {
        model[key] = value;
    }

    async function createTable() {
        console.log(`Going to create new table: ${model.tableName} with schema '${model.tableSchema}'`,);
        let connection = await connect({ network: "testnet", chain: "polygon-mumbai" });
        const table = await connection.create(model.tableSchema, model.tableName);
        console.log(`Created TL table ${table.name}`, table);
        console.log(`View transaction: https://mumbai.polygonscan.com/tx/${table.txnHash}}`); // TODO: don't hardcode to polygonscan url
    }

    async function writeToTable() {
        console.log(`Going to run sql write: ${model.sql}`);
        let connection = await connect({ network: "testnet", chain: "polygon-mumbai" });
        const write = await connection.write(model.sql);
        console.log(`Response from write: ${model.sql}:`, write);
        console.log(`View transaction: https://mumbai.polygonscan.com/tx/${write.hash}}`); // TODO: don't hardcode to polygonscan url
    }

    async function queryTable() {
        console.log(`Going to run sql query: ${model.sql}`);
        let connection = await connect({ network: "testnet", chain: "polygon-mumbai" });
        const queryResult = await connection.read(model.sql);
        console.log('queryResult:',queryResult);
        const entries = resultsToObjects(queryResult);
        console.log(`Response from query: ${model.sql}:`,entries);
    }

    async function logAllTables() {
        let connection = await connect({ network: "testnet", chain: "polygon-mumbai" });
        const tables = await connection.list();
        console.log(tables);
    }

    return (
        <div>
            <main>
                <h1>Tableland</h1>
                <hr/>
                <h2>Create table</h2>
                <p>(switch provider to chain.polygonMumbai in _app.tsx when using this)</p>
                <TextInput label="table name" value={model.value?.tableName} onChange={e => handleChange('tableName', e.target.value)} />
                <TextInput label="table schema" value={model.value?.tableSchema} onChange={e => handleChange('tableSchema', e.target.value)} />
                <pre>uuid text, name text, address text</pre>
                <pre>uuid text, cid text, title text, description text, filename text, authors text, references text, reviews text</pre>
                <Button color="red" onClick={createTable}>Create table</Button>
                <hr/>
                <h2>Query/Update table</h2>
                <TextInput value={model.value?.sql} onChange={e => handleChange('sql', e.target.value)} />
                <Button color="red" onClick={writeToTable}>Update table</Button>
                <Button color="red" onClick={queryTable}>Query table</Button>
                <pre>INSERT INTO author_80001_587 (uuid,name,address) values ('sdfsdfdsfsdfsd','Tester T','0x976EA74026E726554dB657fA54763abd0C3a0aa9');</pre>
                <pre>INSERT into songs_80001_547 (id,artist,title) values (0,'Beck', 'Loser');</pre>
                <pre>SELECT * from author_80001_587</pre>
                <pre>SELECT id, artist, title FROM songs_80001_547;</pre>
                <hr/>
                <Button color="blue" onClick={logAllTables}>logAllTables owned by this wallet</Button>
            </main>
        </div>
    );
};

export default Tableland;
