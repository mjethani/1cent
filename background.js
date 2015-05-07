chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    chrome.tabs.create({ 'url': 'chrome://extensions/?options='
        + chrome.runtime.id });
  }
});

// vim: et ts=2 sw=2
