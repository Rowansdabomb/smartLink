import { WSASERVICE_NOT_FOUND } from "constants";

const defaultState = {
  url: null,
  index: 0,
  rangeData: [],
  data: []
}

const rangeData = (state=defaultState, action) => {
  Object.prototype.isEmpty = function() {
    for(var key in this) {
        if(this.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  switch (action.type) {
    case 'ADD-RANGE-DATA':
      const newRangeData = state.rangeData.length > 8 ? [...state.rangeData] : [...state.rangeData.concat([action.rangeData.concat(state.index)])]
      return {
        ...state,
        rangeData: newRangeData,
        index: state.index + 1,
        url: action.url
      }

    case 'REMOVE-RANGE-DATA':
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'REMOVE-RANGE-DATA', index: action.index});
      });

      return {
        ...state,
        rangeData: [...state.rangeData.filter((val, i) => val[val.length - 1] !== action.index)],
      }

    case 'SET-RANGE-DATA':
      return {
        ...state,
        rangeData: action.rangeData,
        index: action.rangeData.length - 1,
        url: action.url
      }

    case 'UPDATE-URL':
      return {
        ...state,
        url: action.url
      }

    case 'LOAD-RANGE-DATA':
      var loadData = {}
      var saveData = {}

      var loaded = false
      var saved = true

      for (let [i, data] of state.data.entries()) {
        // LOAD
        if (data.url === action.url && !loaded) {
          loadData = {
            ...state.data[i],  
            rangeData: [...state.data[i].rangeData],
            index: state.data[i].index,
            url: action.url,
          }
          loaded = true
        }

        // SAVE
        else if (state.url && data.url === state.url && !saved) {
          saveData = state.data.map((item, index) => {
            if (index !== i) 
              return item
            
            return {
              ...item,
              rangeData: [...state.rangeData],
              index: state.index,
              url: state.url
            }
          })
          saved = true
        }

        if (saved && loaded) {
          return {
            ...state,
            rangeData: [...loadData.rangeData],
            index: loadData.index,
            url: loadData.url,
            data: [...saveData]
          }
        }
      }

      if (saveData.isEmpty() && state.url) {
        // a shallow copy should be fine here, as we are removing the object from the array anyway
        saveData = [...state.data]
        
        saveData.unshift({
          rangeData: [...state.rangeData],
          index: state.index,
          url: state.url
        })

        if (saveData.length > 9) 
          saveData.pop()
      }

      if (saveData.isEmpty() && loadData.isEmpty())
        return {
          ...state,
          rangeData: [...defaultState.rangeData],
          index: defaultState.index,
          url: defaultState.url
        }

      else if (saveData.isEmpty()) {
        return {
          ...state,
          rangeData: [...loadData.rangeData],
          index: loadData.index,
          url: loadData.url
        }
      }

      else {
        return {
          ...state,
          rangeData: [...defaultState.rangeData],
          index: defaultState.index,
          url: defaultState.url,
          data: [...saveData]
        }
      }

    case 'RESET-RANGE-DATA':
      return {
        ...state,
        rangeData: [],
        index: 0,
        url: action.url,
      }

    case 'RESET':
      return {
        ...defaultState
      }
  }
  return state
}

export default rangeData;