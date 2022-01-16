const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
 text: {
  type: String,
  required: true
 },
 completed: {
  type: Boolean
 }
},
{ timestamps: true });

module.exports = mongoose.model('Todos', todoSchema);