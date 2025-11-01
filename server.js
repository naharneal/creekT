const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'orders.json');

app.use(express.static(__dirname));
app.use(express.json());

app.get('/api/orders', (req,res)=>{
  const data = JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'[]');
  res.json(data);
});

app.post('/api/order', (req,res)=>{
  const orders = JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'[]');
  const newOrder = { id: Date.now(), ...req.body, status:'☕ Preparing' };
  orders.push(newOrder);
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders,null,2));
  res.json({success:true, order:newOrder});
});

app.put('/api/order/:id',(req,res)=>{
  const id = parseInt(req.params.id);
  const orders = JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'[]');
  const index = orders.findIndex(o=>o.id===id);
  if(index>-1){
    orders[index].status = req.body.status;
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders,null,2));
    res.json({success:true});
  } else res.status(404).json({error:'Order not found'});
});

app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));