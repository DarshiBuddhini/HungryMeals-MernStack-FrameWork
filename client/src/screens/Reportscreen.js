import React from 'react'
import axios from 'axios'
import DataTable from "react-data-table-component"
import Swal from 'sweetalert2';
//import { Modal } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getUserOrders } from '../actions/orderActions'
import { updateStatus } from "../actions/salesActions";
import { updateStatusAction, deleteRefundTransactionAction } from "../actions/refundActions";

let salesid;
let totAmount;
let totRefunds;
let profit;
let startDate
let refundid;

export default function Reportscreen() {

    const [orders, setOrders] = useState([]);
    const [filterdOrders, setFilterdOrders] = useState([]);
    const [searchOrders, setSearchOrders] = useState("");

    useEffect(() => {

        function getOrders() {

            //get all sales from database
            axios.get("/api/orders/getallorders").then((res) => {
                setOrders(res.data);
                console.log(res.data)


                const filteredOrders = res.data.filter(order => order.isDelivered === true);
                setOrders(filteredOrders);
                setFilterdOrders(filteredOrders);

            }).catch((err) => {
                console.log(err.message)

            })
        }

        getOrders();


    }, [])


    //update status

    function updateStatus(salesid, val) {

        const updateisSuccessful = {

            isSuccessfull: val
        }

        console.log(updateisSuccessful, salesid)


        dispatch(updateStatusAction(updateisSuccessful, salesid, val))


    }

    function getCurrentOrders(salesid) {
        axios
            .get(`/api/orders/getcurrentorders/${salesid}`)
            .then((res) => {
                setOrders(res.data);
                orders = res.data;
                console.log(orders);
            })
            .catch((error) => {
                console.log(error);
            });

    }



    //create data table sales details
    const columnsOrders = [
        {
            name: "Transaction ID",
            selector: (row) => row.transactionId,
            sortable: true
        },


        {
            name: "Amount(LKR)",
            selector: (row) => row.orderAmount,
            sortable: true
        },

        {
            name: "Date",
            selector: (row) => row.createdAt.substring(0, 10),
            sortable: true
        },
        {
            name: "Order Status",
            selector: (row) => {

                return <span className="badge bg-success">Completed</span>;

            }
        },

        {
            name: "Trasaction Details",
            cell: row => <button onClick={() => getCurrentOrders(row._id)} type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>

        },

    ]

    //search button
    useEffect(() => {
        const results = orders.filter(order => {
            return order.createdAt.substring(0, 10).toLowerCase().match(searchOrders.toLowerCase());
        });

        setFilterdOrders(results);
        localStorage.setItem('filteredOrders', JSON.stringify(results));

        const filteredOrders = JSON.parse(localStorage.getItem('filteredOrders'));
        let totalAmount = 0;

        for (let i = 0; i < filteredOrders.length; i++) {
            totalAmount += filteredOrders[i].orderAmount;
        }
        totAmount = totalAmount;

    }, [searchOrders]);

    const dispatch = useDispatch();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //refund transaction history

    const [refunds, setRefunds] = useState([]);
    const [filterdRefunds, setFilterdRefunds] = useState([]);
    const [searchRefunds, setSearchRefunds] = useState("");
    


    useEffect(() => {

        function getRefunds() {

            //get all refund transactions from database
            axios.get("/api/refunds/getallrefunds").then((res) => {
                setRefunds(res.data);
                console.log(res.data)


                setFilterdRefunds(res.data);


            }).catch((err) => {
                console.log(err.message)

            })
        }

        getRefunds();

    }, [])

    //crate data table for refund transactions
    const columnsRefunds = [
        {
            name: "Transaction ID",
            selector: (row) => row._id,
            sortable: true
        },

        {
            name: "Amount",
            selector: (row) => row.refundamount,
            sortable: true
        },

        {
            name: "Date",
            selector: (row) => row.createdAt.substring(0, 10),
            sortable: true
        },

        {
            name: "Customer ID",
            selector: (row) => row.id,
            sortable: true
        },

        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true
        },

        {
            name: "Delete",
            cell: row => <button onClick={() => { deleteAction(row._id) }} className="btn">Delete</button>
        },

    ]

    // search button
    useEffect(() => {
        const results = refunds.filter(refunds => {
            return refunds.createdAt.substring(0, 10).toLowerCase().match(searchRefunds.toLowerCase());
        });


        setFilterdRefunds(results);
        localStorage.setItem('filteredRefunds', JSON.stringify(results));

        const filteredRefunds = JSON.parse(localStorage.getItem('filteredRefunds'));
        let totalRefunds = 0;

        if (filteredRefunds.length > 0) {
            startDate = filteredRefunds[0].createdAt.substring(0, 10);
          }

        for (let i = 0; i < filteredRefunds.length; i++) {
            totalRefunds += filteredRefunds[i].refundamount;
        }
        totRefunds = totalRefunds;
    }, [searchRefunds]);

    profit = totAmount - totRefunds;

    //delete function
    function deleteAction(refundid) {

        dispatch(deleteRefundTransactionAction(refundid));
    }








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

                    {/* Data table for sales details */}
                    <DataTable

                        title='Sales Details'
                        columns={columnsOrders}
                        data={filterdOrders}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="450px"
                        selectableRows
                        selectableRowsHighlight
                        subHeader
                        subHeaderComponent={
                            <input

                                type="text"
                                placeholder="Search YYYY-MM-DD"
                                className='w-25 form-control'
                                value={searchOrders}
                                onChange={(e) => setSearchOrders(e.target.value)}

                            />

                        }


                    />
                    <br />
                    <div className='modal-footer'>
                    </div>
                </div>



                {/* view model */}
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <h2 style={{ fontSize: '25px' }}>Transaction Details</h2>
                                <hr />
                                <p>Order Id : {orders._id}</p>
                                <p>Customer Id : {orders.userid}</p>
                                <p>Email : {orders.email}</p>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn " data-bs-dismiss="modal">Close</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br />
            <br />
            <br />


            <div className='row justify-content-center'>

                <div className='col-md-9 m-3   p-0 ' >


                    {/* Data table for refund transaction details */}
                    <DataTable

                        title='Refund Transactions'
                        columns={columnsRefunds}
                        data={filterdRefunds}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="450px"
                        selectableRows
                        selectableRowsHighlight
                        subHeader
                        subHeaderComponent={
                            <input

                                type="text"
                                placeholder="Search YYYY-MM-DD"
                                className='w-25 form-control'
                                value={searchRefunds}
                                onChange={(e) => setSearchRefunds(e.target.value)}

                            />

                        }


                    />
                    <br />
                    {/* generate report button */}
                    <div className='modal-footer'>
                        <div className='p-1'><button class="btn" data-bs-target="#exampleModalToggleReport" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-file" aria-hidden="true"></i> Generate Financial Status Report</button>
                        </div>
                    </div>

                    {/* report model */}

                    <div class="modal fade" id="exampleModalToggleReport" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                        <div class="modal-dialog modal-lg modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <img src="https://static.wixstatic.com/media/618c8c_e709bfc77cc844ec89f41c021d154a04~mv2.png" alt="" width="80" height="50" class="d-inline-block align-text-top" />
                                    <h9 className="text-center m-4" style={{ fontSize: '15px' }}>Hungry Meals Restaurants<br /></h9>
                                    <h9 className="text-center m-4" style={{ fontSize: '15px' }}>No.100,Galle Road,Matara<br /></h9>
                                    <h9 className="text-center m-4" style={{ fontSize: '15px' }}>Hotline :0777225900<br /></h9>

                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                                </div>
                                <div class="modal-body">

                                    <div class="container my-4">

                                        <div class="border p-5 mb-5">
                                            <h5 class="modal-title" id="exampleModalToggleLabel">Financial Status Report of the day</h5><br />
                                            <section>
                                                <div class="row">
                                                    <div class="col-lg-6 col-md-6 mb-4">
                                                        <div class="card">
                                                            <div class="card-body shadow shadow" >
                                                                <p class="text-uppercase small mb-2">
                                                                    <strong>Total Income <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                                </p>
                                                                <h5 class="mb-0">
                                                                    <strong>Rs.{totAmount}</strong>
                                                                    <small class="text-success ms-2">
                                                                        <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                                </h5>

                                                                <hr />


                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div class="col-lg-6 col-md-6 mb-4">
                                                        <div class="card">
                                                            <div class="card-body shadow">
                                                                <p class="text-uppercase small mb-2">
                                                                    <strong>Total Refunds <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                                </p>
                                                                <h5 class="mb-0">
                                                                    <strong>Rs.{totRefunds}</strong>
                                                                    <small class="text-success ms-2">
                                                                        <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                                </h5>

                                                                <hr />

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-12 col-md-6 mb-4">
                                                        <div class="card">
                                                            <div class="card-body shadow">
                                                                <p class="text-uppercase small mb-2">
                                                                    <strong><h1>Profit of the day</h1><i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                                </p>
                                                                <h5 class="mb-0">
                                                                    <strong>Rs.{profit}</strong>
                                                                    <small class="text-success ms-2">
                                                                        <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                                </h5>

                                                                <hr />

                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </section>

                                            <section>
                                                <div class="row">
                                                    <div class="col-md-8 mb-4">
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
            </div>
        </div>


    )
}