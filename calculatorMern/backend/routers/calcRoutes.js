const express = require('express');
const router=express.Router()
const Calculation=require('../models/calculatorModels')


let history = [];


router.post('/api/calculate', (req, res) => {
    console.log("hi")
     const { expression } = req.body;
     try {
       const result = eval(expression);
       const calculation = new Calculation({ expression, result });
       calculation.save();
       res.status(200).json({ result });
     } catch (error) {
       console.log('Error:', error);
       res.status(500).json({ error: 'Invalid expression' });
     }
   });
router.get('/api/history',async(req,res)=>{

    try {
        const calculations = await Calculation.find({});
        res.status(200).json({ calculations });
      } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
      }
    })


    // // Delete calculation from history
    // router.delete('/api/calculation', (req, res) => {
    //   calculation = null;
    //   res.sendStatus(204);
    // });
    // DELETE /calculations/:id - Delete a calculation

router.delete('/api/:id', async (req, res) => {
  try {
    const calculation = await Calculation.findByIdAndDelete(req.params.id);
    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }
    res.json({ message: 'Calculation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/api/calculations/:id', async (req, res) => {
  const { id } = req.params;
  const { name, expression } = req.body;

  try {
    // Find the calculation by ID
    const calculation = await Calculation.findById(id);

    if (!calculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    // Update the name and expression
    calculation.name = name;
    calculation.expression = expression;

    // Save the updated calculation
    await calculation.save();

    res.json(calculation);
  } catch (error) {
    console.error('Error updating calculation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports=router
