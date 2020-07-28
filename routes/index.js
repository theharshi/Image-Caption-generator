const express = require("express");
// this will not create a new instace of express
// instead it will use the instace created at the first call of express

//using the router function of the express module
const router = express.Router();

const homeController = require("../controllers/home_Controller");

router.get("/", homeController.home);
router.post("/getCaption", homeController.getCaption);

module.exports = router;
