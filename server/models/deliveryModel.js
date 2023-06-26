const mongoose = require("mongoose");


const deliverySchema = mongoose.Schema({
  driverName: {type: String , require},
  orderId: {type: String , require},
  orderItems : [],
  location: {type: Object},
  coordinates:{type: Object },
  customerName: {type: String , require},
  amount: { type: Number, default: 0 },
  driverRate: { type: Number, default: 1000 },
},{

  timestamps: true,

});



module.exports  = mongoose.model('Delivery', deliverySchema);

