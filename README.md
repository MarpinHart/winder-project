# Winder
A wine recommendation app for wine lovers.

We built this application as a final project for our fullstack web development bootcamp. The idea is to recommend a general kind of wine (e.g. merlot) based on the food that the user would like to pair it with. Apart from that the user gets more specific wine recommendations with a description and the possibility to order it online.

Users can sign up and log in, search for wine recommendations, save specific wines to their profile (and delete them) and add a rating to them.

## Getting Started
- Clone or fork this repository
- In the command line for the project folder

```sh
$ npm init
$ npm install
```
- create a .env file with the following properties:
PORT = "num" // for local development
MONGODB_URI = // URI for connection to a MongoDB database

use the following command lines to run the server locally:
```sh
$ npm run dev:server
```
and to run the client locally:
```sh
$ npm run dev:client
```

## Stack
- MERN boilerplate
- Mongo DB and Mongoose for database and database operations
- Reactstrap for styling
- spoonacular API for food-wine pairing and wine recommendations
- AOS library for animations on scrolling

## Contributions
Are always welcome please submit a well commented pull request with changes or challenges.

## Heroku
The application can be found on Heroku under https://winderapp.herokuapp.com/

<img src='/screenshot.png'>