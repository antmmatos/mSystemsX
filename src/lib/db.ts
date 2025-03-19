import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    ssl: process.env.NODE_ENV === "production" ? {} : undefined,
    typeCast: (field, useDefaultTypeCasting) => {
        if (field.type === "BIT" && field.length === 1) {
            const buffer = field.buffer();
            return buffer ? buffer[0] === 1 : null;
        }
        return useDefaultTypeCasting();
    },
});

export const DataStorage = {
    SingleRecord: async (
        sql: string,
        parameters: Array<string | number | string[]>
    ) => {
        try {
            const [row] = (await pool.query(
                sql,
                parameters
            )) as RowDataPacket[];
            return row?.[0];
        } catch (error: any) {
            console.error("Erro na query SQL:", sql);
            console.error("Parâmetros:", parameters);
            console.error("Erro:", error);
            throw new Error(`Erro na base de dados: ${error?.message}`);
        }
    },

    ScalarRecord: async (
        sql: string,
        parameters: Array<string | number | string[]>,
        column: string
    ) => {
        try {
            const [row] = (await pool.query(
                sql,
                parameters
            )) as RowDataPacket[];
            return row?.[0]?.[column];
        } catch (error: any) {
            console.error("Erro na query SQL:", sql);
            console.error("Parâmetros:", parameters);
            console.error("Erro:", error);
            throw new Error(`Erro na base de dados: ${error?.message}`);
        }
    },

    QueryRecord: async (
        sql: string,
        parameters: Array<string | number | string[]>
    ) => {
        try {
            const [row] = (await pool.query(
                sql,
                parameters
            )) as RowDataPacket[];
            return row;
        } catch (error: any) {
            console.error("Erro na query SQL:", sql);
            console.error("Parâmetros:", parameters);
            console.error("Erro:", error);
            throw new Error(`Erro no banco de dados: ${error?.message}`);
        }
    },
};
