export const getAllPruchaseReducer=(state={Purchase : []}, action) => {


    switch (action.type) 
    {
        case 'GET_ITEMS_REQUEST' : return {

            loading : true,
            ...state
        }
        case 'GET_ITEMS_SUCCESS' : return {

            loading : false,
            jobs : action.payload
        }
        case 'GET_ITREMS_FAILED' : return {

            error : action.payload,
            loading : false
        }

        default : return state
        
    }
}