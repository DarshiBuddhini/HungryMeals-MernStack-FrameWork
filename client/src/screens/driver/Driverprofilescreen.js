import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios";
import 'bootstrap'
import 'bootstrap/js/dist/modal'; // Import the Bootstrap modal JavaScript code



export default function Driverprofilescreen() {


  const [delivery, setDelivery] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [averageEarnings, setAverageEarnings] = useState(0);
  const [numDeliveries, setNumDeliveries] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [topEarningDelivery, setTopEarningDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [totalEarningsToday, setTotalEarningsToday] = useState(0);


  const dispatch = useDispatch()

  const userstate = useSelector(state => state.driverloginReducer)
  const { currentDriver } = userstate

  console.log(currentDriver)

  useEffect(() => {
    function getdeliveries() {
      axios
        .get('/api/delivery/getalldeliveries')
        .then((res) => {
          const allDeliveries = res.data;
          const deliveredDeliveries = allDeliveries.filter(
            (delivery) => delivery.driverName === currentDriver.name
          );
          setDeliveries(deliveredDeliveries);

          // Calculate report data
          const total = deliveredDeliveries.reduce((sum, delivery) => sum + delivery.amount, 0);
          const average = total / deliveredDeliveries.length;
          const successCount = deliveredDeliveries.filter((delivery) => delivery.isdelivered).length;
          const successPercentage = (successCount / deliveredDeliveries.length) * 100;
          const sortedDeliveries = [...deliveredDeliveries].sort((a, b) => b.amount - a.amount);
          const topEarning = sortedDeliveries.length > 0 ? sortedDeliveries[0] : null;
          const totalToday = deliveredDeliveries.reduce((sum, delivery) => {
            const deliveryDate = new Date(delivery.createdAt);
            const today = new Date();
            if (
              deliveryDate.getDate() === today.getDate() &&
              deliveryDate.getMonth() === today.getMonth() &&
              deliveryDate.getFullYear() === today.getFullYear()
            ) {
              return sum + delivery.amount;
            }
            return sum;
          }, 0);

          setTotalEarnings(total);
          setAverageEarnings(average);
          setNumDeliveries(deliveredDeliveries.length);
          setSuccessRate(successPercentage);
          setTopEarningDelivery(topEarning);
          setTotalEarningsToday(totalToday);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    getdeliveries();
  }, []);

  return (
    <div>

      <br />
      <br />
      <br />
      <br />
      <br />

      <h9 style={{ fontSize: '35px' }}>Driver Dashboard</h9>
      <br />




      <div className='row justify-content-center'>

        <div className='col-md-8 m-2 p-1 shadow p-3 mb-5 bg-white' style={{ backgroundColor: 'red', color: 'black', borderRadius: '15px' }}>

          <img src='https://static.vecteezy.com/system/resources/previews/002/002/403/large_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg' style={{ height: '150px', height: '150px' }} />



          <div>
            <h2 style={{ fontSize: '30px' }}>{currentDriver.name} <i className="fa fa-edit" style={{ fontSize: '15px' }} type="button" data-bs-toggle="modal" data-bs-target="#updatename" data-bs-whatever="@mdo" ></i></h2>
            <p>{currentDriver.email} <i className="fa fa-edit" style={{ fontSize: '13px' }} type="button" data-bs-toggle="modal" data-bs-target="#updateemail" data-bs-whatever="@mdo" ></i></p>

          </div>

          <p>

            {/* <a data-bs-toggle ="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                            <i class="fas fa-bell"></i>
                            <span class="badge rounded-pill badge-notification bg-danger">1</span>
                        </a> */}

            <button className="btn" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
              Notifications <i class="fas fa-bell"></i>
            </button>
          </p>
          <div class="collapse" id="collapseExample">
            <div class="card card-body">
              Welcome Back ! {currentDriver.email}
            </div>
          </div>
        </div>



      </div>



      <div className='row justify-content-center'>

        <div class="card col-md-4 m-4 shadow p-3 mb-5 bg-white" style={{ width: '20rem', borderRadius: '15px' }}>
          <img src="https://img.freepik.com/free-vector/way-concept-illustration_114360-1191.jpg?w=996&t=st=1674130196~exp=1674130796~hmac=b0d619d09a46b26135879a1cecba166a0b898b569479d7ad14c0d98857daacdb" class="card-img-top" alt="..." />
          <div class="card-body">
            <h4 class="card-title">Delivery Requests</h4>
            <p class="card-text"><br></br>
            </p>

            <br />
            <a href="/driver/requests" class="btn">See More</a>
          </div>
        </div>



        <div class="card col-md-4 m-4 shadow p-3 mb-5 bg-white " style={{ width: '20rem', borderRadius: '15px' }}>
          <img src="https://img.freepik.com/free-vector/young-investors-working-profit-dividend-revenue_74855-6143.jpg?t=st=1681902631~exp=1681903231~hmac=ff038c5a2ece04f3025e7ced5e3faf1b93cfecbba285ce3aefcc461f94725cf9" class="card-img-top" alt="..." />
          <div class="card-body">
            <br />

            <h4 class="card-title">Your Earnings</h4>
            <p class="card-text">
            </p>

            <br />

            <br />
            <a href="#" class="btn">See More</a>
          </div>
        </div>
      </div>

      <div className='row justify-content-center'>

        <div className='card col-md-3 m-3 shadow p-4 mb-6' style={{ borderRadius: '100px', height: '18rem', width: '20rem', backgroundColor: '#FAD02C!important' }}>
          <a href="#">
            <img src="https://www.pngall.com/wp-content/uploads/12/Delivery-Scooter-PNG-Images.png" class="card-img-top" alt="..." /></a>
          <div class="card-body">
            <h4 class="card-title">Delivery Reports</h4>
            <p class="card-text"></p>


            <button class="btn" data-bs-target="#exampleModalToggleReport" data-bs-toggle="modal" data-bs-dismiss="modal">
              <i style={{ fontSize: '15px', color: 'white' }} class="fa fa-file" aria-hidden="true"></i> Generate Admin Details Report
            </button>


          </div>
        </div>

      </div>

      {/* report model*/}

      <div class="modal fade" id="exampleModalToggleReport" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalToggleLabel">Driver Earnings Report</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

              <div class="container my-4">

                <div class="border p-5 mb-5">

                  <section>
                    <div class="row">
                      <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card">
                          <div class="card-body shadow">
                            <p class="text-uppercase small mb-2">
                              <strong>Driver Name</strong>
                            </p>
                            <h5 class="mb-0">
                              <strong>{currentDriver.name}</strong>
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card">
                          <div class="card-body shadow">
                            <p class="text-uppercase small mb-2">
                              <strong>Total Earnings</strong>
                            </p>
                            <h5 class="mb-0">
                              <strong>{totalEarnings}</strong>
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card">
                          <div class="card-body shadow">
                            <p class="text-uppercase small mb-2">
                              <strong>Average Earnings per Delivery</strong>
                            </p>
                            <h5 class="mb-0">
                              <strong>{averageEarnings}</strong>
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card">
                          <div class="card-body shadow">
                            <p class="text-uppercase small mb-2">
                              <strong>Number of Deliveries</strong>
                            </p>
                            <h5 class="mb-0">
                              <strong>{numDeliveries}</strong>
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card">
                          <div class="card-body shadow">
                            <p class="text-uppercase small mb-2">
                              <strong>Delivery Success Rate</strong>
                            </p>
                            <h5 class="mb-0">
                              <strong>{successRate}%</strong>
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card">
                          <div class="card-body shadow">
                            <p class="text-uppercase small mb-2">
                              <strong>Top Earning Delivery</strong>
                            </p>
                            <h5 class="mb-0">
                              <strong>{topEarningDelivery && topEarningDelivery.name}</strong>
                            </h5>

                          </div>
                        </div>
                      </div>

                    </div>
                  </section>

                  <hr />
                  <section>
                    <div class="row">
                      <div class="col-12">
                        <h5 class="mb-3">Deliveries</h5>
                        <table class="table">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Customer Name</th>
                              <th>Amount</th>
                              <th>Driver Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deliveries.map((delivery) => (
                              <tr key={delivery.orderId}>
                                <td>{delivery.orderId}</td>
                                <td>{delivery.customerName}</td>
                                <td>{delivery.amount}</td>
                                <td>{delivery.driverRate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  <hr />

                  <div class="row">
                    <div class="col-12">
                      <p class="mb-2">Total Earnings Today:</p>
                      <h5>{totalEarningsToday}</h5>
                    </div>
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





  )
}