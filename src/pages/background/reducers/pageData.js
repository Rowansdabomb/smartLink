import { WSASERVICE_NOT_FOUND } from "constants";

const defaultState = {
  url: null,
  index: 0,
  attributes: [],
  data: []
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
      console.log('LOAD-ATTRIBUTES ', action.url)

      var loadData = {}
      var saveData = {}

      var loadIndex = -1
      var saveIndex = -1

      for (let [i, data] of state.data.entries()) {
        // LOAD
        if (data.url === action.url && loadIndex === -1) {
          loadData = {
            ...state.data[i],  
            attributes: [...state.data[i].attributes],
            index: state.data[i].index,
            url: action.url,
          }
          loadIndex = i
        }

        // SAVE
        else if (state.url !== null && data.url === state.url && saveIndex === -1) {
          saveData = state.data.map((item, index) => {
            if (index !== i) 
              return item
            
            return {
              ...item,
              attributes: [...state.attributes],
              index: state.index,
              url: state.url
            }
          })
          saveIndex = i
        }

        if (saveIndex > -1 && loadIndex > -1) {
          return {
            ...state,
            attributes: [...loadData.attributes],
            index: loadData.index,
            url: loadData.url,
            data: [...saveData]
          }
        }
      }

      if (saveData.isEmpty() && state.url !== null) {
        // a shallow copy should be fine here, as we are removing the object from the array anyway
        saveData = [...state.data]
        
        saveData.unshift({
          attributes: [...state.attributes],
          index: state.index,
          url: state.url
        })

        if (saveData.length > 9) 
          saveData.pop()
      }

      if (saveData.isEmpty() && loadData.isEmpty())
        return {
          ...state,
          attributes: [...defaultState.attributes],
          index: defaultState.index,
          url: defaultState.url
        }

      else if (saveData.isEmpty()) {
        return {
          ...state,
          attributes: [...loadData.attributes],
          index: loadData.index,
          url: loadData.url
        }
      }

      else {
        return {
          ...state,
          attributes: [...defaultState.attributes],
          index: defaultState.index,
          url: defaultState.url,
          data: [...saveData]
        }
      }

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