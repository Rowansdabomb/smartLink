import store from './store';

// store.subscribe (() => {
//     store.getState().bookmark.tabs.map(infoTab => {
//       chrome.alarms.create(infoTab.tab[0].url, {when: infoTab.expiry + store.getState().settings.expireDate})
//     });
// });

// chrome.alarms.onAlarm.addListener(function (data) {
//   const elementExpired = store.getState().bookmark.tabs.filter(el => {
//     return el.tab[0].url === data.name
//   })
//   store.dispatch({type:'EXPIRY', url: elementExpired[0].tab[0].url})
// })

chrome.contextMenus.create({
  id: "some-command",
  title: "Copy Smart Link",
  contexts:["selection"],
 });

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // send message to react scripts
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'GET-SELECTION'});
  });
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});(

chrome.tabs.onActivated.addListener(function(tabId, info) {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'TAB-CHANGED', currentTabId: tabs[0].id});
  });
}))

chrome.tabs.onCreated.addListener(function(tab){
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'TAB-CREATED', currentTabId: tabs[0].id});
  });
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    if (request.message == "INITIALIZE-APP") {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        this.props.updateUrl(window.location.origin + window.location.pathname)
      });
    }
  });

