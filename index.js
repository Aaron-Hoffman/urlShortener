require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const dns = require('node:dns');

const urlData = {};
let currentNumber = 0;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  dns.lookup(req.body.url, (err, address, family) => {
    if (!address) {
      res.json({ error: 'invalid url' });
    } else {
      currentNumber++;
      urlData[currentNumber] = req.body.url;
      res.json({ original_url : req.body.url, short_url : currentNumber});
    }
  })
})

app.get('/api/shorturl/:id', function(req, res) {
  let redirectPath = urlData[req.params.id];
  res.redirect(`http://${redirectPath}`);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
