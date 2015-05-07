function addressFromKey(key) {
  return bitcoin.ECKey.fromWIF(key).pub.getAddress().toString();
}

function callApi(url, data, callback) {
  if (typeof data === 'function') {
    callback = data;
    data = null;
  }

  var request = new XMLHttpRequest();

  request.onerror = function () {
    callback();
  };

  request.onload = function () {
    var data = this.responseText;
    try {
      data = JSON.parse(data);
    } catch (error) {
    }
    callback(data);
  };

  request.open(data ? 'POST' : 'GET', url, true);

  if (data) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }

    request.setRequestHeader('Content-Type', 'application/json');
  }

  request.send(data);
}

function makePayment(key, recipient, amount, fee, callback) {
  var address = addressFromKey(key);

  var api = 'https://mainnet.helloblock.io/v1/';
  var url = api + 'addresses/' + address + '/unspents';

  callApi(url, function (object) {
    if (typeof object !== 'object' || object === null) {
      callback('API unavailable');
      return;
    }

    var unspents = object.data.unspents.filter(function (x) {
      return x.type === 'pubkeyhash';
    });

    if (unspents.length === 0) {
      callback('No unspent outputs');
      return;
    }

    var balance = unspents.reduce(function (a, x) {
      return a + x.value;
    },
    0);

    if (balance < +amount + fee) {
      callback('Insufficient balance');
      return;
    }

    var builder = new bitcoin.TransactionBuilder();

    unspents.forEach(function (x) {
      builder.addInput(x.txHash, x.index);
    });

    builder.addOutput(recipient, +amount);
    builder.addOutput(address, balance - +amount - fee);

    for (var index = 0; index < unspents.length; index++) {
      builder.sign(index, bitcoin.ECKey.fromWIF(key));
    }

    var tx = builder.build();
    var txHex = tx.toHex();

    var postObject = { 'rawTxHex': txHex };

    callApi(api + 'transactions', postObject, function (object) {
      if (typeof object !== 'object' || object === null) {
        callback('API unavailable');
        return;
      }

      if (object.status !== 'success') {
        callback('Transaction failed');
        return;
      }

      callback(null, object.data.transaction.txHash);
    });
  });
}

// vim: et ts=2 sw=2
