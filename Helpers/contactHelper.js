const db = require("../Config/dbConfig");
const collection = require("../Config/collections");
const addressHelper = require("../Helpers/addressHelper");

module.exports = {
  createContact: (contactInfo) => {
    console.log(contactInfo?.lastname.length);
    return new Promise((resolve, reject) => {
      db.get().collection(collection.CONTACT_COLLECTION).createIndex(
        {
          firstname: "text",
          number: "text",
          lastname: "text",
        }
      );

      db.get().collection(collection.CONTACT_COLLECTION).createIndex(
        {
          number: 1,
          unique: true,
        }
      );

      db.get()
        .collection(collection.CONTACT_COLLECTION)
        .insertOne({
          firstname: contactInfo?.firstname,
          lastname: contactInfo?.lastname,

          age: parseInt(contactInfo?.age),
          gender: contactInfo?.gender,
          number: [parseInt(contactInfo?.number)],
          contactImage: contactInfo.contactImg,
          email: contactInfo.email,
        })
        .then((data) => {
          const contactId = data.insertedId;
          addressHelper
            .createAddress(contactInfo, contactId)
            .then((response) => {
              resolve(response);
              console.log(response, "respooonsee");
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
