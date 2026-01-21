const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt for input
function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:2213@localhost:5432/resumeseeker',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function insertData() {
    const client = await pool.connect();

        try {
            console.log('Connected to PostgreSQL database');
    
            // Display menu
            console.log('\nWhat would you like to insert?');
            console.log('1. Add a new user');
            console.log('2. Add a new resume');
            console.log('3. Add a new job match');
            console.log('4. Add a new skill gap analysis');
        } catch (err) {
            console.error('Error inserting data:', err);
        } finally {
            client.release();
            rl.close();
        }
    }