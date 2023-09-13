const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());
const database = null;

const instalizeDbAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost/:3000");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

instalizeDbAndServer();

const convertMovieObjectToresponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

const convertDorectorObjectToresponseObject = (dbObject) => {
  return {
    directorId: director_id,
    directorName: director_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovieQuary = `
    SELECT
    movie_name
    FROM 
    movie;`;
  const movieNames = await database.all(getMovieQuary);
  response.send(
    moviesArray.map((eachMovie) => ({ moviename: eachMovie.movie_name }))
  );
});

app.get("movies/:movieId/", async (request, response) => {
  const getMovieQuary = `
    SELECT 
    *
    FROM
    movie
    WHERE 
    movie_id = ${movieId}`;
  const movie = await database.get(getMovieQuary);
  response.send(convertMovieObjectToresponseObject(movie));
});
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovie = `
    INSERT INTO
    movie(director_id,movie_name,lead_actor)
    VALUES (${directorId},${movieName},${leadActor});`;
  await database.run(postMovie);
  response.send("Movie Successfully Added");
});

app.put("/movies/:moviesId", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updateQuary = `
    UPDATE 
    movie
    SET (director_id : ${directorId},
        movie_name :${movieName},
        lead_actor : ${leadActor})
    WHERE 
    movie_id = ${movieId};`;
  await database.run(updateQuary);
  response.send("Movie Details Updated");
});

app.delete("/movies/:moviesId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovie = `
    DELETE FROM
    movie
    WHERE 
    movie_id = ${movieId};
    `;
  await database.run(deleteMovie);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const getDirectorQuary = `
    SELECT
    *
    FROME
    director; 
    `;
  const directorArray = await database.all(getDirectorQuary);
  response.send(
    directorArray.map((eachDirector) =>
      convertDorectorObjectToresponseObject(eachDirector)
    )
  );
});

app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMovies = `
    SELECT 
    movie_name
    FROME
    movie
    WHERE 
    director_id = ${directorId};`;
  const movieArray = await database.all(getDirectorMovies);
  response.send(
    movieArray.map((eachmovie) => ({ movieName: eachmovie.movie_name }))
  );
});
module.exports = app;
