const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

const middlewares = require('./middlewares');
const db = require('./db');

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// TO INSERT JSON DATA INTO DB:

// fs.readFile('./hacker-data-2021.json', 'utf8', async (err, data) => {
//   if (!err) {
//     const hackers = JSON.parse(data);
//     try {
//       hackers.forEach(async (hacker) => {
//         const inserted = await db.query(
//           'insert into hackers (name, picture, company, email, phone) values ($1, $2, $3, $4, $5) returning *',
//           [
//             hacker.name,
//             hacker.picture,
//             hacker.company,
//             hacker.email,
//             hacker.phone,
//           ]
//         );
//         hacker.skills.forEach(async (skill) => {
//           await db.query(
//             'insert into skills (hacker_id, name, rating) values ($1, $2, $3) returning *',
//             [inserted.rows[0].id, skill.name, skill.rating]
//           );
//         });
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }
// });

app.get('/users', async (req, res, next) => {
  try {
    const results = await db.query('select * from hackers');
    const promises = results.rows.map(async (result) => {
      const skills = await db.query(
        'select name, rating from skills where hacker_id = $1',
        [result.id]
      );
      return {
        ...result,
        skills: skills.rows,
      };
    });

    Promise.all(promises).then((values) => {
      res.status(200).json({
        results: values.length,
        hackers: values,
      });
    });
  } catch (err) {
    next(err);
  }
});

app.get('/users/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const hacker = await db.query('select * from hackers where id = $1', [id]);
    const skills = await db.query(
      'select name, rating from skills where hacker_id = $1',
      [id]
    );
    const result = {
      ...hacker.rows[0],
      skills: skills.rows,
    };
    res.json(result);
  } catch (err) {
    next(err);
  }
});

const queryCreator = (id, data) => {
  const query = ['UPDATE hackers SET'];

  const set = [];
  const parameters = [];
  Object.keys(data).forEach(function (key, i) {
    set.push(key + ' = ($' + (i + 1) + ')');
    parameters.push(data[key]);
  });
  query.push(set.join(', '));
  query.push('WHERE id = ' + id);
  query.push('returning *');
  return {
    query: query.join(' '),
    parameters,
  };
};

app.put('/users/:id', async (req, res, next) => {
  const { id } = req.params;
  const { skills, ...rest } = req.body;
  try {
    let result = {};
    // update all non-skill attributes
    if (Object.keys(rest).length !== 0) {
      const { query, parameters } = queryCreator(id, rest);
      const updated = await db.query(query, parameters);
      result = {
        ...updated.rows[0],
      };
    } else {
      const hacker = await db.query('select * from hackers where id = $1', [
        id,
      ]);
      result = {
        ...hacker.rows[0],
      };
    }

    if (skills) {
      const existing_skills = await db.query(
        'select name from skills where hacker_id = $1',
        [id]
      );
      const existing_skills_array = existing_skills.rows.map(
        (skill) => skill.name
      );
      const promises = skills.map(async (skill) => {
        if (existing_skills_array.includes(skill.name)) {
          return await db.query(
            'UPDATE skills SET rating = $1 where hacker_id = $2 AND name = $3',
            [skill.rating, id, skill.name]
          );
        } else {
          return await db.query(
            'INSERT into skills (hacker_id, name, rating) values ($1, $2, $3)',
            [id, skill.name, skill.rating]
          );
        }
      });
      await Promise.all(promises);
    }

    const new_skills = await db.query(
      'SELECT name, rating from skills where hacker_id = $1',
      [id]
    );
    result = {
      ...result,
      skills: new_skills.rows,
    };
    res.json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.get('/skills', async (req, res, next) => {
  const { min_frequency, max_frequency } = req.query;
  const min = parseInt(min_frequency);
  const max = parseInt(max_frequency);

  try {
    const skills = await db.query(
      `SELECT name, COUNT(*) as frequency from skills GROUP BY name HAVING COUNT(*) >= ${min} and COUNT(*) <= ${max}`
    );
    res.json({
      skills: skills.rows,
    });
  } catch (err) {
    next(err);
  }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
