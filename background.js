chrome.contextMenus.create({
  id: "some-command",
  title: "Copy Smart Link",
  contexts:["selection"],
 });

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  chrome.tabs.executeScript({
    file: 'getDocumentSelection.js'
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
});