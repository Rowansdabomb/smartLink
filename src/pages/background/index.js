import store from './store';

chrome.contextMenus.create({
  id: "some-command",
  title: "Copy Smart Link",
  contexts:["selection"],
 });

chrome.contextMenus.onClicked.addListener(function(info, tab) {
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
    if (request.message == "INITIALIZE-APP") {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        this.props.updateUrl(window.location.origin + window.location.pathname)
      });
    }
  });

