import { AnyAction, Reducer } from 'redux';
import ACTIONS from './actionTypes';
// import { updateObject } from '../../utils/utility';

const initialState = {
  project : null,
  project: null,
  projects: null,
  teamMembers: null,
  address: "",
  postResponseData: {},
  snackBar: {
  open: true,
  message: "Email invite sent",
  severity: "success", 
  },
  modalToggles : {
    signUp: false,
    projectModal: false,
    infoModal: false,

  },
  fileExplorer: {
    sort: null,
    filter: null,
    path: null,
    fileStructure: null,
    items: null,
    unmutatedItems: null,
    file: null,
  },


};

const reducer = (state = initialState, action ) => {

  switch (action.type) {
    case ACTIONS.GET_API_DATA: return {
      ...state,
      fakeDataList: action.payload,
    };
    case ACTIONS.POST_API_DATA: return {
      ...state,
      postResponseData: action.payload,
    };
    default: return state;
  }
};

export default reducer;