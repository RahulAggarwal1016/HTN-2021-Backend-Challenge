// controllers.js contains controller functions (each corresponds to a specific route as outlined in the backend challenge repo)

const db = require('./db');
const { queryCreator } = require('./helpers');

// controller for the route - GET localhost:5000/users/
exports.getUsers = async (req, res, next) => {
  try {
    // grab all hackers from db
    const hackers = await db.query('select * from hackers');

    // query each hacker's unique skills (unResolvedPromises is an array of promises)
    const unResolvedPromises = hackers.rows.map(async (hacker) => {
      const skills = await db.query(
        'select name, rating from skills where hacker_id = $1',
        [hacker.id]
      );
      return {
        ...hacker,
        skills: skills.rows,
      };
    });

    Promise.all(unResolvedPromises).then((values) => {
      res.status(200).json({
        results: values.length,
        hackers: values,
      });
    });
  } catch (err) {
    next(err);
  }
};

// controller for the route - GET localhost:5000/users/:id
exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    // grab specific hacker from db
    const hacker = await db.query('select * from hackers where id = $1', [id]);

    // grab hackers specific skills from db
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
};

// controller from the route - PUT localhost:5000/users/:id
exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { skills, ...rest } = req.body;
  try {
    let result = {};

    // if user wants to update a hacker's "non-skills" information
    if (Object.keys(rest).length) {
      const { query, parameters } = queryCreator(id, rest);
      const updated = await db.query(query, parameters);
      result = {
        ...updated.rows[0],
      };
    } else {
      // return the hacker from the db
      const hacker = await db.query('select * from hackers where id = $1', [
        id,
      ]);
      result = {
        ...hacker.rows[0],
      };
    }

    // if user wants to update a hacker's skills
    if (skills) {
      const existing_skills = await db.query(
        'select name from skills where hacker_id = $1',
        [id]
      );
      // turn existing_skills array full of objects into an array with just the name of each skill
      const existing_skills_array = existing_skills.rows.map(
        (skill) => skill.name
      );

      const promises = skills.map(async (skill) => {
        // if skill needs to be updated
        if (existing_skills_array.includes(skill.name)) {
          return await db.query(
            'UPDATE skills SET rating = $1 where hacker_id = $2 AND name = $3',
            [skill.rating, id, skill.name]
          );
        } else {
          // if skill needs to be added to db
          return await db.query(
            'INSERT into skills (hacker_id, name, rating) values ($1, $2, $3)',
            [id, skill.name, skill.rating]
          );
        }
      });
      await Promise.all(promises);
    }

    // fetch the users hackers (will either have new or updated skills at this point)
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
};

// controller for GET localhost:5000/skills/?min_frequency=#&max_frequency=#
exports.getSkills = async (req, res, next) => {
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
};
