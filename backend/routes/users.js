const router = require("express").Router();
const auth = require("../middleware/auth");
const controller=require('../controller/userController')

router.post("/register",controller.register);

router.post("/login", controller.login);

router.delete("/delete/:id", auth, controller.deleteUser);

router.put("/update/:id", auth, controller.updateUser);

router.post("/tokenIsValid", controller.isTokenValid);

router.get("/", auth, controller.getProfile);

router.get("/allUser", auth,controller.getUserDetails);

module.exports = router;