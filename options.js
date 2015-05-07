function saveOptions() {
  chrome.storage.sync.set({
    version: 1.0,
    key: document.getElementById('key').value
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    key: '',
  }, function (items) {
    document.getElementById('key').value = items.key;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('key').addEventListener('change', saveOptions);

// vim: et ts=2 sw=2
