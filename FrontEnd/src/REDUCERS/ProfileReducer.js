const initState = {};

const ProfileReducer = (state = initState, action) => {
  if (action.type === "UPDATE") {
    return {
      ...state,
      ...action.data
    };
  }

  if(action.type === "LATESTCHATS"){
    return {
      ...state,
      LatestChats: action.stutas
    };  
  }

  return initState;
};

export default ProfileReducer;
