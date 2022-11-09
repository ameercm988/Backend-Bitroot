const db = require("../Config/dbConfig");
const contactHelper = require("../Helpers/contactHelper");
const collection = require("../Config/collections");
const object = require("mongodb").ObjectId;
const Blob = require("buffer").Blob;

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

  fetchContact: async (req, res, next) => {
    console.log("hdhdhh");
    try {
      const fetchedContacts = await db
        .get()
        .collection(collection.CONTACT_COLLECTION)
        .aggregate([
          {
            $lookup: {
              from: collection.ADDRESS_COLLECTION,
              localField: "_id",
              foreignField: "contactId",
              as: "contacts",
            },
          },
        ])
        .toArray();

      res.status(200).json(fetchedContacts);
      // console.log(fetchedContacts);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },

  searchContact: async (req, res, next) => {
    try {
      const data = req?.body?.search;
      const searchData = await db
        .get()
        .collection(collection.CONTACT_COLLECTION)
        .find({ $text: { $search: data } })
        .toArray();

      // searchmethod using $regex

      // const searchWithRegex = await  db.get().collection(collection.CONTACT_COLLECTION).find({
      //     $or : [ {
      //         firstname : { $regex : `/${data}/` , $options : "i"},
      //         lastname : { $regex : "/" +data +"/" , $options : "i"}
      //     }]
      // }).toArray()

      console.log(searchData, "inex");
      // console.log(searchWithRegex, 'regex');

      res.status(200).json(searchData);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },

  updateContact: async (req, res, next) => {
    try {
      const { city, street, country, number, email } = req.body;
      const id = req.params.id;
      const contactImage =
        req.protocol +
        "://" +
        req.get("host") +
        "/contactImage/" +
        req?.file?.filename;
      const checkNum = await db
        .get()
        .collection(collection.CONTACT_COLLECTION)
        .find({ _id: object(id), number: { $elemMatch: { $eq: number } } })
        .toArray(); //check for existing number before update
      if (checkNum.length > 0) {
        throw new Error("Existing number");
      }
      const updatedData = await db
        .get()
        .collection(collection.CONTACT_COLLECTION)
        .updateOne(
          { _id: object(id) },
          { $set: { email: email, contactImage: contactImage } },
          { $push: { number } }
        );
      const updateAddress = await db
        .get()
        .collection(collection.ADDRESS_COLLECTION)
        .updateOne(
          { contactId: object(id) },
          { $set: { city, country, street } }
        );
      if (updatedData.modifiedCount == 1 && updateAddress.modifiedCount == 1) {
        res.status(200).json("updated");
      } else {
        throw new Error();
      }
    } catch (error) {
      res.status(400).json(error);
    }
  },

  csvDownloader: async (req, res, next) => {
    try {
      const fetchedContacts = await db
        .get()
        .collection(collection.CONTACT_COLLECTION)
        .aggregate([
          {
            $lookup: {
              from: collection.ADDRESS_COLLECTION,
              localField: "_id",
              foreignField: "contactId",
              as: "contacts",
            },
          },
        ])
        .toArray();

      const refinedData = [];

      const data = Object.keys(fetchedContacts[0]);
      console.log(data, "datatatata");
      refinedData.push(data);

      fetchedContacts.forEach((elem) => {
        refinedData.push(Object.values(elem));
      });

      console.log(refinedData, "refinedata");
      let cvsData = "";

      refinedData.forEach((row) => {
        cvsData += row.join(",") + "\n";
      });

      const blob = new Blob([cvsData], { type: "text/csv ; charset=utf-8," });

      console.log(blob, "blooooooob");

      const objectUrl = URL.createObjectURL(blob);
      console.log(objectUrl, "objcturl");

      res.status(200).json(objectUrl);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },
};
