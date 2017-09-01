const assert = require('chai').assert;
const db = require('./_db');
const request = require('./_request');

describe('Recipe API', () => {

  beforeEach(db.drop);

  function save(recipe) {
    return request
      .post('/api/recipes')
      .send(recipe)
      .then(res => res.body);
  }

  it('POST a recipe', () => {
    let recipe = {
      title: 'Cereal',
      instructions: 'Pour cereal in bowl, then pour in milk.',
      ingredients: [
        { name: 'Lucky Charms Cereal', amount: 1, unit: 'cup' },
        { name: 'Milk', amount: 1, unit: 'cup' }
      ]
    };

    return save(recipe)
      .then(saved => {
        assert.ok(saved._id);
        assert.equal(saved.name, recipe.name);
        assert.equal(saved.instructions, recipe.instructions);
        assert.equal(saved.ingredients.length, 2); // isn't there another way to test this?
      });

  });

  it('GETs all recipes', () => {
    const recipes = [
      {
        title: 'Omlette',
        instructions: 'Mix eggs and make into an omlette.',
        ingredients: [
          { name: 'Eggs', amount: 3 },
          { name: 'Cheese', amount: .25, unit: 'cup' }
        ]
      },{
        title: 'Bacon',
        instructions: 'Just cook and eat',
        ingredients: [
          { name: 'Bacon', amount: 1, unit: 'lb' }
        ]
      }
    ];

    return Promise.all(recipes.map(save))
      .then(request.get('/api/recipes'))
      .then(saved => {
        assert.equal(saved.length, 2);
      });

  });

  it('GETs a recipe by id', () => {
    let recipe = {
      title: 'Ham Omlette',
      instructions: 'Mix eggs and make into an omlette.',
      ingredients: [
        { name: 'Eggs', amount: 3 },
        { name: 'Cheese', amount: .25, unit: 'cup' },
        { name: 'Ham', amount: .5, unit: 'cup' }
      ]
    };

    return save(recipe)
      .then(saved => recipe = saved)
      .then(() => request.get(`/api/recipes/${recipe._id}`))
      .then(found => {
        assert.deepEqual(found.body, recipe);
      });

  });

  it('DELETEs a recipe', () => {
    const recipe = {
      title: 'Omlette',
      instructions: 'Mix eggs and make into an omlette.',
      ingredients: [
        { name: 'Eggs', amount: 3 },
        { name: 'Cheese', amount: .25, unit: 'cup' }
      ]
    };

    return save(recipe)
      .then(saved => request.delete(`/api/recipes/${saved._id}`))
      .then(response => {
        assert.deepEqual(response.body, { removed: true });
      });

  });

  it('PATCH updates a recipe', () => {
    let recipe = {
      title: 'Cake',
      instructions: 'Mix stuff together and bake',
      ingredients: [
        { name: 'Eggs', amount: 2 },
        { name: 'Flour', amount: 2.25, unit: 'cup' },
        { name: 'Sugar', amount: .75, unit: 'cup' },
        { name: 'Baking Powder', amount: 1, unit: 'tsp' },
        { name: 'Vanilla', amount: 2, unit: 'tbsp' }
      ]
    };

    const update = {
      title: 'I think it\'l be a cake',
      instructions: 'Mix all the stuff together and bake'
    };

    return save(recipe)
      .then(saved => recipe = saved)
      .then(() => request.patch(`/api/recipes/${recipe._id}`).send(update))
      .then(res => {
        assert.deepEqual(res.body.title, update.title);
      });
  });


});