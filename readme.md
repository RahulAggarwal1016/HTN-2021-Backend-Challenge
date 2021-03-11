# Hack the North 2021 Backend Challenge - Rahul Aggarwal

## Hi There!

I'm Rahul and this is my Hack the North 2021 Backend Challenge submission. I tried my best to stick the coding practices I outlined in my application and leave comments where applicable. Thus, I hope you enjoy looking through the submission.

If you have any questions about my submission feel free to email me at  [rahulaggarwal1016@gmail.com](mailto:rahulaggarwal1016@gmail.com).


## Challenge
You've just created a new hackathon series and it's wildly successful! However, the number of applications is quickly becoming too much for your Excel spreadsheet. The goal is to develop a basic GraphQL or REST API server to store and work with your hackathon participants' data. Please remember to document your API within your repository's README!

### Data
We have 1,000+ fake user profiles at [https://gist.github.com/Advait-M/e45603da554150067b5c4551a2bf4419](https://gist.github.com/Advait-M/e45603da554150067b5c4551a2bf4419). The JSON schema is:

```json
{
  "name": <string>,
  "picture": <string>,
  "company": <string>,
  "email": <string>,
  "phone": <string>,
  "skills": [
    {
      "name": <string>,
      "rating": <int>
    }
  ]
}
```

### Database
You can either download the user data from the link above and use the local JSON file, or make an HTTP request when running the program that inserts the data to a database.

For simplicity, we recommend using SQLite for the database as it is the easiest to setup and likely already exists on your computer. However, if you are more familiar with other databases, e.g. PostgreSQL, feel free to use them!

We are particularly interested in seeing how you define your database table(s) and partition the data appropriately.

### Frameworks and Languages

You may use any language with any framework of your choice for creating a backend server capable for handling requests e.g. Python/Flask, Node/Express, etc. We have provided boilerplate code for Express with Node.js for GraphQL or REST APIs (see Docker files below).

Please note that **using a particular language/framework will not penalize you in any way** - feel free to use whichever technologies you are most comfortable with or want to learn more about! Similarly, **we will not penalize you for choosing to use GraphQL or REST API principles** - both are completely acceptable!

Your backend server should serve as a quick interface to the database. The key requirement is to allow us to see the user data in a JSON format, through a GraphQL or REST API.

#### Potential Boilerplate

Below, we have provided Dockerfiles and associated project files for different options. Please note, **you do not have to use any of these files** - feel free to use your own setup! Additionally, please do not consider these to be exemplary methods of structuring your project - they are simply provided to help you get up and running as quickly as possible. You may modify project structure in any way you wish, including adding any libraries/frameworks.

1. [Express app](https://drive.google.com/file/d/1QNcz-ZIkdyrYDp-hpSQoRi9xqz4Tfner/view?usp=sharing) (Node.js) for GraphQL (SQLite as a database)
2. [Express app](https://drive.google.com/file/d/1IQKmQ4BGQc6kV3sAmIfoqE0npsATZt5H/view?usp=sharing) (Node.js) for REST (SQLite as a database)
3. [Flask app](https://drive.google.com/file/d/1KqfIBxqPElBsAK5-FqcKT0k_OZnjnI4Y/view?usp=sharing) (Python) for GraphQL (Flask-GraphQL with Graphene, SQLite as a database)
4. [Flask app](https://drive.google.com/file/d/1tZnKCWq0D7NdOPqqQLtwuGTATwV4meMd/view?usp=sharing) (Python) for REST (SQLite as a database)

### API

At the minimum, this is what it should have:

#### All Users Endpoint
This endpoint should return a list of all user data from the database in a JSON format.

_Example GraphQL (feel free to change format):_
```
query {
  users {
    name
    email
    skills {
      name
      rating
    }
    ...
  }
}
```

_Example REST:_

`GET localhost:5000/users/` or similar

#### User Information Endpoint
This endpoint should return the user data for a specific user. Depending on your database schema, it is up to you to decide what identifies a single user and design an endpoint that will give the full details about that user.

_Example GraphQL (feel free to change format):_
```
query {
  user(INSERT_IDENTIFIER: FOO) {
    name
    email
    skills {
      name
      rating
    }
    ...
  }
}
```

_Example REST:_

`GET localhost:5000/users/123` or similar

#### Updating User Data Endpoint
This endpoint should allow you to update a given user's data by accepting data in a JSON format and return the updated user data as the response. The important design consideration for this endpoint is that it must support partial updating. This will either be a new mutation (GraphQL) or a PUT only method to the same URL as the user information endpoint above (REST).

_Example GraphQL (feel free to change format):_
```
query {
  updateUser(INSERT_IDENTIFIER: FOO, data: {phone: "+1 (555) 123 4567"}) {
    name
    phone
    ...
  }
}
```

_Example REST:_

Submitting the following JSON:

```json
  {
    "phone": "+1 (555) 123 4567"
  }
```

to the given URL: `PUT localhost:5000/users/123` or similar

should update their phone number to `+1 (555) 123 4567` and return the full user data with the new phone number.

Note: If a user has new skills, these skills should be added to the database. Any existing skills should have their ratings updated.

#### Skills Endpoints
These endpoint should show a list of skills and aggregate info about them. Note that in the context of your hackathon, users do not gain/lose skills very often.

Try to implement the following (in SQL or with an ORM):
- Number of users with each skill (frequency)
- Query parameter filtering - minimum/maximum frequency

_Example GraphQL (feel free to change format):_
```
query {
  skills(data: {min_frequency: 5, max_frequency: 10}) {
    name
    frequency
  }
}
```

_Example REST:_

`GET localhost:5000/skills/?min_frequency=5&max_frequency=10` or similar

### Notes
- You may have two separate applications if you'd like.
  - You can include a script to create the appropriate database tables and insert the default data.
  - The second application can assume that the database already exists and launch the app to start listening for requests.
- You are free to use any existing library or dependency for the language of your choice (don't forget to document).
- You can reference any online resources or documentation, however, please do not plagiarize.

If you've implemented the basic requirements quickly, feel free to make improvements as you see fit, especially if the improvements you implement are part of a larger vision for your application as a product for hackathon attendees. You may also outline any improvements you'd make in your README.

__Please submit your entry by emailing it as a link to a GitHub repository (make sure it is accessible to us). Remember to provide documentation in the README! If you are not able to complete all components of the challenge - don't worry & please submit your challenge anyhow, we'd love to take a look! Good luck! :)__