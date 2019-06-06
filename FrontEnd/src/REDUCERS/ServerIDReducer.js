const initState = {};
  

  const ServerIDReducer = (state = initState, action) => {

    if (action.type === "SERVERID") {
       return { 
         ...state, 
         ...action.data
        }; 
    } 

    return initState
  };
  
  export default ServerIDReducer