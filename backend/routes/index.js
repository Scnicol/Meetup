// backend/routes/index.js
const express = require('express');
const router = express.Router();

console.log(router)

router.get('/hello/world', function(req, res) {
    console.log(req)
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

module.exports = router;
