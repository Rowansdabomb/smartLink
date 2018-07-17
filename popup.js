function respond(response) {
  try {
    if (response.success) {
      var {index, totalAnchors, success} = JSON.parse(response)

      anchorTracker.innerText = String(index) + '/' + String(totalAnchors)
    } else {
      // this should be initialized on tab load
      anchorTracker.innerText = '0/0'
    }
  } catch (error) {
    anchorTracker.innerText = '0/0'
    console.error(error)
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var anchorTracker = document.getElementById('anchorTracker')

  var next = document.getElementById('next');
  next.addEventListener('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: 1}, function(response) {
        respond(response)
      });
    });
  });

  var prev = document.getElementById('prev');
  prev.addEventListener('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: -1}, function(response) {
        respond(response)
      });
    });
  });
})