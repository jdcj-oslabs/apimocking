
const express = require('express');
const router = express.Router();
const methods = ['get', 'post', 'patch', 'put', 'delete'];

let urlFilePath = '';
function setURLFilePath(url) {
  urlFilePath = url
  console.log(urlFilePath);
};


// Placeholder middleware for making sure dynamic routing works
const handleRequest = (req, res) => {
  console.log(req.headers);
  try {
    if (req.headers['content-type'].includes('json')
      || req.headers['content-type'].includes('xml')) {
      res.status(200);
      res.end();
    } else {
      res.status(400);
      res.end();
    }
  } catch {
    res.status(500);
    res.end();
  }
};

// Route for setting up other routes dynamically
router.get('/gotem', (req, res) => {
  console.log("ROUTES HAVE BEEN SET", req.body.bodyItems);
  setDynamicRoutes(req.body.bodyItems);
  res.status(200).end();
});

// Function that dynamically sets routes based on passed in bodyItems object
// Called when hitting the /gotem route
const setDynamicRoutes = (bodyItems) => {
  for (let i = 0; i < methods.length; i++) {
    for (let item in bodyItems) {
      router[methods[i]](bodyItems[item].customRoute, handleRequest);
    }
  }
}



module.exports = {router, setURLFilePath};

