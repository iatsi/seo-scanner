let express = require('express');
let router = express.Router();
let controller = require('../controller/main');


router.get('/get', controller.decodeHTML); 


module.exports = router;