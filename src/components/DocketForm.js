import React, { useState, useEffect } from 'react';
// import DocketTable from './DocketTable';
import './docketTable.css'

const DocketForm = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState('');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [ratePerHour, setRatePerHour] = useState('');
  const [description, setDescription] = useState('');
  const [isDocketCreated, setDocketCreated] = useState(false);
  const [dockets, setDockets] = useState([]);

  useEffect(()=>{
    setDocketCreated(false)
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch docket data from the server
        const response = await fetch('https://parshva-git-main-saikrishnayadav764.vercel.app/api/dockets');
        if (!response.ok) {
          throw new Error('Failed to fetch docket data');
        }
        const data = await response.json();
        setDockets(data);
      } catch (error) {
        console.error('Error fetching docket data:', error);
      }
    };

    fetchData();
  }, [isDocketCreated]);


  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('https://parshva-git-main-saikrishnayadav764.vercel.app/api/unique-suppliers');
        if (!response.ok) {
          throw Error('Failed to fetch suppliers');
        }
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      if (selectedSupplier) {
        try {
          const response = await fetch(`https://parshva-git-main-saikrishnayadav764.vercel.app/api/purchase-orders/${selectedSupplier}`);
          if (!response.ok) {
            throw new Error('Failed to fetch purchase orders');
          }
          const data = await response.json();
          setPurchaseOrders(data);
        } catch (error) {
          console.error('Error fetching purchase orders:', error);
        }
      }
    };

    fetchPurchaseOrders();
  }, [selectedSupplier]);

 // New state variable to store the description

  // Define a function to fetch the description based on the selected PO number
  const fetchDescription = async (selectedPO) => {
    const poNumberPart = selectedPO.split('/').pop(); // Extract the part of PO number after the slash
    try {
      const response = await fetch(`https://parshva-git-main-saikrishnayadav764.vercel.app/api/description/${poNumberPart}`);
      if (!response.ok) {
        throw new Error('Failed to fetch description');
      }
      const data = await response.json();
      setDescription(data.Description); // Update the description state
    } catch (error) {
      console.error('Error fetching description:', error);
    }
  };





  const renderDockets= ()=> {
    return (   <div>
        <h2 className='nm'>Docket Table</h2>
        <table className="docket-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start time</th>
              <th>End time</th>
              <th>No. of hours worked</th>
              <th>Rate per hour</th>
              <th>Supplier</th>
              <th>Purchase Order</th>
            </tr>
          </thead>
          <tbody>
            {dockets.map((docket) => (
              <tr key={docket._id}>
                <td>{docket.Name}</td>
                <td>{docket.StartTime}</td>
                <td>{docket.EndTime}</td>
                <td>{docket.HoursWorked}</td>
                <td>{docket.RatePerHour}</td>
                <td>{docket.Supplier}</td>
                <td>{docket.PurchaseOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)
  }

  useEffect(() => {
    if (selectedPurchaseOrder) {
      fetchDescription(selectedPurchaseOrder);
    }
  }, [selectedPurchaseOrder]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Create an object with the form data
    const formData = {
      name,
      startTime,
      endTime,
      hoursWorked,
      ratePerHour,
      selectedSupplier,
      selectedPurchaseOrder
    };

    try {
      // Send a POST request to the server to create a docket
      const response = await fetch('https://parshva-git-main-saikrishnayadav764.vercel.app/api/create-docket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset the form fields after successful submission
        setName('');
        setStartTime('');
        setEndTime('');
        setHoursWorked('');
        setRatePerHour('');
        setSelectedSupplier('');
        setSelectedPurchaseOrder('');
        setDescription('')
        setDocketCreated(true);
        // You can also add code to display a success message to the user
      } else {
        console.error('Failed to create docket');
        // Handle error and display an error message to the user
      }
    } catch (error) {
      console.error('Error creating docket:', error);
      // Handle error and display an error message to the user
    }
  };


  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '0 auto' }}>
    <form onSubmit={handleFormSubmit}>
      <div style={{ marginBottom: '10px' }}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Start time:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>End time:</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>No. of hours worked:</label>
        <input type="number" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Rate per hour:</label>
        <input type="number" step="0.01" value={ratePerHour} onChange={(e) => setRatePerHour(e.target.value)} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Select Supplier:</label>
        <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier} value={supplier}>
              {supplier}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Select Purchase Order:</label>
        <select
          value={selectedPurchaseOrder}
          onChange={(e) => setSelectedPurchaseOrder(e.target.value)}
          disabled={!selectedSupplier}
        >
          <option value="">Select Purchase Order</option>
          {purchaseOrders.map((po) => (
            <option key={po} value={po}>
              {po}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Description:</label>
        <textarea value={description} readOnly />
      </div>
      <button type="submit" style={{ backgroundColor: 'blue', color: 'white', padding: '10px', cursor: 'pointer' }}>
        Create Docket
      </button>
    </form>
  </div>
   {renderDockets() }
   </>
  );
};

export default DocketForm;
