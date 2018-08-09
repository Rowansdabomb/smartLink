function respond(response) {
  response = JSON.parse(response)
  try {
    if (response.hMod) {
      var {index, totalAnchors, success} = response.hMod

      anchorTracker.innerText = String(index) + '/' + String(totalAnchors)
    } else {
      // this should be initialized on tab load
      
      anchorTracker.innerText = 'N/A'
    }
  } catch (error) {
    anchorTracker.innerText = 'N/A'
    console.error(error)
  }
}

function radioValues(value) {
  var radios = document.querySelectorAll('input.colorChoice')
  if (radios) {
    for (let i = 0; i < radios.length; i++) {
      if (value === radios[i].value) {
        radios[i].checked = true
      }
      radios[i].addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {'highlightColor': radios[i].value}, function(response) {
            respond(response)
          });
        });

        chrome.storage.sync.set({
          'highlightColor': radios[i].value
        })
      })
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var anchorTracker = document.getElementById('anchorTracker')

  chrome.storage.sync.get("highlightColor", function(color) {
    highlightColor = color.highlightColor
    radioValues(highlightColor)
  })

  radioValues()

  var next = document.getElementById('next');
  next.addEventListener('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {hMod: 1}, function(response) {
        respond(response)
      });
    });
  });

  var prev = document.getElementById('prev');
  prev.addEventListener('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {hMod: -1}, function(response) {
        respond(response)
      });
    });
  });
})