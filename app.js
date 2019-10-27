const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

mongoose.connect('mongodb+srv://high_oc:isw1RYvys6gw8vnA@cluster0-fkhg6.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas...');
    })
    .catch((error) => {
        console.log('Unable to connect to Atlas...')
        console.error(error);
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE, PATCH');
    next();
});

app.use(bodyParser.json());

app.post('/api/recipes', (req, res, next) => {
    ({ title, ingredients, instructions, difficulty, time } = req.body);
    const recipe = new Recipe({ title, ingredients, instructions, difficulty, time });

    recipe.save()
        .then(() => res.status(201).json({ message: 'Recipe created successfully...' }))
        .catch(error => res.status(400).json({ error }))
});

app.put('/api/recipes/:id', (req, res, next) => {
    ({ title, ingredients, instructions, difficulty, time } = req.body);
    const recipe = new Recipe({ _id: req.params.id, title, ingredients, instructions, difficulty, time });

    Recipe.updateOne({ _id: req.params.id }, recipe)
        .then(() => res.status(201).json({ message: 'Recipe updated successfully...'}))
        .catch(error => res.status(400).json({ error }))
});

app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Recipe deleted successfully...' }))
        .catch(error => res.status(400).json({ error }))
});

app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({ _id: req.params.id })
        .then(recipe => res.status(200).json(recipe))
        .catch(error => res.status(404).json({ error }))
});

app.get('/api/recipes', (req, res, next) => {
    Recipe.find()
        .then(recipes => res.status(200).json(recipes))
        .catch(error => res.status(400).json({ error }))
});

module.exports = app;