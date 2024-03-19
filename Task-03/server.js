const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const dotenv = require("dotenv");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
dotenv.config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster-01.xalmll0.mongodb.net/Money-TrackerDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/transactions', async (req, res) => {
    try {
        const { description, amount, type } = req.body;
        const transaction = new Transaction({ description, amount, type });
        await transaction.save();
        res.status(201).send(transaction);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.send(transactions);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) {
            return res.status(404).send('Transaction not found');
        }
        res.status(200).send('Transaction deleted successfully');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
