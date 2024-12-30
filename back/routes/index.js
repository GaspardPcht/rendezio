var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API !' });
});

module.exports = router;
