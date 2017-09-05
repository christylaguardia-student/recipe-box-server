const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  instructions: { // maybe this should be an array?
    type: String,
    required: true
  },
  servings: Number,
  time: Number,
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true,
        default: 1
      },
      unit: {
        type: String,
        required: false,
        enum: ['tsp', 'tbsp', 'fl oz', 'cup', 'pint', 'quart', 'gallon', 'lb', 'oz', 'in', 'can', 'dash', 'pinch', 'none'] // Object.keys(units)
      }
    }
  ]

});

// TODO: later if need for unit conversion
// const units = {
//   teaspoon: {
//     type: 'volume',
//     abbr: ['t', 'tsp.']
//     // conversion: { unit: 'tablespoon', factor: .333 }
//   },
//   tablespoon: {
//     type: 'volume',
//     abbr: ['T', 'tbl.', 'tbs.', 'tbsp.']
//   },
//   fluid-ounce: {
//     type: 'volume',
//     abbr: 'fl oz'
//   },

//   cup (also c)
//   pint (also p, pt, or fl pt - Specify Imperial or US)
//   quart (also q, qt, or fl qt - Specify Imperial or US)
//   gallon (also g or gal - Specify Imperial or US)
//   pound (also lb or #)
//   ounce (also oz)
//   inch (also in or ")
// };

module.exports = mongoose.model('Recipe', schema);
