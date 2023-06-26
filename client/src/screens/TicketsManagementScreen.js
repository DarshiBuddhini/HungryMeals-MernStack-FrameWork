import React from 'react'
import axios from 'axios'
import DataTable from "react-data-table-component"
import Swal from 'sweetalert2';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { deleteTicketAction } from '../actions/ticketsActions';
import { updateticketsAction } from '../actions/ticketsActions';

let userId;
let ticketsEmail;
let totalTickets
let orderTicketsCount
let deliveryTicketsCount
let refundTicketsCount
let paymentTicketsCount

function TicketsManagementScreen() {


    const [tickets, setTickets] = useState([]);
    const [filterdTickets, setFilterdTickets] = useState([]);
    const [searchTicket, setSearchTicket] = useState("");



    useEffect(() => {
        function getTickets() {
            axios.get("/api/tickets/getallTickets")
                .then((res) => {
                    setTickets(res.data);
                    console.log(res.data);
                    setFilterdTickets(res.data);

                    const categoryCounts = res.data.reduce((counts, row) => {
                        const category = row.category;
                        counts[category] = (counts[category] || 0) + 1;
                        return counts;
                    }, {});

                    console.log(categoryCounts);

                    
                    console.log(ticketsEmail);
                    totalTickets = res.data.length;
                    console.log(`Total number of tickets: ${totalTickets}`);

                    orderTicketsCount = res.data.filter(ticket => ticket.category === 'Orders').length;
                    console.log(`Order Tickets: ${orderTicketsCount}`);

                    deliveryTicketsCount = res.data.filter(ticket => ticket.category === 'Delivery').length;
                    console.log(`Delivery Tickets: ${deliveryTicketsCount}`);

                    refundTicketsCount = res.data.filter(ticket => ticket.category === 'Refunds').length;
                    console.log(`Refunds Tickets: ${refundTicketsCount}`);

                    paymentTicketsCount = res.data.filter(ticket => ticket.category === 'Payments').length;
                    console.log(`Payments Tickets: ${paymentTicketsCount}`);

                    axios.put('/api/orders', { OrderCount: orderTicketsCount, DeliveryCount: deliveryTicketsCount })
                        .then(res => {
                            console.log('OrderCount and DeliveryCount updated successfully');
                        })
                        .catch(err => {
                            console.log(err.message);
                        });

                })
                .catch((err) => {
                    console.log(err.message);
                });
        }

        getTickets();
    }, []);







    function getAllTickets() {

        axios.get("/api/tickets/getallTickets").then((res) => {



        }).catch((err) => {
            console.log(err.message)

        })
    }





    const columns = [
        {
            name: "Ticket ID",
            selector: (row) => row._id,
            sortable: true
        },

        {
            name: "Ticket Title",
            selector: (row) => row.tickettitle,
            sortable: true,
        },
        {
            name: "Category",
            selector: (row) => row.category,

        },
        {
            name: "Description",
            selector: (row) => row.description,

        },
        {
            name: "Email",
            selector: (row) => row.email,

        },
        {
            name: "Telephone",
            selector: (row) => row.telephone,

        },

        //
        {
            name: "Read",
            cell: row => <button onClick={() => {
                Swal.fire({
                    title: row.category,
                    html: `<b><u>Ticket Title:</u></b></u><br> ${row.title},<br><b><u>Description:</u></b></u><br> ${row.description},

                   
                    <br><b><u>Telephone:</u></b></u><br> ${row.telephone}`,

                    confirmButtonText: "Close",
                })
            }} className="btn" role="button">Read</button>
        }
        ,
        {
            name: "Reply",
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
                    Reply
                </button>
            )
        }

        ,
        {
            name: "UpdateDB",
            cell: row => <button onClick={() => { getAllTickets(userId = row._id) }} className="btn" data-bs-toggle="modal" data-bs-target="#replymsg" role="button">updateDB</button>

        },

        {
            name: "Delete",
            cell: row => <button onClick={() => { deleteTicket(row._id) }} className="btn" role="button">Delete</button>


        },



    ]

    // search button
    useEffect(() => {
        const results = tickets.filter(tickets => {
            return tickets.category.toLowerCase().match(searchTicket.toLowerCase());
        });

        setFilterdTickets(results);
    }, [searchTicket]);


    //delete
    const dispatch = useDispatch();

    function deleteTicket(TicketId) {

        dispatch(deleteTicketAction(TicketId));


    }

    //reply - update

    const [reply, updateTickets] = useState('')

    function updateReplyMsg(userId) {

        const updateTickets = {

            reply,

        }

        console.log(updateTickets, userId)
        dispatch(updateticketsAction(updateTickets, userId))


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
                    <DataTable

                        title='Tickets Management'
                        columns={columns}
                        data={filterdTickets}
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
                                value={searchTicket}
                                onChange={(e) => setSearchTicket(e.target.value)}

                            />

                        }


                    />
                    <br />
                    <br />

                    {/* generate report button */}
                    <div className='p-1'><button class="btn" data-bs-target="#exampleModalToggleReport" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-file" aria-hidden="true"></i> Generate  Report</button>
                    </div>

                </div>
            </div>

            {/* generate report */}

            <div class="modal fade" id="exampleModalToggleReport" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalToggleLabel"> Detailed Report -Tcket Management</h5>
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
                                                            <strong>PAYMENT TICKECTS <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }} ></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{paymentTicketsCount}</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />

                                                        {/* <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p> */}
                                                        {/* <h5 class="text-muted mb-0">11 467</h5> */}
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>Order Tickets<i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{orderTicketsCount}</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />
                                                        {/* <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p> */}

                                                        {/* <h5 class="text-muted mb-0">38 454</h5> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>DELIVERY TICKETS <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{deliveryTicketsCount}</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />
                                                        {/* <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p> */}

                                                        <h5 class="text-muted mb-0"></h5>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>REFUND TICKETS <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{refundTicketsCount}</strong>
                                                            <small class="text-danger ms-2">
                                                                <i class="fas fa-arrow-down fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />

                                                        {/* <p class="text-uppercase text-muted small mb-2">
                                                            Previous period
                                                        </p> */}
                                                        <h5 class="text-muted mb-0"></h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div class="row">
                                            

                                            <div class="col-md-4 mb-4">
                                                <div class="card mb-4">
                                                    <div class="card-body shadow">
                                                        <p class="text-center"><strong>TOTAL TICKETS</strong></p>
                                                        <div id="pie-chart-current">{totalTickets}</div>
                                                    </div>
                                                </div>

                                                {/* <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-center"><strong>Previous period</strong></p>
                                                        <div id="pie-chart-previous">0</div>
                                                    </div>
                                                </div> */}
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




            {/* Reply Message */}

            <div class="modal fade" id="replymsg" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Detailed Infor</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <p>Message</p>

                            <textarea
                                class="form-control"
                                id="exampleFormControlTextarea1"
                                rows="10"
                                placeholder='Enter your message...'
                                value={reply}
                                onChange={(e) => { updateTickets(e.target.value) }}
                                style={{ fontSize: '16px', fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                            >
                            </textarea>

                        </div>
                        <div class="modal-footer">
                            <button onClick={() => updateReplyMsg(userId, updateReplyMsg)} type="button" class="btn ">Send</button>
                            <button type="button" class="btn " data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TicketsManagementScreen