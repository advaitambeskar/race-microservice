const { Pool, Client } = require('pg');
var connectionString = "postgres://postgres:postgres@localhost:5432/racenergy";
const client = new Client({
        connectionString: connectionString
});


async function createDB() {
        /*
                CREATE TABLE public.student
                (
                        "ID" text COLLATE pg_catalog."default" NOT NULL,
                        "NAME" text COLLATE pg_catalog."default" NOT NULL,
                        "GENDER" text COLLATE pg_catalog."default" NOT NULL,
                        "HEIGHT" integer NOT NULL,
                        "WEIGHT" integer NOT NULL,
                        "NATIONALITY" text COLLATE pg_catalog."default" NOT NULL,
                        "COURSE" text COLLATE pg_catalog."default" NOT NULL,
                        "SCORE" real NOT NULL,
                        "AILMENTS" text COLLATE pg_catalog."default" NOT NULL,
                        "KEYID" integer NOT NULL,
                        "YOB" integer NOT NULL,
                        CONSTRAINT "KEYID" PRIMARY KEY ("KEYID")
                ) 
         */

        const pool = new Pool({
                user: "postgres",
                host: "localhost",
                database: "racenergy",
                password: "postgres",
                port: "5432"
        });
        pool.connect();
        pool.query(
                `
                CREATE TABLE public.student
                (
                        "KEYID" SERIAL PRIMARY KEY NOT NULL,
                        "AUTHOR" text NOT NULL,
                        "ID" text NOT NULL,
                        "NAME" text NOT NULL,
                        "GENDER" text,
                        "HEIGHT" INTEGER,
                        "WEIGHT" INTEGER,
                        "NATIONALITY" text,
                        "COURSE" text,
                        "SCORE" real,
                        "AILMENTS" text,
                        "YOB" INTEGER
                ) 
                `,
                (err, res) => {
                        console.log(err, res);
                        pool.end();
                }
        )
        
}

createDB();

module.exports = client;