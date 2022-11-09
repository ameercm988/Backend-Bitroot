const db = require('../Config/dbConfig')
const collection = require('../Config/collections')

module.exports = {
    createAddress : (contactInfo, contactId) => {
        
        return new Promise(  (resolve, reject) => {
          
                db.get().collection(collection.ADDRESS_COLLECTION).insertOne({
                    contactId : contactId,
                    country : contactInfo?.country ,
                    city : contactInfo?.city,
                    street : contactInfo?.street,
    
                }).then((data) => {
                    resolve(data)
                }).catch((err) => {
                    reject(err)
                })
            }
           
        )
    }
}