import React from 'react'
import axios from 'axios'
import DataTable from "react-data-table-component"
import Swal from 'sweetalert2';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { deletePruchaseAction, addPurchase, updatePruchaseAction } from './../actions/stocksPruchaseActions';

let PurchaseId
function StocksPurchasescreen() {



    const [Purchase, setPurchase] = useState([]);
    const [FilterdPurchase, setFilterdPurchase] = useState([]);
    const [searchPurchase, setSearchPurchase] = useState("");


    function addnewpurchase() {
        // Validate the input fields
        if (!PurchaseNo || !BillNo || !BillDate || !VendorId || !Price|| !Quantity) {
            Swal.fire('Error', 'Please fill in all the required fields', 'error');
            return;
        }

        // Create a new purchase object
        const newpurchase = {

            purchaseno: PurchaseNo,
            billno: BillNo,
            billdate: BillDate,
            Vendorid:  VendorId,
            price: Price,
            quantity: Quantity,
        };

        // Add the new purchase to the database using Redux action
        dispatch(addPurchase(newpurchase));

        // Show success message and reset the input fields
        //Swal.fire('Success', 'New purchase added successfully', 'success');
        setPurchaseNo('');
        setBillNo('');
        setBillDate('');
        setVendorId('');
        setPrice('');
        setQuantity('');
    }




    useEffect(() => {

        function  getpurchase() {

            axios.get("/api/stockspurchase/getallpurchases").then((res) => {
                setPurchase(res.data);
                console.log(res.data)


                setFilterdPurchase(res.data);


            }).catch((err) => {
                console.log(err.message)

            })
        }

        getpurchase();

    }, [])

    function getCurrentPurchases(PurchaseId) {

        axios.get(`/api/stockpurchases/getcurrents/${PurchaseId}`).then((res) => {


            setPurchase(res.data);
            Purchase = res.data
            console.log(Purchase)


        }).catch((error) => {
            console.log(error)


        })
    }

    //create data table
    const columns = [
        {
            name: "Purchase Id",
            selector: (row) => row._id,
            sortable: true
        },

        {
            name: "Purchase No ",
            selector: (row) => row.purchaseNo,
            sortable: true,
        },
        {
            name: "Bill No",
            selector: (row) => row.billNo,

        },
        {
            name: "Bill Date",
            selector: (row) => row.billDate,

        },
        // {
        //     name: "Vendor Id ",
        //     selector: (row) => row.VendorId,

        // },
        {
            name: "Price",
            selector: (row) => row.price,

        },
        {
            name: "Quantity",
            selector: (row) => row.quantity,

        },
        {
            name: "Update",
            cell: row => <button onClick={() => { getCurrentPurchases(PurchaseId = row._id) }}  className="btn" data-bs-toggle="modal" href="#exampleModalToggleUpdate" role="button">Update</button>

        },
        {
            name: "Delete",
            cell: row => <button onClick={() => { deletePurchase(row._id) }} className="btn" role="button">Delete</button>


        },
        {
            name: "Email",
            cell: row => (
              <button onClick={() => { 
                Swal.fire({
                  title: "Reply",
                  html: `<b><u>Email:</u></b><br> ${row.email}`,
                  input: "textarea",
                  inputPlaceholder: "Type your reply here",
                  confirmButtonText: "Send",
                  showCancelButton: true,
                  cancelButtonText: "Cancel",
                  preConfirm: (reply) => {
                    const emailAddress = row.email;
                    const subject = "Reply to your message";
                    const emailBody = reply;
                    const emailLink = `https://mail.google.com/mail/?view=cm&to=${emailAddress}&su=${subject}&body=${emailBody}`;
                    window.open(emailLink, "_blank");
                  }
                }) 
              }} className="btn" role="button">
                Send
              </button>
            )
          },


    ]



    // search button
    useEffect(() => {
        const results = Purchase.filter(Purchase => {
            return Purchase._id.toLowerCase().match(searchPurchase.toLowerCase());
        });

        setFilterdPurchase(results);
    }, [searchPurchase]);

    //delete
    const dispatch = useDispatch();

    function deletePurchase(PurchaseId) {

        dispatch(deletePruchaseAction(PurchaseId));


    }

    const [purchaseno, updatePurchaseNo] = useState(Purchase.purchaseno)
    const [billno, updateBillNo] = useState(Purchase.billno)
    const [billdate, updateBillDate] = useState(Purchase.billdate)
    const [vendorid, updateVendorId] = useState(Purchase.vendorid)
    const [price, updatePrice] = useState(Purchase.price)
    const [quantity, updateQuantity] = useState(Purchase.quantity)
    


    // update
    function updateforPurchase(PurchaseId)
         {
        const updatePurchase = {
  
            purchaseno,
            billno,
            billdate,
            vendorid,
            price,
            quantity

        }

        dispatch(updatePruchaseAction(updatePurchase, PurchaseId))
    }


    const [PurchaseNo, setPurchaseNo] = useState('')
    const [BillNo, setBillNo] = useState('')
    const [BillDate, setBillDate] = useState('')
    const [VendorId, setVendorId] = useState('')
    const [Price, setPrice] = useState('')
    const [Quantity, setQuantity] = useState('')

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

                        title='Purchase Management'
                        columns={columns}
                        data={FilterdPurchase}
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
                                value={searchPurchase}
                                onChange={(e) => setSearchPurchase(e.target.value)}

                            />

                        }


                    />
                
                    <br />
                    {/generate report button/}
                    <br />
                    <div className='modal-footer'>
                        <div className='p-1'>
                            <button class="btn" data-bs-target="#addnewpurchase" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-plus" aria-hidden="true"></i>Add New Purchase</button>
                        </div>
                    {/* <div className='modal-footer'>
                        <div className='p-1'>
                            <button class="btn" data-bs-target="#addnewpurchase = (Purchase) => async dispatch => {" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-plus" aria-hidden="true"></i>Add New Purchase Details</button>
                        </div> */}

                        {/* generate report button
                        <div className='p-1'><button class="btn" data-bs-target="#exampleModalToggleReport" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-file" aria-hidden="true"></i> Generate Purchase Report</button>
                        </div>
                        <br />

                        <div className='p-1'><button class="btn" data-bs-target="#exampleModalToggleReport" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-file" aria-hidden="true"></i> Generate Purchase Report</button>
                        </div> */}
                        <br />
    
                    </div>
                </div>
            </div>
                 
          



         {/* create add new purchase modal */}
            <div class="modal fade" id="addnewpurchase" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="updateemailLabel">Add New Purchase</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <form>


                                <div class="mb-3">
                                    <label for="customer-password" class="col-form-label">Purchase No:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="PurchaseNo"
                                        value={PurchaseNo}
                                        onChange={(e) => { setPurchaseNo(e.target.value) }}

                                    />
                                </div>


                                <div class="mb-3">
                                    <label for="customer-password" class="col-form-label">Bill No:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="BillNo"
                                        value={BillNo}
                                        onChange={(e) => { setBillNo(e.target.value) }}

                                    />
                                </div>

                                <div class="mb-3">
                                    <label for="customer-cpassword" class="col-form-label">Bill Date:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="BillDate"
                                        value={BillDate}
                                        onChange={(e) => { setBillDate(e.target.value) }}

                                    />
                                </div>


                                <div class="mb-3">
                                    <label for="customer-password" class="col-form-label">Vendor Id:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="VenderId  "
                                        value={VendorId}
                                        onChange={(e) => { setVendorId(e.target.value) }}

                                    />
                                </div>


                                <div class="mb-3">
                                    <label for="customer-password" class="col-form-label">Price:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="Price"
                                        value={Price}
                                        onChange={(e) => { setPrice(e.target.value) }}

                                    />
                                </div>

                                <div class="mb-3">
                                    <label for="customer-password" class="col-form-label">Quantity:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="Quantity"
                                        value={Quantity}
                                        onChange={(e) => { setQuantity(e.target.value) }}

                                    />
                                </div>
 
                            </form>
                        </div>
                        <div class="modal-footer">

                            <button onClick={addnewpurchase} type="button" class="btn ">Add Purchase</button>
                            <button type="button" class="btn " data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>


            

             {/*Model 2 - Update */}
              <div className="modal fade" id="exampleModalToggleUpdate" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title" id="exampleModalToggleLabel">
                                <h20>Edit Item Purchase</h20>
                            </h5>

                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">

                            <div className="p-4 m-4" style={{ borderRadius: '25px', textAlign: "left" }}>

                                <div>

                                    <div className="col-md-6 mb-4">

                                   

                                        <> </>

                                        <div className="form-group">
                                        <br />
                                            <label>Edit Purchase No</label>
                                            <input
                                                className="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter PurchaseNo'
                                                value={purchaseno || Purchase.purchaseno}
                                                onChange={(e) => { updatePurchaseNo(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                            >

                                            </input>

                                        </div>

                                        <div className="form-group">
                                        <br />
                                            <label>Edit Bill Date</label>
                                            <input
                                                className="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter BillDate'
                                                value={billdate || Purchase.billdate}
                                                onChange={(e) => { updateBillDate(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                            >

                                            </input>

                                        </div>

                                        <div className="form-group">
                                        <br />
                                            <label>Edit Bill No</label>
                                            <input
                                                className="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter BillNo'
                                                value={billno || Purchase.billno}
                                                onChange={(e) => { updateBillNo(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                            >

                                            </input>

                                        </div>

                                        <div className="form-group">
                                            <br />
                                            <label>Edit Vendor Id</label>

                                            <input
                                                className="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter VendorId'
                                                value={vendorid || Purchase.vendorid}
                                                onChange={(e) => { updateVendorId(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                            >

                                            </input>

                                            </div>
                                        <div className="form-group">
                                            <br />
                                            <label>Edit Price</label>

                                            <input
                                                className="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter Price'
                                                value={price || Purchase.price}
                                                onChange={(e) => { updatePrice(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                                >
                                                </input>
                                        </div>

                                        <div className="form-group">
                                            <br />
                                            <label>Edit Quantity</label>

                                            <input
                                                className="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter Quantity'
                                                value={quantity || Purchase.quantity}
                                                onChange={(e) => { updateQuantity(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                                >
                                                </input>
                                        </div>




                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button onClick={() => updateforPurchase(PurchaseId, updateforPurchase)} type="button" class="btn ">Update</button>
                        </div>

                    </div>



                </div>

            </div> 

          </div>                                  
    )
}

export default StocksPurchasescreen