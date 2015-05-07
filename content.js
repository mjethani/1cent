var MINUTE = 60000;
var DAY    = 86400000;

var fee = 1000;

var model = null;

function loadModel(callback) {
  chrome.storage.sync.get({
    version: 1.0,
    key: '',
    history: {}
  }, function (items) {
    if (callback) {
      callback(chrome.runtime.lastError, model = items);
    }
  });
}

function saveModel(callback) {
  chrome.storage.sync.set(model, function () {
    if (callback) {
      callback(chrome.runtime.lastError);
    }
  });
}

function extractBitcoinAddress() {
  var elements = document.getElementsByTagName('meta');

  for (var i = 0; i < elements.length; i++) {
    if (elements[i].name === 'bitcoin') {
      return elements[i].content || null;
    }
  }

  return null;
}

function alreadyPaid() {
  var historyItem = model.history[location.hostname];

  if (historyItem) {
    return historyItem.timestamp > Date.now() - DAY;
  }

  return false;
}

function pay(address) {
  model.history[location.hostname] = {
    address: address,
    timestamp: Date.now()
  };

  // Save timestamp first
  saveModel(function (error) {
    if (error) {
      console.log(error);
      return;
    }

    callApi('https://blockchain.info/tobtc?currency=USD&value=0.01',
        function (data) {
      if (typeof data !== 'number' || isNaN(data)) {
        return;
      }

      // One cent or 0.0001 BTC, whichever is less
      var amount = Math.min(10000, data * 100000000);

      try {
        makePayment(model.key, address, amount, fee, function (error, hash) {
          if (error) {
            console.log(error);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function pruneHistory(callback) {
  loadModel(function (error) {
    if (!error) {
      for (var hostname in model.history) {
        if (model.history[hostname].timestamp <= Date.now() - 10 * DAY) {
          delete model.history[hostname];
        }
      }

      saveModel(callback);

    } else if (callback) {
      callback(error);
    }
  });
}

function run() {
  var bitcoin = extractBitcoinAddress();

  if (bitcoin) {
    setTimeout(function () {
      loadModel(function (error) {
        if (error) {
          console.log(error);
          return;
        }

        if (!alreadyPaid()) {
          pay(bitcoin);
        }
      });
    }, MINUTE);
  }

  if (Math.random() < .01) {
    pruneHistory();
  }
}

run();

// vim: et ts=2 sw=2
