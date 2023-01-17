require('dotenv').config();

const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.render('index', { title: 'My App' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
