function respond(response) {
  console.log(response)
  try {
    if (response.highlightMod) {
      var {index, totalAnchors, success} = JSON.parse(response.highlightMod)

      anchorTracker.innerText = String(index) + '/' + String(totalAnchors)
    } else if (response.highlightColor) {
      console.log(response.highlightColor.success)
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
  if (value) {
    console.log(value)
    
  }
  if (radios) {
    for (let i = 0; i < radios.length; i++) {
      console.log(radios[i].value)
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
      chrome.tabs.sendMessage(tabs[0].id, {highlightMod: 1}, function(response) {
        respond(response)
      });
    });
  });

  var prev = document.getElementById('prev');
  prev.addEventListener('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {highlightMod: -1}, function(response) {
        respond(response)
      });
    });
  });
})