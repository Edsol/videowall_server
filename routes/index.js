var express = require('express');
var router = express.Router();
const ClientManager = require("./clientManager");
const Client = require('../models/client.js');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

var clientManager = new ClientManager();

async function getClient(id) {
  var client = await prisma.client.findUnique({
    where: {
      id: parseInt(id)
    }
  });

  return new Client(client);
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  const clients = await prisma.client.findMany()
  res.render('index', { clients: clients });
});

/*
* open page in remote browser
*/
router.post('/openUrl', async function (req, res, next) {
  var client = await getClient(req.body.id);
  var response = client.openUrl(req.body.url, client.ip_address)
  res.json(response)
})

/*
* take screenshot of remote client screen
*/
router.get('/getScreenshot/:id', async function (req, res, next) {
  var client = await getClient(req.params.id);
  var result = await client.getScreenshot();
  res.json(result);
});

/*
* close all browser windows to remote client
*/
router.get('/closeRemoteBrowser/:id', async function (req, res, next) {
  var client = await getClient(req.params.id);
  const response = await client.closeAllBrowser();
  res.json(response)
});


router.get('/ipList/:test', async function (req, res, next) {
  var test = JSON.parse(req.params.test)
  var list = await clientManager.getClientList(test);
  res.json(list);
});

module.exports = router;
