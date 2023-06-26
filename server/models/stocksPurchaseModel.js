const mongoose = require("mongoose");

const purchaseSchema = mongoose.Schema({

   
    purchaseDate: { type: String, require },
    purchaseNo: { type: String, require },
    billNo: { type: String, require},
    billDate: { type: String, require},
    vendorId: { type: String, require},
    price: { type: String, require},
    quantity: { type: String, require},
  



}, {

    timestamps: true,

})

const stocsksPurchaseModel = mongoose.model('stockspurchase', purchaseSchema)

module.exports = stocsksPurchaseModel