const express = require("express");
const router = express.Router();
const Purchase = require('../models/stocksPurchaseModel');

//add newpurchase 
router.post("/post/stockspurchase", async (req, res) => {

    const {  purchaseNo, billNo ,billDate, vendorId, price, quantity} = req.body;
    try {


        const newpurchase = new Purchase({  purchaseNo, billNo ,billDate, vendorId, price, quantity})
        newpurchase.save()
        res.send('Purchase details add successfully!')


    } catch (error) {

        return res.status(400).json({ message: error });
    }
});

//get all purchase
router.get("/getallpurchases", async (req, res) => {

    try {

        const purchases = await Purchase.find({})
        res.send(purchases)

    } catch (error) {
        return res.status(400).json({ message: error });
    }
});


router.put("/update/stockspurchase/:id", async (req, res) => {

    let PurchaseId = req.params.id;
    const {purchaseNo, billNo ,billDate, vendorId, price, quantity} = req.body;

    const updatePurchases = {
 
        purchaseNo, 
        billNo,
        billDate,
        vendorId,
        price,
        quantity
        
    }

    try {

        await Purchase.findByIdAndUpdate(PurchaseId, updatePurchases)
        res.send('Stock purchase details updated successfully!')

    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.delete("/delete/stockspurchase/:id", async (req, res) => {

    let PurchaseId = req.params.id;

    try {
        await Purchase.findByIdAndDelete(PurchaseId)

        res.send('Purchase Deleted Successfully')
    }

    catch (error) {


        return res.status(400).json({ message: error });
    }
});

//get currentpurchase 
router.get("/getcurrentstockpurchases/:id", async (req, res) => {

    let PurchaseId = req.params.id;
    try {

        const currentstockpurchases = await Purchase.findById(PurchaseId)
        res.send(currentstockpurchases)

    } catch (error) {
        return res.status(400).json({ message: error });
    }

})
module.exports = router;