let mongoose = require('mongoose');

const CalculationSchema = new mongoose.Schema({

    name: String,
    expression: String,
    result: Number,
    
  });
  
  module.exports= mongoose.model('Calculation', CalculationSchema);