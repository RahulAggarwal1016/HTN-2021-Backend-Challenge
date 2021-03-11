// insertData.js inserts json from "hacker-data-2021.json" into a local psql database
// to run the file type the command "npm run insert"

const fs = require('fs');
const db = require('./db');

fs.readFile('./hacker-data-2021.json', 'utf8', async (err, data) => {
  if (!err) {
    const hackers = JSON.parse(data); //parse json data
    try {
      hackers.forEach(async (hacker) => {
        // insert each hackers "non-skills" information into the hackers database
        const inserted = await db.query(
          'insert into hackers (name, picture, company, email, phone) values ($1, $2, $3, $4, $5) returning *',
          [
            hacker.name,
            hacker.picture,
            hacker.company,
            hacker.email,
            hacker.phone,
          ]
        );

        // insert each hackers "skills" into the skills database
        hacker.skills.forEach(async (skill) => {
          await db.query(
            'insert into skills (hacker_id, name, rating) values ($1, $2, $3) returning *',
            [inserted.rows[0].id, skill.name, skill.rating]
          );
        });
      });
      console.log('Data successfully added!');
    } catch (err) {
      console.error(err);
    }
  }
});
