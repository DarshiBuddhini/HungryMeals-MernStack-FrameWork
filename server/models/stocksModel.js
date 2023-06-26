const mongoose = require("mongoose");

const stocksSchema = mongoose.Schema({

   
    itemname: { type: String, require },
    category: { type: String, require },
    quantity: { type: String, require},
    ReOrderLevel: { type: String, require},



}, {

    timestamps: true,

})

const stocksModel = mongoose.model('stocks', stocksSchema)

module.exports = stocksModel