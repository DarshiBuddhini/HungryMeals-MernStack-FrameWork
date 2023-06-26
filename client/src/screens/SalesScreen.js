import React from 'react'
import axios from 'axios'
import DataTable from "react-data-table-component"
import Swal from 'sweetalert2';
//import { Modal } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getUserOrders } from '../actions/orderActions'
import { updateStatus, updateStatusAction } from "../actions/salesActions";

let salesid;
let totAmount;
let orderCount;
let orderArray;
let orderItemArray;
let startDate;
let finishDate;

export default function SalesScreen() {

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
            return order.createdAt.substring(5, 8).toLowerCase().match(searchOrders.toLowerCase());
        });

        setFilterdOrders(results);
        localStorage.setItem('filteredOrders', JSON.stringify(results));

        const filteredOrders = JSON.parse(localStorage.getItem('filteredOrders'));
        let totalAmount = 0;
       

        if (filteredOrders.length > 0) {
            startDate = filteredOrders[0].createdAt.substring(0, 10);
            finishDate = filteredOrders[filteredOrders.length - 1].createdAt.substring(0, 10);
          }

        

        for (let i = 0; i < filteredOrders.length; i++) {
            totalAmount += filteredOrders[i].orderAmount;
        }
        totAmount = totalAmount;

        

       
        // console.log('Total amount:', totalAmount)

        

    }, [searchOrders]);

    const dispatch = useDispatch();




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
                                placeholder="Search Month..."
                                className='w-25 form-control'
                                value={searchOrders}
                                onChange={(e) => setSearchOrders(e.target.value)}

                            />

                        }


                    />
                    <br />
                    <div className='modal-footer'>
                        <div className='p-1'><button class="btn" data-bs-target="#exampleModalToggleReport" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-file" aria-hidden="true"></i> Generate Monthly Sales Report</button>
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
                                        <h5 class="modal-title" id="exampleModalToggleLabel">Monthly Sales Report</h5><br/>
                                            <section>
                                                <div class="row">
                                                    <div class="col-lg-6 col-md-6 mb-4">
                                                        <div class="card">
                                                            <div class="card-body shadow shadow" >
                                                                <p class="text-uppercase small mb-2">
                                                                    <strong><h1>No of Orders</h1> <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }} ></i></strong>
                                                                </p>
                                                                <h5 class="mb-0">
                                                                    <strong>{orderCount}</strong>
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
                                                                    <strong><h1>Total Income </h1><i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
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
                                                </div>
                                            </section>

                                            <section>
                                                <div class="row">
                                                    <div class="col-md-8 mb-4">
                                                        
                                                    </div>

                                                    <div class="col-md-8 mb-4">
                                                        <div class="card mb-4 ">
                                                            <div class="card-body shadow">
                                                                <p class="text-center"><strong>From</strong></p>
                                                                <div id="pie-chart-current">{startDate}</div>
                                                            </div>
                                                        </div>

                                                        <div class="card">
                                                            <div class="card-body shadow">
                                                                <p class="text-center"><strong>To</strong></p>
                                                                <div id="pie-chart-previous">{finishDate}</div>
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

        </div>
    )
}