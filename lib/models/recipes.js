const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
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
    ],
    userId : {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Recipe', schema);
