var express = require('express');
var router = express.Router();

var index_controller = require('../controllers/index');

// router.get('/index', index_controller.getClients);
router.get('/', index_controller.index);
router.post('/openUrl', index_controller.openUrl)
router.get('/openBookmark/:bookmark_id/:client_id', index_controller.openBookmark)
router.get('/getScreenshot/:id', index_controller.getScreenshot);
router.get('/reboot/:id', index_controller.reboot);
router.get('/closeRemoteBrowser/:id', index_controller.closeRemoteBrowser);

router.get('/listClient', index_controller.listClient);
router.get('/findNewClient', index_controller.findNewClient);
router.get('/osd/:id', index_controller.osd);
router.get('/getConfig/:id', index_controller.getConfig)

module.exports = router;
