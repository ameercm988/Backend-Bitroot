const db = require("../Config/dbConfig");
const contactHelper = require("../Helpers/contactHelper");
const collection = require("../Config/collections");
const object = require("mongodb").ObjectId;

module.exports = {
  postContact: async (req, res, next) => {
    const reqData = Object.keys(req.body);
    console.log(reqData, "reqdaaata");

    const info = [
      "firstname",
      "lastname",
      "number",
      "age",
      "gender",
      "email",
      "country",
      "city",
      "street",
    ];
    const check = info.every((elem) => {
      return reqData.includes(elem) && req?.body[elem] !== "";
    });
    console.log(check, "checkkkkkkkk");
    if (!check) {
      res.status(422).json("field has to be filled");
    } else {
      console.log(req.body, "reqBody");
      const contactInfo = req.body;

      contactInfo.contactImg =
        req.protocol +
        "://" +
        req.get("host") +
        "/contactImage/" +
        req?.file?.filename;

      contactHelper
        .createContact(contactInfo)
        .then((data) => {
          console.log(data, "daaaaata");
          res
            .status(201)
            .json({ message: "contact created successfully", data });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    }
  },

  deleteContact: async (req, res, next) => {
    try {
      const id = req.params.id;

      const deleteInfo = await db
        .get()
        .collection(collection.ADDRESS_COLLECTION)
        .deleteOne({ contactId: id });
      console.log(deleteInfo);
      const deleteUser = await db
        .get()
        .collection(collection.CONTACT_COLLECTION)
        .deleteOne({ _id: object(id) });
      console.log(deleteUser);

      res.status(200).json("deleted successfully");
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
