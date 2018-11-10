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
    case 'UPDATE-TAB-ID':
      // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      //   chrome.tabs.sendMessage(tabs[0].id, {type: 'TAB-CHANGED', currentTabId: tabs[0].id});
      // });
      return {
        ...state,
        url: action.url
      }
    case 'LOAD-ATTRIBUTES':
      // First save current attributes then load 
      // or create attributes for new url
      console.log(' ');
      console.log('LOAD-ATTRIBUTES ', action.url)

      // initialize loadData as empty
      let loadData = {...defaultState.data['0']}

      // if there is something to load, load it
      if (!state.data.isEmpty()) {
        for(let key in state.data) {
          let data = state.data[key]
          
          if(key === 'length')
            // nothing to load
            break
          console.log(key, data['url'], action.url)

          if(data['url'] === action.url) {
            console.log("LOAD URL MATCH")
            loadData = {
              ...state.data[key],  
              attributes: [...state.data[key].attributes],
              index: state.data[key].index,
              url: action.url,
              dataIndex: state.data[key].dataIndex
            }
            break
          } 
        }
      }
      
      let tempDataIndex = null
      // if there is something to save, save it
      console.log(state.url)
      if(state.url !== null) {
        tempDataIndex = 0
        for(let key in state.data) {
          let data = state.data[key]

          console.log(key, data['url'], state.url)
          // if(tempDataIndex === state.data['length'])
          //   console.log("SAVE URL NO MATCH")
          //   break

          if(data['url'] === state.url) {
            console.log("SAVE URL MATCH")
            break
          }

          tempDataIndex += 1
          console.log(tempDataIndex)
        }
      } else {
        console.log('NO ATTRIBUTES NO SAVE')
      }

      let saveData = {}
      saveData = {
        attributes: [...state.attributes],
        index: state.index,
        url: state.url,
        dataIndex: tempDataIndex
      }

      let newData = {}

      if(!saveData.isEmpty() && tempDataIndex !== null) {
        newData = {
          ...state.data, 
          [saveData.dataIndex]: {
            ...state.data[saveData.dataIndex],
            ...saveData
          }
        }
        if (tempDataIndex === state.data['length'])
          newData.length += 1
      } else {
        newData = {...state.data}
      }

      // console.log('newData is ', newData)
      // console.log('loadData is ', loadData)
      // console.log('saveData is ', saveData)
      
      return {
        ...state,
        attributes: loadData.attributes,
        index: loadData.index,
        url: loadData.url,
        data: newData
      }
  //   case 'RESET-ATTRIBUTES':
  //     // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  //     //   chrome.tabs.sendMessage(tabs[0].id, {type: 'RESET-ATTRIBUTES'});
  //     // });
  //     console.log('RESET-ATTRIBUTES', action.url)
  //     let oldData = {}
  //     let index = 0
  //     for(const data of state.data) {
  //       console.log(data['url'])
  //       if(data['url'] === action.url) {
  //         newData = {
  //           ...state.data[index], 
  //           attributes: state.attributes,
  //           index: state.index,
  //           url: state.url
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
  //       url: action.url,
  //       data: [{
  //         ...state.data[index], 
  //         attributes: state.attributes,
  //         index: state.index,
  //         url: state.url
  //       }]
  //     }
  }
  return state
}

export default attributes;