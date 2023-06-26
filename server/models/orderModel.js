const mongoose = require("mongoose");

const orderSchemma = mongoose.Schema({

    name : {type: String , require},
    email : {type: String , require},
    userid : {type: String , require},
    orderItems : [],
    shippingAddress : {type: Object},
    coordinates:{type: Object },
    orderAmount : {type: Number , require},
    isDelivered : {type: Boolean , default : false},
    orderStatus : {type: Boolean , default : false},
    refundRequestStatus : {type: Boolean , default : false},
    sendrefundStatus : {type: Boolean , default : false},
    transactionId : {type: String , require},
    isSuccessfull : {type: Boolean , default : false},
    isDeliveryAccepted : {type: Boolean , default : false},
},{
    
    timestamps : true
})

module.exports = mongoose.model('orders' , orderSchemma)