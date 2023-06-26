import React from 'react'
import axios from 'axios'
import DataTable from "react-data-table-component"
import Swal from 'sweetalert2';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { deleteItemAction, addItem, updateItemAction } from './../actions/StocksActions';


let ItemId;
let stocksArray,stocksCount,meatCount,vegCount,cheeseCount;

function StocksManagementScreen() {



    const [Items, setItems] = useState([]);
    const [FilterdItems, setFilterdItems] = useState([]);
    const [searchItem, setSearchItem] = useState("");


    function addnewitem() {
        // Validate the input fields
        if (!ItemName || !Quantity || !ReOrderLevel || !Category) {
            Swal.fire('Error', 'Please fill in all the required fields', 'error');
            return;
        }

        // Create a new item object
        const newItem = {
            itemname: ItemName,
            quantity: Quantity,
            reorderLevel: ReOrderLevel,
            category: Category,
        };

        // Add the new item to the database using Redux action
        dispatch(addItem(newItem));

        // Show success message and reset the input fields
        //Swal.fire('Success', 'New item added successfully', 'success');
        setItemName('');
        setQuantity('');
        setReOrderLevel('');
        setCategory('');
    }




    useEffect(() => {

        function getStocks() {

            axios.get("/api/stocks/getallstocks").then((res) => {
                setItems(res.data);
                console.log(res.data)
                stocksArray=res.data;
                stocksCount=stocksArray.length;
                meatCount = res.data.filter(stocks => stocks.category === 'Meat').length;
                vegCount = res.data.filter(stocks => stocks.category === 'Vegetables').length;
                cheeseCount = res.data.filter(stocks => stocks.category === 'Cheese').length;
                setFilterdItems(res.data);


            }).catch((err) => {
                console.log(err.message)

            })
        }

        getStocks();

    }, [])

    function getCurrentStocks(ItemId) {

        axios.get(`/api/stocks/getcurrentstocks/${ItemId}`).then((res) => {


            setItems(res.data);
            Items = res.data
            console.log(Items)


        }).catch((error) => {
            console.log(error)


        })
    }

    //create data table
    const columns = [
        {
            name: "Item ID",
            selector: (row) => row._id,
            sortable: true
        },

        {
            name: "Item Name ",
            selector: (row) => row.itemname,
            sortable: true,
        },
        {
            name: "Category",
            selector: (row) => row.category,

        },
        {
            name: "Quantity",
            selector: (row) => row.quantity,

        },
        {
            name: "Re Order Level",
            selector: (row) => row.reorderLevel,

        },
        {
            name: "Update",
            cell: row => <button onClick={() => { getCurrentStocks(ItemId = row._id) }}  className="btn" data-bs-toggle="modal" href="#exampleModalToggleUpdate" role="button">Update</button>

        },
        {
            name: "Delete",
            cell: row => <button onClick={() => { deleteItem(row._id) }} className="btn" role="button">Delete</button>


        },


    ]





    // search button
    useEffect(() => {
        const results = Items.filter(Items => {
            return Items._id.toLowerCase().match(searchItem.toLowerCase());
        });

        setFilterdItems(results);
    }, [searchItem]);

    //delete
    const dispatch = useDispatch();

    function deleteItem(ItemId) {

        dispatch(deleteItemAction(ItemId));


    }

    const [itemname, updateIteName] = useState(Items.itemname)
    const [category, updateCategory] = useState(Items.category)
    const [quantity, updateQuantity] = useState(Items.quantity)
    const [reorderLevel, updateReOrderLevel] = useState(Items.reorderLevel)
    


    // update
    function updateforItem(ItemId) {
        const updateItem = {

            itemname,
            category,
            quantity,
            reorderLevel

        }

        dispatch(updateItemAction(updateItem, ItemId))
    }


    const [ItemName, setItemName] = useState('')
    const [Quantity, setQuantity] = useState('')
    const [ReOrderLevel, setReOrderLevel] = useState('')
    const [Category, setCategory] = useState('')


    // const qty = state.items.map(items => parseFloat(items.quantity))
    // const totalQuantiy = qty.reduce((acc, items) => (acc += items ),0); 

    // const totalItems = state.items.length;

    return (
        <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <div className='row justify-content-center'>
                <div className='col-md-9 m-3   p-0 ' >
                    <DataTable

                        title='Stocks Management'
                        columns={columns}
                        data={FilterdItems}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="450px"
                        selectableRows
                        selectableRowsHighlight
                        subHeader
                        subHeaderComponent={
                            <input

                                type="text"
                                placeholder="Search here..."
                                className='w-25 form-control'
                                value={searchItem}
                                onChange={(e) => setSearchItem(e.target.value)}

                            />

                        }


                    />
                    <br />
                    <br />
                    <div className='modal-footer'>
                        <div className='p-1'>
                            <button class="btn" data-bs-target="#addnewitem" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-plus" aria-hidden="true"></i>Add New Item</button>
                        </div>

                        {/* generate report button */}
                        <div className='p-1'><button class="btn" data-bs-target="#exampleModalToggleReport" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-file" aria-hidden="true"></i> Generate stocks Report</button>
                        </div>
                        <br />
                        <div className='p-1'>
                            <button class="btn" a href="admin/purchasemanage"><i style={{ fontSize: '15px', color: 'white' }} aria-hidden="true"></i>Go to Purchase page</button>
                        </div>
                        <br/>
                        
                        <br/>
                        
                    </div>
                </div>
            </div>


            {/* add new item modal */}
            <div class="modal fade" id="addnewitem" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="updateemailLabel">Add New Items</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <form>


                                <div class="mb-3">
                                    <label for="job-name" class="col-form-label">Item Name</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="Item-name"
                                        value={ItemName}
                                        onChange={(e) => { setItemName(e.target.value) }}

                                    />
                                </div>


                                <div class="mb-3">
                                    <label for="desc" class="col-form-label">Quantity:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="desc"
                                        value={Quantity}
                                        onChange={(e) => { setQuantity(e.target.value) }}

                                    />
                                </div>


                                <div class="mb-3">
                                    <label for="customer-password" class="col-form-label">Re Order Level:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="customer-password"
                                        value={ReOrderLevel}
                                        onChange={(e) => { setReOrderLevel(e.target.value) }}

                                    />
                                </div>



                                <div class="mb-3">
                                    <label for="category" class="col-form-label">Category:</label>
                                    <select id="inputState"

                                        class="form-select"
                                        value={Category}
                                        onChange={(e) => setCategory(e.target.value)}>
                                        <option selected>Choose...</option>
                                        <option value="Meat">Meat</option>
                                        <option value="Vegetables">Vegetables</option>
                                        <option value="Toppings">Toppings</option>
                                    </select>


                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">

                            <button onClick={addnewitem} type="button" class="btn ">Add Item</button>
                            {/* <button type="button" class="btn " data-bs-dismiss="modal">Add</button> */}

                        </div>
                    </div>
                </div>
            </div>
            
            {/* 
Model 2 - Update */}
            <div class="modal fade" id="exampleModalToggleUpdate" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">

                    <div class="modal-content">

                        <div class="modal-header">

                            <h5 class="modal-title" id="exampleModalToggleLabel">
                                <h20>Edit Item Portal</h20>
                            </h5>

                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">

                            <div className="p-4 m-4" style={{ borderRadius: '25px', textAlign: "left" }}>

                                <div class="row gx-5">
                                    <div class="col-md-4 mb-4">
                                        <div class="bg-image hover-overlay ripple shadow-2-strong rounded-5" data-mdb-ripple-color="light">

                                            <div class="form-group">
                                                <br></br>
                                                <label for="exampleFormControlTextarea1"><h20>Edit Item Name</h20></label>
                                                <textarea
                                                    class="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    rows="1"
                                                    placeholder='Item Name'
                                                    value={itemname || Items.itemname}
                                                    onChange={(e) => { updateIteName(e.target.value) }}
                                                    style={{ fontSize: '16px', fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                                >

                                                </textarea>
                                            </div>

                                        </div>
                                    </div>

                                    <div class="col-md-6 mb-4">

                                   

                                        <> </>

                                        <br></br>
                                        <div class="form-group">
                                            <label>Edit Item Category</label>
                                            <input
                                                class="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter Category'
                                                value={category || Items.category}
                                                onChange={(e) => { updateCategory(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                            >

                                            </input>

                                        </div>
                                        <div class="form-group">
                                            <br />
                                            <label>Edit Quantity</label>

                                            <input
                                                class="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter Location'
                                                value={quantity || Items.quantity}
                                                onChange={(e) => { updateQuantity(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                            >

                                            </input>

                                            </div>
                                        <div class="form-group">
                                            <br />
                                            <label>Re Order Level</label>

                                            <input
                                                class="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter Location'
                                                value={quantity || Items.quantity}
                                                onChange={(e) => { updateQuantity(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                                >
                                                </input>
                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="modal-footer">
                            <button onClick={() => updateforItem(ItemId, updateforItem)} type="button" class="btn ">Update</button>
                        </div>

                    </div>



                </div>

            </div>

            {/* generate report */}

            <div class="modal fade" id="exampleModalToggleReport" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalToggleLabel">Stocks Details Report</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <div class="container my-4">

                                <div class="border p-5 mb-5">

                                    <section>
                                        <div class="row">
                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow shadow" >
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>TOTAL PRODUCTS <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }} ></i></strong>

                                                        </p>
                                                       
                                                       
                                                        
                                                        <h5 class="mb-0">
                                                            <strong>{stocksCount }</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />

                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Recent Updates
                                                        </p>
                                                        {/* <h5 class="text-muted mb-0">11 467</h5> */}
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>Total Quantiy <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{ }</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />
                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p>

                                                        {/* <h5 class="text-muted mb-0">38 454</h5> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>LOWE STOCK PRODUCTS <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{ }%</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />
                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p>

                                                        <h5 class="text-muted mb-0"></h5>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>OUT OF STOCK PRODUCTS<i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>0</strong>
                                                            <small class="text-danger ms-2">
                                                                <i class="fas fa-arrow-down fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />

                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p>
                                                        <h5 class="text-muted mb-0"></h5>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </section>

                                    <section>
                                        <div class="row">
                                            <div class="col-md-8 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">

                                                        <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                                                            <li class="nav-item" role="presentation">
                                                                <a class="nav-link active" id="ex1-tab-1" data-mdb-toggle="pill" role="tab"
                                                                    aria-controls="ex1-pills-1" aria-selected="true">Stock Categories</a>
                                                            </li>



                                                        </ul>

                                                        {/* <div className=''> {VerifiedUsers.map((names) => (
                                                                    <ol>{names}<i class="fa fa-check-circle p-1" title="Verified Customer" style={{ fontSize: '14px', color: '#00b9ff' }} aria-hidden="true"></i></ol>

                                                                ))}
                                                                </div> */}



                                                        <div class="tab-content" id="ex1-content">
                                                            <div class="tab-pane fade show active" id="ex1-pills-1" role="tabpanel" aria-labelledby="ex1-tab-1">
                                                                <div id="chart-users"></div>
                                                            </div>
                                                            <div class="tab-pane fade" id="ex1-pills-2" role="tabpanel" aria-labelledby="ex1-tab-2">
                                                                <div id="chart-page-views"></div>
                                                            </div>
                                                            <div class="tab-pane fade" id="ex1-pills-3" role="tabpanel" aria-labelledby="ex1-tab-3">
                                                                <div id="chart-average-time"></div>
                                                            </div>
                                                            <div class="tab-pane fade" id="ex1-pills-4" role="tabpanel" aria-labelledby="ex1-tab-4">
                                                                <div id="chart-bounce-rate"></div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-4 mb-4">
                                                <div class="card mb-4">
                                                    <div class="card-body shadow">
                                                        <p class="text-center"><strong>Meat Types</strong></p>
                                                        <div id="pie-chart-current">{meatCount}</div>
                                                    </div>
                                                </div>

                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-center"><strong>Vegetables Types</strong></p>
                                                        <div id="pie-chart-previous">{vegCount}</div>
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-center"><strong>Cheese Types</strong></p>
                                                        <div id="pie-chart-previous">{cheeseCount}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                </div>


                            </div>

                        </div>

                        <div class="modal-footer">
                            <button class="btn" onClick={() => window.print()} >Print</button>
                            <button class="btn" data-bs-toggle="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default StocksManagementScreen