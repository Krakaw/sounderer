// background.js

// Use the 'browser' namespace for Firefox extensions
browser.browserAction.onClicked.addListener(function() {
    // Open 'record.html' in a new tab
    browser.tabs.create({
      url: browser.runtime.getURL("record.html")
    });
  });
  