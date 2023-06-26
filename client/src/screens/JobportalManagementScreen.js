import React from 'react'
import axios from 'axios'
import DataTable from "react-data-table-component"
import Swal from 'sweetalert2';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { updateJobsAction } from './../actions/jobportalAction';
import { addJob, deleteJobAction, getAllJobs } from './../actions/jobportalAction';

var jobDescriptions, jobsalary, joblocation;
let jobId;
let jobsCount;
let jobsArray;
let administrativeCount;
let inventoryCount;
let generalCount;
let PercentageAd, PercentageGen, PercentageIn;


function JobportalManagementScreen() {






    const [jobs, setJobs] = useState([]);
    const [filterdJobs, setFilterdJobs] = useState([]);
    const [searchJobs, setSearchJobs] = useState("");




    function createjob() {
        // Validate the input fields
        if (!JobTitle || !JobDescription || !Salary || !Location || !Category) {
            Swal.fire('Error', 'Please fill in all the required fields', 'error');
            return;
        }

        // Create a new job object
        const newJob = {
            jobtitle: JobTitle,
            description: JobDescription,
            salary: Salary,
            location: Location,
            category: Category,
        };

        // Add the new job to the database using Redux action
        dispatch(addJob(newJob));

        // Show success message and reset the input fields
        //Swal.fire('Success', 'New job added successfully', 'success');
        setJobTitle('');
        setJobDescription('');
        setSalary('');
        setLocation('');
        setCategory('');
    }

    // useEffect(() => {

    //     function getJobs() {

    //         axios.get("/api/jobportal/getalljobs").then((res) => {
    //             setJobs(res.data);
    //             console.log(res.data)

    //             //calculations
    //             jobsArray = res.data;
    //             jobsCount = jobsArray.length;

    //             setFilterdJobs(res.data);


    //         }).catch((err) => {
    //             console.log(err.message)

    //         })
    //     }

    //     getJobs();

    // }, [])


    useEffect(() => {
        function getJobs() {
            axios.get("/api/jobportal/getalljobs")
                .then((res) => {
                    setJobs(res.data);

                    // Filter applicants by job category and count the number of applicants in each category
                    administrativeCount = res.data.filter(jobs => jobs.category === 'Administrative').length;
                    inventoryCount = res.data.filter(jobs => jobs.category === 'Inventory').length;
                    generalCount = res.data.filter(jobs => jobs.category === 'General').length;

                    console.log(`Administrative applicants: ${administrativeCount}`);
                    console.log(`Inventory applicants: ${inventoryCount}`);
                    console.log(`General applicants: ${generalCount}`);



                    //calculations
                    jobsArray = res.data;
                    jobsCount = jobsArray.length;

                    PercentageAd = (administrativeCount / jobsCount) * 100;
                    PercentageIn = (inventoryCount / jobsCount) * 100;
                    PercentageGen = (generalCount / jobsCount) * 100;


                    setFilterdJobs(res.data);
                })
                .catch((err) => {
                    console.log(err.message)
                });
        }

        getJobs();
    }, []);



    function jobdetails(JobId) {


        axios.get("/api/jobportal/getalljobs").then((res) => {

            setJobs(res.data);
            console.log(JobId)
            //console.log(res.data)


            for (let index = 0; index < res.data.length; index++) {

                if (res.data[index]._id === JobId) {
                    //console.log(res.data[index].subject)

                    //console.log(res.data[index].message)
                    jobDescriptions = res.data[index].description
                    jobsalary = res.data[index].salary
                    joblocation = res.data[index].location

                }
            }



        }).catch((err) => {
            console.log(err.message)

        })
    }


    function getCurrentJobs(jobId) {

        axios.get(`/api/jobportal/getcurrentjobs/${jobId}`).then((res) => {


            setJobs(res.data);
            jobs = res.data
            console.log(jobs)


        }).catch((error) => {
            console.log(error)


        })
    }


    //create data table
    const columns = [
        // {
        //     name: "Job ID",
        //     selector: (row) => row._id,
        //     sortable: true
        // },

        {
            name: "Job Title",
            selector: (row) => row.jobtitle,
            sortable: true,
        },
        {
            name: "Category",
            selector: (row) => row.category,

        },

        // {
        //     name: "Job Details",
        //     cell: row => <button  className="btn" data-bs-toggle="modal" href="#exampleModal" role="button">View</button>

        // },
        {
            name: "Job Details",
            cell: row => <button onClick={() => { jobdetails(row._id) }} className="btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" role="button">View</button>

        },
        {
            name: "Update",
            cell: row => <button onClick={() => { getCurrentJobs(jobId = row._id) }} className="btn" data-bs-toggle="modal" href="#exampleModalToggleUpdate" role="button">Update</button>

        },
        {
            name: "Delete",
            cell: row => <button onClick={() => { deleteJob(row._id) }} className="btn" role="button">Delete</button>


        },


    ]


    // search button
    useEffect(() => {
        const results = jobs.filter(jobs => {
            return jobs.jobtitle.toLowerCase().match(searchJobs.toLowerCase());
        });

        setFilterdJobs(results);
    }, [searchJobs]);


    //delete
    const dispatch = useDispatch();

    function deleteJob(JobId) {

        dispatch(deleteJobAction(JobId));


    }


    const [JobTitle, setJobTitle] = useState('')
    const [JobDescription, setJobDescription] = useState('')
    const [Salary, setSalary] = useState('')
    const [Location, setLocation] = useState('')
    const [Category, setCategory] = useState('')

    const [jobtitle, updateJobtitile] = useState(jobs.jobtitle)
    const [category, updateCategory] = useState(jobs.category)
    const [description, updateDescription] = useState(jobs.description)
    const [salary, updateSalary] = useState(jobs.salary)
    const [location, updateLocation] = useState(jobs.location)


    function updateforJobs(jobId) {


        const updateJobs = {

            jobtitle,
            category,
            description,
            salary,
            location

        }


        dispatch(updateJobsAction(updateJobs, jobId))





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

                        title='Job Portal Management'
                        columns={columns}
                        data={filterdJobs}
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
                                value={searchJobs}
                                onChange={(e) => setSearchJobs(e.target.value)}

                            />

                        }


                    />
                    <br />
                    <br />
                    <div className='modal-footer'>
                        <div className='p-1'>
                            <button class="btn" data-bs-target="#addnewjob" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-plus" aria-hidden="true"></i>Create a New Job</button>
                        </div>

                        {/* generate report button */}
                        <div className='p-1'><button class="btn" data-bs-target="#exampleModalToggleReport" data-bs-toggle="modal" data-bs-dismiss="modal"><i style={{ fontSize: '15px', color: 'white' }} class="fa fa-file" aria-hidden="true"></i> Generate  Report</button>
                        </div>
                        <br />
                        <div className='p-1'>
                            <a href="/admin/jobApplicantManage" class="btn">
                                <i style={{ fontSize: '15px', color: 'white' }} aria-hidden="true"></i>Go to Job Applicants page
                            </a>
                        </div>

                    </div>
                </div>
            </div>



            {/* create jobs modal */}
            <div class="modal fade" id="addnewjob" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="updateemailLabel">Create New Job</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <form>


                                <div class="mb-3">
                                    <label for="job-name" class="col-form-label">Job Title:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="job-name"
                                        value={JobTitle}
                                        onChange={(e) => { setJobTitle(e.target.value) }}

                                    />
                                </div>


                                <div class="mb-3">
                                    <label for="desc" class="col-form-label">Description:</label>
                                    <textarea

                                        required

                                        class="form-control"
                                        id="desc"
                                        value={JobDescription}
                                        onChange={(e) => { setJobDescription(e.target.value) }}

                                    />
                                </div>


                                <div class="mb-3">
                                    <label for="customer-password" class="col-form-label">Salary:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="customer-password"
                                        value={Salary}
                                        onChange={(e) => { setSalary(e.target.value) }}

                                    />
                                </div>

                                <div class="mb-3">
                                    <label for="customer-cpassword" class="col-form-label">Location:</label>
                                    <input

                                        required
                                        type="text"
                                        class="form-control"
                                        id="customer-cpassword"
                                        value={Location}
                                        onChange={(e) => { setLocation(e.target.value) }}

                                    />
                                </div>


                                <div class="mb-3">
                                    <label for="category" class="col-form-label">Category:</label>
                                    <select id="inputState"

                                        class="form-select"
                                        value={Category}
                                        onChange={(e) => setCategory(e.target.value)}>
                                        <option selected>Choose...</option>
                                        <option value="Administrative">Administrative</option>
                                        <option value="General">General</option>
                                        <option value="Inventory">Inventory</option>
                                    </select>


                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">

                            <button onClick={createjob} type="button" class="btn ">Post Job</button>
                            <button type="button" class="btn " data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>


            {/* view job details model */}


            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Detailed Information</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Job Description</p>
                            <p className='text-muted'>{jobDescriptions}</p>
                            <p>Salary</p>
                            <p className='text-muted'>{jobsalary}</p>

                            <p>Location</p>

                            <p className='text-muted'>{joblocation}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn " data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>


            {/* Model 2 - Update */}
            <div class="modal fade" id="exampleModalToggleUpdate" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">

                    <div class="modal-content">



                        <div class="modal-header">


                            <h5 class="modal-title" id="exampleModalToggleLabel">
                                <h20>Edit Job Portal</h20>


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
                                                {/* <label for="exampleFormControlTextarea1"><h20>Image Link</h20></label> */}
                                                <textarea
                                                    class="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    rows="10"
                                                    placeholder='Enter Title'
                                                    value={jobtitle || jobs.jobtitle}
                                                    onChange={(e) => { updateJobtitile(e.target.value) }}
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
                                            <label>Edit Job Category</label>
                                            <input
                                                class="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter Category'
                                                value={category || jobs.category}
                                                onChange={(e) => { updateCategory(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                            >

                                            </input>

                                        </div>
                                        <div class="form-group">
                                            <br />
                                            <label>Edit Location</label>

                                            <input
                                                class="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="1"
                                                placeholder='Enter Location'
                                                value={location || jobs.location}
                                                onChange={(e) => { updateLocation(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                            >

                                            </input>

                                        </div>
                                        <br></br>
                                        <div class="form-group">
                                            <textarea
                                                class="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="3"
                                                placeholder='Enter Salary'
                                                value={salary || jobs.salary}
                                                onChange={(e) => { updateSalary(e.target.value) }}
                                                style={{ fontSize: '20px', fontFamily: 'Signika Negative,sans-serif', color: "#670001", fontWeight: "bold" }}
                                            >

                                            </textarea>
                                        </div>
                                        <br></br>
                                        <div class="form-group">
                                            <textarea
                                                class="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="20"
                                                placeholder='Enter Description'
                                                value={description || jobs.description}
                                                onChange={(e) => { updateDescription(e.target.value) }}
                                                style={{ fontFamily: 'Mukta, calibri', color: "#6c757d", fontStyle: "italic", fontSize: "15px" }}
                                            >

                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button onClick={() => updateforJobs(jobId, updateforJobs)} type="button" class="btn ">Update</button>
                        </div>

                    </div>
                </div>
            </div>


            {/* generate report */}

            <div class="modal fade" id="exampleModalToggleReport" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <img src="https://static.wixstatic.com/media/618c8c_e709bfc77cc844ec89f41c021d154a04~mv2.png" alt="" width="80" height="50" class="d-inline-block align-text-top" />                            <h9 className="text-center m-4" style={{ fontSize: '15px' }}>Hungry Meals Restaurants<br /></h9>
                            <h9 className="text-center m-4" style={{ fontSize: '15px' }}>No.100,Galle Road,Matara<br /></h9>
                            <h9 className="text-center m-4" style={{ fontSize: '15px' }}>Hotline :0777225900<br /></h9>

                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">

                            <div class="container my-4">

                                <div class="border p-5 mb-5">

                                    <section>
                                        <div class="modal-header">

                                            <h5 class="modal-title" id="exampleModalToggleLabel">Job Portal Detailed Report</h5>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow shadow" >

                                                        <p class="text-uppercase small mb-2">
                                                            <strong>ACTIVE JOB VACANCIES <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }} ></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{jobsCount}</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />
                                                        <p class="text-uppercase text-muted small mb-2">Recent Updates </p>

                                                    </div>
                                                </div>

                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>Administrative Jobs <i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{administrativeCount}</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />
                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Recent Updates
                                                        </p>

                                                        {/* <h5 class="text-muted mb-0">38 454</h5> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>General Job Vacancies<i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{generalCount}</strong>
                                                            <small class="text-success ms-2">
                                                                <i class="fas fa-arrow-up fa-sm pe-1"></i></small>
                                                        </h5>

                                                        <hr />
                                                        <p class="text-uppercase text-muted small mb-2">
                                                            Recent Updates</p>

                                                        <h5 class="text-muted mb-0"></h5>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-6 mb-4">
                                                <div class="card">
                                                    <div class="card-body shadow">
                                                        <p class="text-uppercase small mb-2">
                                                            <strong>Inventory<i class="fa-solid fa-circle fa-fade" style={{ fontSize: '13px', color: 'red' }}></i></strong>
                                                        </p>
                                                        <h5 class="mb-0">
                                                            <strong>{inventoryCount}</strong>

                                                        </h5>

                                                        <hr />

                                                        <p class="text-uppercase text-muted small mb-2">Recent Updates
                                                        </p>
                                                        <h5 class="text-muted mb-0"></h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    <div class="col-md-4 mb-4">
                                        <div class="card mb-4">
                                            <div class="card-body shadow">
                                                <p class="text-center"><strong></strong></p>
                                                <div id="pie-chart-current">Percentage of Administrative</div>
                                                <div id="pie-chart-previous">{PercentageAd}%</div>
                                            </div>
                                        </div>

                                        <div class="card">
                                            <div class="card-body shadow">
                                                <p class="text-center"><strong>Percentage of General</strong></p>
                                                <div id="pie-chart-previous">{PercentageGen}%</div>
                                            </div>
                                        </div>

                                        <div class="card">
                                            <div class="card-body shadow">
                                                <p class="text-center"><strong>Percentage of Inventory </strong></p>
                                                <div id="pie-chart-previous">{PercentageIn}%</div>
                                            </div>
                                        </div>
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
    )
}

export default JobportalManagementScreen