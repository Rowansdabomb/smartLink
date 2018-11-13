import { WSASERVICE_NOT_FOUND } from "constants";

const defaultState = {
  url: null,
  index: 0,
  attributes: [],
  dataIndex: 0,
  data: {
    0:{
      attributes: [],
      index: 0,
      url: null,
      dataIndex: 0
    },
    length: 1
  }
}

const attributes = (state=defaultState, action) => {
  Object.prototype.isEmpty = function() {
    for(var key in this) {
        if(this.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  switch (action.type) {
    case 'ADD-ATTRIBUTE':
      console.log('ADD-ATTRIBUTE')
      return {
        ...state,
        attributes: [...state.attributes.concat([action.attributes.concat(state.index)])],
        index: state.index + 1,
        url: action.url
      }
    case 'REMOVE-ATTRIBUTE':
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'REMOVE-ATTRIBUTE', index: action.index});
      });
      console.log('REMOVE-ATTRIBUTE')

      return {
        ...state,
        attributes: [...state.attributes.filter((val, i) => val[val.length - 1] !== action.index)],
      }
    case 'SET-ATTRIBUTES':
      // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      //   chrome.tabs.sendMessage(tabs[0].id, {type: 'SET-ATTRIBUTES'});
      // });
      return {
        ...state,
        attributes: action.attributes,
        index: action.attributes.length - 1,
        url: action.url
      }
    case 'UPDATE-URL':
      // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      //   chrome.tabs.sendMessage(tabs[0].id, {type: 'TAB-CHANGED', currentTabId: tabs[0].id});
      // });
      console.log('UPDATE-URL')
      return {
        ...state,
        url: action.url
      }
    case 'LOAD-ATTRIBUTES':

      // LOAD DATA
      // // find index of attribute to load
      //   if found
      //     load pageDAta from index
      //   else 
      //     load default pageData
      // SAVE DATA
      //   if current data should be stored
      //     find index of current attributes
      //       if  found
      //         update data
      //       else
      //         append current data



      // First save current attributes then load 
      // or create attributes for new url
      console.log(' ');
      console.log('LOAD-ATTRIBUTES ', action.url)

      // initialize loadData as empty
      let loadData = {...defaultState.data['0']}
      let saveData = {...defaultState.data}
      let saveDataUpdated = false

      let tempIndex = 0
      // if there is something to load, load it
      if (!state.data.isEmpty()) {
        for(let key in state.data) {
          let data = state.data[key]
          
          if(key === 'length')
            // nothing to load
            break

          if(data['url'] === action.url) {
            console.log("LOAD URL MATCH")
            loadData = {
              ...state.data[key],  
              attributes: [...state.data[key].attributes],
              index: state.data[key].index,
              url: action.url,
              dataIndex: state.data[key].dataIndex
            }
          } 

          if(data['url'] === state.url && state.url !== null){
            console.log("SAVE URL MATCH", state.url, data['url'])
            if (state.url !== null) {
              console.log('SAVE EXISTING')
              saveData = {
                ...state.data,
                [tempIndex]: {
                  ...state.data[tempIndex],
                  attributes: [...state.attributes],
                  index: state.index,
                  url: state.url,
                  dataIndex: tempIndex
                }
              }
              saveDataUpdated = true
            }
          }
          tempIndex += 1
        }
      }
      // if something to save, but not yet in data
      if (state.url !== null && !saveDataUpdated) {
        console.log('SAVE NEW')
        saveData = {
          ...state.data,
          [tempIndex]: {
            ...state.data[tempIndex],
            attributes: [...state.attributes],
            index: state.index,
            url: state.url,
            dataIndex: tempIndex
          }
        }
      }

      // console.log('loadData', loadData)
      // console.log('saveData', saveData)

      if (state.attributes.length > 0 !== null) {
        return {
          ...state,
          attributes: [...loadData.attributes],
          index: loadData.index,
          url: loadData.url,
          // data: {...newData}
          data: {
            ...state.data, 
            // [saveData.dataIndex]: {
              // ...state.data[saveData.dataIndex],
              ...saveData
            // }
          }
        }
      } else {
        return {
          ...state,
          attributes: [...loadData.attributes],
          index: loadData.index,
          url: loadData.url
        }
      }

      // case 'SAVE-ATTRIBUTES':
    case 'RESET-ATTRIBUTES':
      // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      //   chrome.tabs.sendMessage(tabs[0].id, {type: 'RESET-ATTRIBUTES'});
      // });
      console.log('RESET-ATTRIBUTES')
      
      return {
        ...state,
        attributes: [],
        index: 0,
        url: action.url,
        // data: {...defaultState.data['0']}
      }
  }
  return state
}

export default attributes;