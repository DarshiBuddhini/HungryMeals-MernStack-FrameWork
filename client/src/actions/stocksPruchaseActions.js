import axios from "axios";
import Swal from "sweetalert2";

// Get All Purchase
export const getallpurchases = () => async dispatch => {

    dispatch({ type: 'GET_PURCHASE_REQUEST' })


    try {

        const response = await axios.get('/api/stockspurchase/getallpurchases')
        console.log(response)
        dispatch({ type: 'GET_PURCHASE_SUCCESS', payload : response.data })

    } catch (error) {

        dispatch({ type: 'GET_PURCHASE_FAILED', payload : error })
    }

}

// Update All Purchase
export const updatePruchaseAction = (updatePurchase, PurchaseId) => async dispatch => {

    dispatch({ type: 'UPDATE_PURCHASE_REQUEST' })

    try {
    
        const response = await axios.put(`/api/stockspurchase/update/stockspurchase/${PurchaseId}`, updatePurchase)
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
            title: 'Purchase updated successfully!'
        })
       
        setTimeout(function () {
            window.location.reload('/admin/stockspurchase');
        }, 1500);
        console.log(response);
        
        dispatch({ type: 'UPDATE_PURCHASE_SUCCESS' })


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
            title: 'Purchase updated unsuccessfully!'
        })
        dispatch({ type: 'UPDATE_PURCHASE_FAILED', payload: error })
    }
}

// Delet All Purchase
export const deletePruchaseAction = (PurchaseId) => async dispatch => {

    dispatch({ type: 'DELETE_PURCHASE_REQUEST' })

    

    try {
        const response = await axios.delete(`/api/stockspurchase/delete/stockspurchase/${PurchaseId}`)

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
            title: 'Purchase deleted successfully'
        })

        setTimeout(function () {
            window.location.reload('/admin/stockspurchase');
        }, 1500);



        console.log(response);
        dispatch({ type: 'DELETE_PURCHASE_SUCCESS' })




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


// Add All Purchase
export const addPurchase = (purchase) => async dispatch => {

    dispatch({ type: 'PURCHASE_ADDED_REQUEST' })

    try {
        const response = await axios.post('/api/stockspurchase/post/stockspurchase', purchase)
        console.log(response);

        
        
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
            title: 'Purchase addded successfully'
        })
       
        setTimeout(function () {
            window.location.reload('/admin/stockspurchase');
        }, 1500);
        console.log(response);
        
        dispatch({ type: 'PURCHASE_ADDED_SUCCESS' })

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
            title: 'Purchase added unsuccessfully'
        })

        dispatch({ type: 'PURCHASE_ADDED_FAILED', payload: error })
    }
}