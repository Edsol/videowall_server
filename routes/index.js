var express = require('express');
var router = express.Router();

const clientManager = require("./clientManager");
var ClientManager = new clientManager();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const clients = await ClientManager.getClientList();
  for (var client of clients) {
    console.log(client)
  }
  res.render('index/index', { clients: clients });
});

/*
* open page in remote browser
*/
router.post('/openUrl', async function (req, res, next) {
  var client = await ClientManager.get(req.body.id);
  var response = client.openUrl(req.body.url, client.ip_address)
  res.json(response)
})

/*
* take screenshot of remote client screen
*/
router.get('/getScreenshot/:id', async function (req, res, next) {
  var client = await ClientManager.get(req.params.id);

  var base64_image = await client.getScreenshot();
  var base64Data = base64_image.replace(/^data:image\/png;base64,/, "");

  var file_name = client.mac.replace(/:/g, '_') + ".png";

  require("fs").writeFile("./tmp/" + file_name, base64Data, 'base64', function (err) {
    if (err) {
      console.log('error while saving the image', err);
    }
  });

  res.json(base64_image);
});

/*
* reboot remote edvice
*/
router.get('/reboot/:id', async function (req, res, next) {
  var client = await ClientManager.get(req.params.id);
  res.json(await client.reboot());
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
