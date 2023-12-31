const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const bookCtrl = require("../controllers/book");
const imageConverter = require("../middlewares/image-converter");

router.get("/bestrating", bookCtrl.getBestrating);
router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post("/:id/rating", auth, bookCtrl.createRating);
router.post("/", auth, multer, imageConverter, bookCtrl.createBook);
router.put("/:id", auth, multer, imageConverter, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;