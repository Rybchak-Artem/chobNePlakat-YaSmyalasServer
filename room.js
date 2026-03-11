import bcrypt from "bcrypt"
import dotenv from 'dotenv'
dotenv.config()
import pg from 'pg'
import { readFileSync, writeFileSync } from "fs";
const saltRounds = 10;
const myPlaintextPassword = process.argv[2] || 's0/\/\P4$$w0rD';

const { Pool } = pg;
const pool = new Pool({
   connectionString: `${process.env.DB_URL}`,
   ssl: {
      rejectUnauthorized: false
   }
});
console.log(process.env.DB_URL)
const initializeDatabase = async () => {
   console.log('Initializing dota database...');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users_test (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
   `;

   try {
      const client = await pool.connect();
      await pool.query(createTableQuery);
      console.log('The server is ready to go.');
   } catch (error) {
      console.error('Error initializing database:', error.message);
      console.error('Full error:', error);
      throw error;
   }
};
await initializeDatabase();

async function addEmail(name) {

    const query = `
        INSERT INTO users_test (
            email
            
        ) 
        VALUES ($1) 
        RETURNING *`;

   const values = [name];

   try {
      const res = await pool.query(query, values);
      console.log('user додано:', res.rows[0]);
   } catch (err) {
      console.error('Error:', err.message);
   }

}

addEmail('maks@pepsmail.com');



async function getAllUsers() {
    
    const res = await pool.query('SELECT * FROM users_test');
    
    console.table(res.rows)
    return res.rows
    
}

getAllUsers();

async function userExists(id) {
   const res = await pool.query('SELECT * FROM users_test WHERE id = $1', [id]);
   return res.rows.length > 0;
}


// let data = '';
// try {
    
//     data = data.trim(); 
// } catch(error) {
//     console.log(error.message);
// }

// if (!data) {
//     bcrypt.hash(myPlaintextPassword, saltRounds, function(err, data) {
//         if (err) {
//             console.error(err);
//         } else {
//             writeFileSync('password.txt', data, 'utf-8');
//             console.log('Password saved');
//         }
//     });
// } else {
//     bcrypt.compare(process.argv[4], data)
//         .then((result) => {
//             if (result) {
//                 console.log('Correct password');
//             } else {
//                 console.log('Incorrect password');
//             }
//         });
// }
