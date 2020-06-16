const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({error: 'Repository id is not valid.'});
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < -1){
    return response.status(404).json({error: 'Repository not found.'});
  }

  return next();
}

app.use('/repositories/:id', validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories ? repositories : []);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { url, title, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const likes = repositories.find(repository => repository.id === id).likes;

  const repositoryToUpdate = {
    id,
    url,
    title,
    techs,
    likes
  };

  repositories[repositoryIndex] = repositoryToUpdate;

  return response.json(repositoryToUpdate);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const repository = repositories.find(repository => repository.id === id);

  const { likes } = repository;

  let updatedLikes = likes + 1;

  repositories[repositoryIndex] = {...repository, likes: updatedLikes};

  return response.json({likes: repositories[repositoryIndex].likes});
});

module.exports = app;
