import axios from 'axios'
import Swal from "sweetalert2";





export const updateticketsAction = (updateticket,id) => async dispatch => {

    dispatch({ type: 'REPLY_SEND_REQUEST' })

    try {
        const response = await axios.put(`/api/tickets/update/${id}`, updateticket)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Reply send successfully!'
        })
       
        setTimeout(function () {
            window.location.reload('/tickets');
        }, 1500);
        console.log(response);
        
        dispatch({ type: 'REPLY_SEND_SUCCESS' })


    } catch (error) {

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'error',
            title: 'Reply send unsuccessfully!'
        })
        dispatch({ type: 'REPLY_SEND_FAILED', payload: error })
    }
}

export const deleteTicketAction = (TicketId) => async dispatch => {

    dispatch({ type: 'TICKET_DELETE_REQUEST' })


    try {
        const response = await axios.delete(`/api/tickets/delete/tickets/${TicketId}`)

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Ticket deleted successfully'
        })

        setTimeout(function () {
            window.location.reload('/admin/ticketsmanage');
        }, 1500);



        console.log(response);
        dispatch({ type: 'DELETE_TICKET_SUCCESS' })




    } catch (error) {

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'error',
            title: 'Unsuccessful Operation'
        })


        dispatch({ type: 'DELETE_OPERATION_FAILED', payload: error })
    }
}


export const TicketForm = (newTicket) => async dispatch => {

    dispatch({ type: 'TICKET_APPLICATION_SENDING' })

    try {
        const response = await axios.post('/api/tickets/post',newTicket )

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Ticket submitted successfully!'
        })
       
        console.log(response);
        dispatch({ type: 'TICKET_APPLICATION_SUCCESS' })
        setTimeout(function(){
            window.location.reload();
         }, 1500);

    } catch (error) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'error',
            title: 'Ticket subitted unsuccessfully!'
        })
        dispatch({ type: 'TICKET_APPLICATION_FAILED' + error, payload: error })
    }
}