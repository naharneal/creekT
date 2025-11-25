const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Store orders in memory (or on disk)
let orders = [];
const DATA_FILE = path.join(__dirname, 'orders.json');

// Middleware
app.use(bodyParser.json());

// Serve your index.html and static files
app.use(express.static(__dirname));

// API endpoint to get all orders
app.get('/api/orders', (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    orders = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  res.json(orders);
});

// API endpoint to create a new order
app.post('/api/orders', (req, res) => {
  const newOrder = req.body;
  orders.push(newOrder);
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
  res.status(201).json({ success: true });
});

// Update status
app.put('/api/orders/:idx', (req, res) => {
  const idx = parseInt(req.params.idx, 10);
  if (orders[idx]) {
    orders[idx].status = req.body.status;
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Delete order
app.delete('/api/orders/:idx', (req, res) => {
  const idx = parseInt(req.params.idx, 10);
  if (orders[idx]) {
    orders.splice(idx, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
