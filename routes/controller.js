var express = require('express');
var router = express.Router();

var controller_controller = require('../controllers/controller');

// router.get('/index', controller_controller.getClients);
router.get('/', controller_controller.index);
router.post('/openUrl', controller_controller.openUrl)
router.get('/openBookmark/:bookmark_id/:client_id', controller_controller.openBookmark)
router.get('/getScreenshot/:id', controller_controller.getScreenshot);
router.get('/reboot/:id', controller_controller.reboot);
router.get('/closeRemoteBrowser/:id', controller_controller.closeRemoteBrowser);

router.get('/listClient', controller_controller.listClient);
router.get('/findNewClient', controller_controller.findNewClient);
router.get('/osd/:id', controller_controller.osd);
router.get('/getConfig/:id', controller_controller.getConfig)

router.get('/displayNumber/:number', controller_controller.displayNumber)

module.exports = router;
