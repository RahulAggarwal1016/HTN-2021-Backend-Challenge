# Hack the North 2021 Backend Challenge - Rahul Aggarwal

## Hi There!

I'm Rahul and this is my Hack the North 2021 Backend Challenge submission. I tried my best to leave comments throughout and follow the coding practices outlined in my application. I have created this README to serve as the official documentation for this API.

If you have any questions about my submission feel free to email me at  [rahulaggarwal1016@gmail.com](mailto:rahulaggarwal1016@gmail.com).

## Getting Started with the API

The following steps must be completed in order to get started with this API.

1. Git Clone the Project using `git clone url`

2. Open the project in the code editor of your choice (i.e VsCode) and cd into the root main directory

3. Install the project's dependencies (listed more indepth below) by running `npm install`. This command will require that [node.js](https://nodejs.org/en/) be installed.

4. In order to query the data designed for this API, we will need to insert the contents of `hacker-data-2021.json` into a local database. For this project, I have chosen to use Postgres. To setup PSQL please follow the official documentation which can be viewed here: https://www.postgresql.org/.

5. After connecting to a local instance of a PSQL database, we need to create tables that must follow a specific structure. For now, run the sql commands outlined in `db.sql` (ensure the hackers table is created first). More information regarding these commands and the choice of data types is listed below.

6. Create a `.env` file to hold the project's enviornmental variables as follows

```
PORT=5000
PGHOST=localhost
PGUSER=
PGDATABASE=
PGPASSWORD=
PGPORT=
```

You can choose whichever port you would like to run the project on. As for the postgres credentials, you must fill those out in accordance with your local PSQL database. The `new Pool()` function within `db.js` will automatically sense thsese variables and connect to your database.

6. Run the `npm run insert` to execute the insertData.js file which will fetch the data from our local json file and insert it into our database. Once the message `Data successfully added!` has been logged to the terminal you can stop the quit the file execution.

7. Run `npm run dev` to start the server and begin making requests.

## Routes

The routes you can access as outlined in the challenge instructions are as follows

`GET localhost:5000/users/` - to retrieve all users

`GET localhost:5000/users/:id` - to grab information about a specific user

`PUT localhost:5000/users/:id` - to update a user's information

`GET localhost:5000/skills/?min_frequency=#&max_frequency=#` - to retrieve information about the frequency of specific skills.

## Tables

Previously I instructed you to copy and paste my `CREATE TABLE` commands. Here I will explain my reasoning for why I chose to structure them as I did.

The first table created is meant for hackers (exluding their skills)

```
CREATE TABLE hackers (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    picture TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
);
```

The columns and types match those defined in the challenge instructions however note that the `VARCHAR(50)` type was used for name and `TEXT` for the other string fields. When bringing this API to production, VARCHAR's may be better suited for string fields that should expect a cap on their character count. For simplicitly, I used the type `TEXT` for the majority of my fields.

Additionally, I added an `id` proprty of type `BIGSERIAL PRIMARY KEY` to ensure that I had a unique identifier for each user.

The second table is designed to contain user's skills.

```
CREATE TABLE skills (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    hacker_id BIGINT NOT NULL REFERENCES hackers(id),
    name VARCHAR(50) NOT NULL,
    rating INT NOT NULL
);
```

I added a foreign key `hacker_id` to map each skill to a specifc user (every skill's `hacker_id` corresponds to a user's unique `id`). Similar to the hackers table, I laos added an `id` to each skill.

## Dependencies

The following are the dependencies used in the development of this API

```
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "helmet": "^4.4.1",
    "morgan": "^1.10.0",
    "pg": "^8.5.1"
  },
 ```

`Cors` - to control which urls can access this api, for now any url will have access

`Dotenv` - to allow for the use of private enviornment variables within the application

`Express` - to create a server to serve as the base of the API

`Helmet` - to secure set various varius Express and HTTP headers

`Morgan` - to log requests while in development

`PG` - to access postgres with node.js

## Notable Project Files

### Index.js

The API's entry point and the file where the "app" is setup to begin listening for requests.

### App.js

The application's routes are defined in this file. Additionally, all middlewares that have been created as well as imported from online are configured.

### Middlewares.js

Contains the following custom middleware functions

`notFound` - Put at the end of all route declarations. If the user hits an undefined route, this function will throw an error and pass it along to the error catching function defined below.

`errorHandler` - Any errors that arise in any of the routes are passed along to this middleware function which packages the error message and sends it back to the user via a json response.

### Controllers.js

Contains each route-specific controller. The logic for each route was put into a seperate file in order to enhance code organization and readibility.

## Future Improvements

Given that this is a development version of the API, there are specific aspects I would change and improve upon when moving to production.

1. Add data schema validation via a package like `Joi`
2. Modify cors so that only verified and trusted url's can access the API
3. Create more helper functions to reduce repetition of code

### Code Optimization

One of the best ways to optimize the performance an API is to reduce the number of database queries made upon each request.

In light of this, I would like to acknowledge that the way I structured my tables and database may not have been the most performant. Having two tables to represent a user meant that I had to make twice as many database calls per request (to grab both the skills and non-skills information). This caused some of the route logic to be unnecssiarly complex and complicated (i.e the user update route).

This efficiency of this API could also be improved by for example, excluding the query of each 1000+ user's skills when hitting the `GET localhost:5000/users/` route.  Instead, if somebody wanted to find out more information regarding a specific user's skills they could hit the `GET localhost:5000/users/:id` route.

__Phew, this was a long README. If you read all the way to the end thank you very very much, it means a lot to me considering the time and effort I spent on this challenge submission. I had a ton of fun making this API and learned a lot along the way.__