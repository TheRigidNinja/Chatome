const initState = {};

const MessagingReducer = (state = initState, action) => {
  if (action.type === "KEY") {
    return {
      ...state,
      ...action.data
    };
  }else if(action.type === "LATESTCHATS"){
    
    return {
      ...state,
      LatestChats: action.data
    };  
  }

  return initState;
};

export default MessagingReducer;
