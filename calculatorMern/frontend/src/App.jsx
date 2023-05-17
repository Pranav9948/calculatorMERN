
import React, { useState, useEffect } from 'react';
import axios from "axios";

const Calculator = () => {
  const [display, setDisplay] = useState('');
  const [history, setHistory] = useState([]);
const [editName, setEditName] = useState('');

  const [editingCalculationId, setEditingCalculationId] = useState(null);
  const [editExpression, setEditExpression] = useState('');
  const buttonColors = 'bg-gray-200 hover:bg-gray-300';
  const operatorColors = 'bg-gray-400 hover:bg-gray-500';

  const addToDisplay = (value) => {
    setDisplay((prevDisplay) => prevDisplay + value);
  };

  const calculateResult = async () => {
    try {
      console.log("object");
      const response = await axios.post('/api/calculate', { expression: display });
      const data = response.data;
      console.log(response.data)
      setDisplay(String(data.result));
      fetchHistory();
    } catch (error) {
      console.log('Error:', error);
      setDisplay('Error');
    }
  };


 // Handle delete button click
 const handleDelete = async (id) => {
  try {
    await axios.delete(`/api/${id}`);
    fetchCalculationHistory(); // Refresh the calculation history after deletion
  } catch (error) {
    console.error('Error deleting calculation:', error);
  }
};




const handleEdit = (calculationId, name, expression) => {
  setEditingCalculationId(calculationId);
  setEditName(name);
  setEditExpression(expression);
};

const handleSave = async (calculationId) => {
  try {
    const updatedCalculation = {
      name: editName,
      expression: editExpression
    };

    // Send a PUT request to update the calculation
    await axios.put(`/api/calculations/${calculationId}`, updatedCalculation);

    // Reset the editing state and fetch the updated calculation history
    setEditingCalculationId(null);
    setEditName('');
    setEditExpression('');
    fetchCalculationHistory();
  } catch (error) {
    console.error('Error updating calculation:', error);
  }
};

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history');
      const data = response.data;
      setHistory(data.calculations);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [handleDelete]);


  const resetDisplay=()=>{
    setDisplay('')
  }
  return (
    <>
    <div className="w-64 bg-gray-900 p-4 rounded-lg shadow-lg">
      <div className="text-white text-right text-2xl mb-4">{display || '0'}</div>

      <div className="grid grid-cols-4 gap-2">
        <button className="col-span-2 p-2 w-40  text-black bg-red-500 hover:bg-red-600 rounded" onClick={resetDisplay}>
          C
        </button>
        <div className={`${buttonColors} p-2 text-black rounded invisible `} onClick={() => addToDisplay('7')}>
          7
        </div>
        <button className={`${operatorColors} p-2 text-black rounded`} onClick={() => addToDisplay('/')}>
          ÷
        </button>

        <button className={`${buttonColors} p-2 text-black rounded`} onClick={() => addToDisplay('8')}>
          8
        </button>
        <button className={`${buttonColors} p-2 text-black rounded`} onClick={() => addToDisplay('9')}>
          9
        </button>

        <button className={`${buttonColors} p-2 text-black rounded`} onClick={() => addToDisplay('4')}>
          4
        </button>

        <button className={`${operatorColors} p-2 text-black rounded`} onClick={() => addToDisplay('*')}>
          ×
        </button>

        
        <button className={`${buttonColors} p-2 text-black rounded`} onClick={() => addToDisplay('5')}>
          5
        </button>
        <button className={`${buttonColors} p-2 text-black rounded`} onClick={() => addToDisplay('6')}>
          6
        </button>
        

        <div className={`${buttonColors} p-2 text-black rounded text-center`} onClick={() => addToDisplay('7')}>
          7
        </div>


        <button className={`${operatorColors} p-2 text-black rounded`} onClick={() => addToDisplay('-')}>
          -
        </button>

     
        <button className={`${buttonColors} p-2 text-black rounded`} onClick={() => addToDisplay('2')}>
          2
        </button>
        <button className={`${buttonColors} p-2 text-black rounded`} onClick={() => addToDisplay('3')}>
          3
        </button>
        <button className={`${buttonColors} p-2 text-black rounded`} onClick={() => addToDisplay('1')}>
          1
        </button>
        <button className={`${operatorColors} p-2 text-black rounded`} onClick={() => addToDisplay('+')}>
          +
        </button>
      
        <button className="col-span-2 p-2 text-black bg-gray-200 hover:bg-gray-300 rounded" onClick={() => addToDisplay('0')}>
          0
        </button>
        <button className={`${buttonColors} p-2 text-black rounded`} onClick={() => addToDisplay('.')}>
          .
        </button>
        <button className={`${operatorColors} p-2 text-black rounded`} onClick={calculateResult}>
          =
        </button>
      </div>


    </div>
    <div className="ml-12 mt-4">
  <h2 className="text-black text-2xl mb-2 text-center ">Calculation History</h2>
  <table className="min-w-full bg-white border">
    <thead>
      <tr>
        <th className="p-4 border-b">Name</th>
        <th className="p-4 border-b">Expression</th>
        <th className="p-4 border-b">Result</th>
        <th className="p-4 border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      {history.map((calculation) => (
        <tr key={calculation._id} className="border-b">
          <td className="py-3 px-4">
            {editingCalculationId === calculation._id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-2 py-1 rounded-md border"
              />
            ) : (
              <span className="font-bold">
                {calculation.name ? calculation.name : 'Unnamed Calculation: '}
              </span>
            )}
          </td>
          <td className="py-2 px-4">
            {editingCalculationId === calculation._id ? (
              <input
                type="text"
                value={editExpression}
                onChange={(e) => setEditExpression(e.target.value)}
                className="w-full px-2 py-1 rounded-md border"
              />
            ) : (
              <span className="font-bold">{calculation.expression}</span>
            )}
          </td>
          <td className="py-2 px-4">{calculation.result}</td>
          <td className="py-2 px-4 flex gap-2">
            {editingCalculationId === calculation._id ? (
              <button onClick={() => handleSave(calculation._id)} className="bg-green-500 text-white px-4 py-2 rounded-md">
                Save
              </button>
            ) : (
              <>
                <button onClick={() => handleEdit(calculation._id, calculation.name, calculation.expression)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41L18.37 3.7c-.39-.39-1.02-.39-1.41 0L15 5.25l3.75 3.75 1.96-1.96z"
                    />
                  </svg>
                </button>
                <button onClick={() => handleDelete(calculation._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M19 6H5v12h14V6zm-2 10H7v-8h10v8zm-6-6h2v4h-2v-4z"
                    />
                  </svg>
                </button>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </>

  );
};

const App = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Calculator />
    </div>
  );
};

export default App;
