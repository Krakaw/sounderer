browser.browserAction.onClicked.addListener(() => {
    browser.windows.create({
      url: "popup.html",
      type: "popup",
      width: 300,
      height: 200
    });
  });
  