import axios from "axios";
import Swal from "sweetalert2";
//update item//
export const updateItemAction = (updateItem, ItemId) => async dispatch => {

    dispatch({ type: 'UPDATE_ITEM_REQUEST' })

    try {
    
        const response = await axios.put(`/api/stocks/update/stocks/${ItemId}`, updateItem)
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
            title: 'Item updated successfully!'
        })
       
        setTimeout(function () {
            window.location.reload('/admin/stocksmanage');
        }, 1500);
        console.log(response);
        
        dispatch({ type: 'UPDATE_ITEM_SUCCESS' })


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
            title: 'Item updated unsuccessfully!'
        })
        dispatch({ type: 'UPDATE_ITEM_FAILED', payload: error })
    }
}

//delet item//
export const deleteItemAction = (ItemId) => async dispatch => {

    dispatch({ type: 'ITEM_DELETE_REQUEST' })

    

    try {
        const response = await axios.delete(`/api/stocks/delete/stocks/${ItemId}`)

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
            title: 'Item deleted successfully'
        })

        setTimeout(function () {
            window.location.reload('/admin/stocksmanage');
        }, 1500);



        console.log(response);
        dispatch({ type: 'DELETE_ITEM_SUCCESS' })




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

//add item//
export const addItem = (item) => async dispatch => {

    dispatch({ type: 'ITEM_ADDED_REQUEST' })

    try {
        const response = await axios.post('/api/stocks/post/stocks', item)
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
            title: 'Item addded successfully'
        })
       
        setTimeout(function () {
            window.location.reload('/admin/stocksmanage');
        }, 1500);
        console.log(response);
        
        dispatch({ type: 'ITEM_ADDED_SUCCESS' })

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
            title: 'Item added unsuccessfully'
        })

        dispatch({ type: 'ITEM_ADDED_FAILED', payload: error })
    }
}