const assert = require('chai').assert;
const Recipe = require('../../lib/models/recipes');

describe('Recipe Model', () => {

  it('validates with required fields', () => {
    const recipe = new Recipe({
      name: 'Peanut Butter Sandwich',
      instructions: 'Spread peanut butter on one slice of bread, and jelly on the other',
      ingredients: [
        { title: 'Bread', amount: 2 },
        { title: 'Peanut Butter', amount: 2, unit: 'tbsp' },
        { title: 'Jelly', amount: 2, unit: 'tbsp' }
      ]
    });

    recipe.validate();

  });

  it('validation fails without required fields', () => {
    const recipe = new Recipe();

    return recipe.validate()
      .then(
        () => { throw new Error('expected data validation error'); },
        ({ errors }) => {
          assert.ok(errors.title);
          assert.ok(errors.instructions);
        }
      );
  });

});