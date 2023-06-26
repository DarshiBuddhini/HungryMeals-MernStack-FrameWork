const express = require("express");
const router = express.Router();
const Stocks = require('../models/stocksModel');

//add new 
router.post("/post/stocks", async (req, res) => {

    const { itemname,category, quantity ,reorderLevel} = req.body
    try {


        const newStocks = new Stocks({ itemname,category, quantity ,reorderLevel })
        newStocks.save()
        res.send('Stock Item added successfully!')


    } catch (error) {

        return res.status(400).json({ message: error });
    }
});

//get all stocks
router.get("/getallstocks", async (req, res) => {

    try {

        const stocks = await Stocks.find({})
        res.send(stocks)

    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.put("/update/stocks/:id", async (req, res) => {

    let ItemId = req.params.id;
    const {itemname,category, quantity ,reorderLevel} = req.body;

    const updateStocks = {

        itemname, 
        category, 
        quantity,
        reorderLevel
        
    }

    try {

        await Stocks.findByIdAndUpdate(ItemId, updateStocks)
        res.send('Stock Item details updated successfully!')

    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.delete("/delete/stocks/:id", async (req, res) => {

    let ItemId = req.params.id;

    try {
        await Stocks.findByIdAndDelete(ItemId)

        res.send('Stock Deleted Successfully')
    }

    catch (error) {


        return res.status(400).json({ message: error });
    }
});

//get current 
router.get("/getcurrentstocks/:id", async (req, res) => {

    let ItemId = req.params.id;
    try {

        const currentstocks = await Stocks.findById(ItemId)
        res.send(currentstocks)

    } catch (error) {
        return res.status(400).json({ message: error });
    }

})

module.exports = router;