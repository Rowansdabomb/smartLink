const defaultState = {
  attributes: [],
  index: 0,
  tabId: null
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
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'SET-ATTRIBUTES'});
      });
      return {
        ...state,
        attributes: action.attributes,
        tabId: action.tabId
      }
    case 'RESET-ATTRIBUTES':
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'RESET-ATTRIBUTES'});
      });
      return {
        ...state,
        attributes: []
      }
  }
  return state
}

export default attributes;