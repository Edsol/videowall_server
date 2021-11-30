var express = require('express');
var router = express.Router();

const clientManager = require("./clientManager");
var ClientManager = new clientManager();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const clients = await ClientManager.getClientList();
  res.render('index/index', { clients: clients });
});

/*
* open page in remote browser
*/
router.post('/openUrl', async function (req, res, next) {
  console.log(req.body)
  var client = await ClientManager.get(req.body.id);
  var response = client.openUrl(req.body.url, client.ip_address)
  res.json(response)
})

/*
* take screenshot of remote client screen
*/
router.get('/getScreenshot/:id', async function (req, res, next) {
  var client = await ClientManager.get(req.params.id);
  res.json(await client.getScreenshot());
});

/*
* close all browser windows to remote client
*/
router.get('/closeRemoteBrowser/:id', async function (req, res, next) {
  var client = await ClientManager.get(req.params.id);
  res.json(await client.closeAllBrowser())
});

router.get('/listClient', async function (req, res, next) {
  res.json(await ClientManager.getClientList());
});

router.get('/findNewClient', async function (req, res, next) {
  res.json(await ClientManager.findNewClient());
});

module.exports = router;
