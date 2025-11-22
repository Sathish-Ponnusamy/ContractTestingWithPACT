// server.js
const express = require('express');
const app = express();
const PORT = 8080; // This is the port your provider verification test is looking for

app.use(express.json());

// // 1. Endpoint that satisfies the Pact contract for /users/10
// app.get('/users/:id', (req, res) => {
//   if (req.params.id === '10') {
//     // This response body must match the contract defined in your consumer test!
//     res.status(200).json({
//       id: 10,
//       firstName: 'Example', // Ensure capitalization matches the contract
//       lastName: 'User',     // Ensure capitalization matches the contract
//     });
//   } else {
//     res.status(404).send({ message: 'User not found' });
//   }
// });

// server.js (Change the response body)

app.get('/users/:id', (req, res) => {
  if (req.params.id === '10') {
    res.status(200).json({
      id: 10,
      firstname: 'Example', // 👈 CHANGE THIS TO ALL LOWERCASE
      lastname: 'User',     // 👈 CHANGE THIS TO ALL LOWERCASE
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

// 2. State Handler Endpoint (optional, but good practice for Pact)
// Pact Verifier will hit this endpoint before running the verification test
app.post('/provider-states', (req, res) => {
  const { state, action } = req.body;
  console.log(`Provider state requested: ${state}`);
  // In a real app, you would set up/teardown data here based on the 'state'
  res.send('State set.');
});

app.listen(PORT, () => {
  console.log(`Provider API running on http://localhost:${PORT}`);
});