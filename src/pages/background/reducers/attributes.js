const defaultState = {
  tabId: null,
  index: 0,
  attributes: [],
  data: [{
    attributes: [],
    index: 0,
    tabId: null
  }]
}

const attributes = (state=defaultState, action) => {
  switch (action.type) {
    case 'ADD-ATTRIBUTE':
      return {
        ...state,
        attributes: [...state.attributes.concat([action.attributes.concat(state.index)])],
        index: state.index + 1
      }
    case 'REMOVE-ATTRIBUTE':
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'REMOVE-ATTRIBUTE', index: action.index});
      });

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
        tabId: action.tabId
      }
    case 'UPDATE-TAB-ID':
      // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      //   chrome.tabs.sendMessage(tabs[0].id, {type: 'TAB-CHANGED', currentTabId: tabs[0].id});
      // });
      return {
        ...state,
        tabId: action.tabId
      }
    case 'LOAD-ATTRIBUTES':
      // First save current attributes then load 
      // or create attributes for new tabId

      console.log('LOAD-ATTRIBUTES with tabId ', action.tabId)
      let loadData = {...defaultState.data[0]}
      let index = 0
      for(const data of state.data) {
        console.log('current tabId is ', data['tabId'])
        if(data['tabId'] === action.tabId) {
          loadData = {
            ...state.data[index], 
            attributes: [...state.data[index].attributes],
            index: state.data[index].index,
            tabId: state.data[index].tabId
          }
          break
        }
        index += 1
      }
      
      let newData = {}
      let saveData = {
        attributes: [...state.attributes],
        index: state.index,
        tabId: state.tabId
      }
      // Update existing
      if(index !== state.data.length) {
        newData = {
          ...state.data, 
          [index]: {
            ...state.data[index],
            saveData
          }
        }
      } 
      // Add on DNE
      else {
        newData = {
          ...state.data, 
          ...state.data.concat(saveData)
        }
      }

      console.log('newData is ', newData)
      console.log('loaded data is ', loadData)
      console.log('saved data is ', saveData)
      
      return {
        ...state,
        attributes: loadData.attributes,
        index: loadData.index,
        tabId: action.tabId,
        data: newData
      }
    // case 'SAVE-ATTRIBUTES':
    //   console.log('SAVE-ATTRIBUTES with tabId ', action.tabId)
    //   var loadData = {...defaultState.data[0]}
    //   let index = 0
    //   for(const data of state.data) {
    //     console.log('current tabId is ', data['tabId'])
    //     if(data['tabId'] === action.tabId) {
    //       loadData = {
    //         ...state.data[index], 
    //         attributes: state.attributes,
    //         index: state.index,
    //         tabId: state.tabId
    //       }
    //       break
    //     }
    //     index += 1
    //   }

    //   console.log('loaded data is ', loadData)
      
    //   return {
    //     ...state,
    //     attributes: [],
    //     index: 0,
    //     tabId: action.tabId,
    //     data: index === state.data.length ? [{
    //       ...state.data[index], 
    //       attributes: state.attributes,
    //       index: state.index,
    //       tabId: state.tabId
    //     }]
    //   }
  //   case 'RESET-ATTRIBUTES':
  //     // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  //     //   chrome.tabs.sendMessage(tabs[0].id, {type: 'RESET-ATTRIBUTES'});
  //     // });
  //     console.log('RESET-ATTRIBUTES', action.tabId)
  //     let oldData = {}
  //     let index = 0
  //     for(const data of state.data) {
  //       console.log(data['tabId'])
  //       if(data['tabId'] === action.tabId) {
  //         newData = {
  //           ...state.data[index], 
  //           attributes: state.attributes,
  //           index: state.index,
  //           tabId: state.tabId
  //         }
  //         break
  //       }
  //       index += 1
  //     }
  //     if (index === state.data.length) {

  //     }
      
  //     return {
  //       ...state,
  //       attributes: [],
  //       index: 0,
  //       tabId: action.tabId,
  //       data: [{
  //         ...state.data[index], 
  //         attributes: state.attributes,
  //         index: state.index,
  //         tabId: state.tabId
  //       }]
  //     }
  }
  return state
}

export default attributes;