const initState = {};
  

  const ProfileReducer = (state = initState, action) => {

    if (action.type === "UPDATE") {
       return { 
         ...state, 
         ...action.data
        }; 
    } 

    return initState
  };
  
  export default ProfileReducer