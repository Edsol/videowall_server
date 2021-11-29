var express = require('express');
var router = express.Router();
const ClientManager = require("./clientManager");

var clientManager = new ClientManager();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});


router.get('/ipList/:test', async function (req, res, next) {
  var test = JSON.parse(req.params.test)
  var list = await clientManager.getClientList(test);
  res.json(list);
});

router.post('/remoteCommand', async function (req, res, next) {
  var response = await clientManager.remoteCommand(req.body);
  console.log('remoteCommand response', response)
  res.json(response)
})

router.get('/getScreenshot/:id', async function (req, res, next) {
  var id = req.params.id;
  console.log("id", id)
  var result = await clientManager.getScreenshot(id);
  res.json(result);
});

router.get('/closeRemoteBrowser/:id', async function (req, res, next) {
  var id = req.params.id;
  console.log("closeAll id", id)
  var result = await clientManager.closeAllRemoteBrowser(id);
  res.json(result);
});

module.exports = router;
