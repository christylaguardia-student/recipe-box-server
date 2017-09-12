const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes');

router
  .get('/', (req, res, next) => {
    Recipe.find()
      .select('_id title')
      .lean()
      .then(recipes => res.send(recipes))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Recipe.findById(req.params.id)
      .then(recipe => {
        if (!recipe) res.status(404).send(`Cannot GET recipe with ID ${req.params.id}`);
        else res.send(recipe);
      })
      .catch(next);
  })

  .post('/', (req, res, next) => {
    const recipe = new Recipe(req.body);

    recipe.save()
      .then(saved => res.send(saved))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Recipe.findByIdAndUpdate(req.params.id, req.body, {new:true})
      .then(recipe => res.send(recipe))
      .catch(next);
  })

  .delete('/:id', (req, res) => {
    Recipe.findByIdAndRemove(req.params.id)
      .then(response => res.send({removed: !!response}));
  });

module.exports = router;
