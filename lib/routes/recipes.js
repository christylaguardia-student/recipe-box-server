const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipes');

router
  .get('/', (req, res, next) => {
    Recipes.find({ userId: req.user.id })
      .then(recipes => res.send(recipes))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Recipes.findOne(
      { userId: req.user.id },
      { _id: req.params.id}
    )
      .then(recipe => {
        if (!recipe) res.status(404).send(`Cannot GET recipe with ID ${req.params.id}`);
        else res.send(recipe);
      })
      .catch(next);
  })

  .post('/', (req, res, next) => {
    req.body.userId = req.user.id;
    const recipe = new Recipes(req.body);
    
    recipe.save()
      .then(saved => res.send(saved))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Recipes.findOneAndUpdate(
      { userId: req.user.id },
      { _id: req.params.id },
      { $set: req.body },
      { new:true }
    )
      .then(recipe => res.send(recipe))
      .catch(next);
  })

  .delete('/:id', (req, res) => {
    Recipes.remove(
      { userId: req.user.id },
      { _id: req.params.id }
    )
      .then(response => res.send({removed: !!response}));
  });

module.exports = router;
