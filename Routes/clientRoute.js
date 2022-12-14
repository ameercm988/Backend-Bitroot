const router = require("express").Router();
const controller = require("../Controllers/clientController");
const multer = require("multer");
const path = require("path");

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./contactImage");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
  fileFilter: (req, file, callBack) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      return callBack(new Error("only images are allowed"));
    }
    callBack(null, true);
  },
  limits: {
    fileSize: 1024 * 1024
  },
});

//api functions

router.post("/create-contact", upload.single("image"), controller.postContact);

router.delete("/delete-contact/:id", controller.deleteContact);

router.get("/fetch-contacts", controller.fetchContact);

router.post("/search-contact", controller.searchContact);

router.put("/update-contact/:id", upload.single("image"), controller.updateContact);

router.get("/download-csv", controller.csvDownloader);

module.exports = router;
