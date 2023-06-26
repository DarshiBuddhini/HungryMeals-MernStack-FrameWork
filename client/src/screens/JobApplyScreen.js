import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { JobApplication } from './../actions/jobApplicantAction';

function JobApplyScreen() {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [address, setaddress] = useState('');
  const [phoneNo, setphoneNo] = useState('');
  const [jobCategory, setjobCategory] = useState('');

  const applicationstate = useSelector((state) => state.jobApplyReducer);
  const { error, loading, success } = applicationstate;

  const dispatch = useDispatch();

  function applyJob() {
    const newApplicant = {
      name,
      email,
      address,
      phoneNo,
      jobCategory,
    };

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhoneNo = /^\d{10}$/.test(phoneNo);

    if (
      name.trim().length !== 0 &&
      email.trim().length !== 0 &&
      address.trim().length !== 0 &&
      jobCategory.trim().length !== 0 &&
      isValidEmail &&
      isValidPhoneNo
    ) {
      dispatch(JobApplication(newApplicant));
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      if (!isValidEmail && !isValidPhoneNo) {
        Toast.fire({
          icon: 'error',
          title: 'Please enter a valid email and phone number!',
        });
      } else if (!isValidEmail) {
        Toast.fire({
          icon: 'error',
          title: 'Please enter a valid email!',
        });
      } else if (!isValidPhoneNo) {
        Toast.fire({
          icon: 'error',
          title: 'Please enter a valid phone number (10 digits)!',
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Please fill out all required fields!',
        });
      }
    }
  }


  return (


    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className='box col-md-5 m-2 p-5'>
        <h9 style={{ fontSize: '35px' }}>Job Application Form</h9>
        {/* <h2 class="h1-responsive font-weight-bold text-center my-4">Job Application Form</h2> */}
        <div class="row justify-content-center">

          <form class="row g-3">

            <div class="col-md-6">
              <label for="name" class="form-label">Full Name</label>
              <input type="text"
                class="form-control"
                id="inputname"
                value={name}
                onChange={(e) => { setname(e.target.value) }}
              ></input>
            </div>


            <div class="col-md-6">
              <label for="inputEmail4" class="form-label">Email</label>
              <input type="email"
                class="form-control"
                id="inputEmail4"
                value={email}
                onChange={(e) => { setemail(e.target.value) }}
              ></input>
            </div>


            <div class="col-12">
              <label for="inputAddress" class="form-label">Address</label>
              <input type="text"
                class="form-control"
                id="inputAddress"
                placeholder="1234 Main St"
                value={address}
                onChange={(e) => { setaddress(e.target.value) }}
              ></input>
            </div>


            <div class="col-md-6">
              <label for="inputphone" class="form-label">Mobile No</label>
              <input type="text"
                class="form-control" id="inputPhone"
                value={phoneNo}
                onChange={(e) => { setphoneNo(e.target.value) }}
              ></input>
            </div>


            <div class="col-md-4">
              <label for="inputState" class="form-label">Select Your Job Category</label>
              <select id="inputState" class="form-select" value={jobCategory} onChange={(e) => setjobCategory(e.target.value)}>
                <option selected>Choose...</option>
                <option value="Administrative">Administrative</option>
                <option value="General">General</option>
                <option value="Inventory">Inventory</option>
              </select>


            </div>
            <br />

          </form>
          <div class="col-12">
            <button type="submit" onClick={applyJob} class="btn ">Submit</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default JobApplyScreen