const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'orders.json');

// Load orders from disk
function loadOrders() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  return [];
}

// Save orders to disk
function saveOrders(orders) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
}

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// GET: Return all orders
app.get('/api/orders', (req, res) => {
  const orders = loadOrders();
  res.json(orders);
});

// POST: Create new order
app.post('/api/orders', (req, res) => {
  const orders = loadOrders();
  orders.push(req.body);
  saveOrders(orders);
  res.status(201).json({ success: true });
});

// PUT: Update order status
app.put('/api/orders/:idx', (req, res) => {
  const idx = Number(req.params.idx);
  const orders = loadOrders();

  if (!orders[idx]) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  orders[idx].status = req.body.status;
  saveOrders(orders);
  res.json({ success: true });
});

// DELETE: Delete order
app.delete('/api/orders/:idx', (req, res) => {
  const idx = Number(req.params.idx);
  const orders = loadOrders();

  if (!orders[idx]) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  orders.splice(idx, 1);
  saveOrders(orders);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
