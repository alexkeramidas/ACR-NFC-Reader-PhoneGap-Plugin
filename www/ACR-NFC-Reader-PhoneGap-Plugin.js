(function() {
  var exec = require('cordova/exec');

  var ACR = {};

  ACR.TagSuccessListener = function() {};
  ACR.TagFailureListener = function() {};

  ACR.start = function() {
    if (cordova.platformId === 'android') {
      setTimeout(function() {
        cordova.exec(
            function(r) {
              ACR.metadata = r.metadata;
              ACR.TagSuccessListener(r);
            },
            function(r) {
              ACR.TagFailureListener(r);
            },
            'ACRNFCReaderPhoneGapPlugin',
            'listen',
            []
        );
      }, 10);
    }
  };

  ACR.AID = 'F222222228';
  ACR.setAID = function(aid) {
    ACR.AID = aid;
  };

  ACR.initReader = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'initReader',
        []
    );
  };
  ACR.getVersion = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'getVersion',
        []
    );
  };

  ACR.initNTAG213 = function(oldPassword, password, success, failure) {
    var oldRe = _normalizePassword(oldPassword);
    if (!oldRe.success) {
      failure(oldRe);
      return;
    }

    var newRe = _normalizePassword(password);
    if (!newRe.success) {
      failure(newRe);
      return;
    }

    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'initNTAG213',
        [oldRe.password, newRe.password]
    );
  };

  ACR.metadata = {};

  ACR.clearLCD = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'clearLCD',
        []
    );
  };

  ACR.display = function(msg, opts, success, failure) {
    var options = opts || {};
    if (options.bold === undefined) options.bold = false;
    if (options.font === undefined) options.font = 1;
    if (options.x === undefined) options.x = 0;
    if (options.y === undefined) options.y = 0;
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'display',
        [msg, options.x, options.y, options.bold, options.font]
    );
  };

  ACR.removeTagListener = function(success, failure) {
    ACR.TagSuccessListener = function() {};
    ACR.TagFailureListener = function() {};
  };

  ACR.addTagListener = function(success, failure) {
    ACR.TagSuccessListener = success;
    ACR.TagFailureListener = failure;
  };

  ACR.authenticateWithKeyA = function(block, keyA, success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'authenticateWithKeyA',
        [block, keyA]
    );
  };

  ACR.selectFile = function(aid, success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'selectFile',
        [aid]
    );
  };

  ACR.authenticateWithKeyB = function(block, keyB, success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'authenticateWithKeyB',
        [block, keyB]
    );
  };

  ACR.writeAuthenticate = function(block, keyA, keyB, success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'writeAuthenticate',
        [block, keyA, keyB]
    );
  };

  ACR.readUID = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'readUID',
        []
    );
  };

  ACR.getFirmwareVersion = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'getFirmwareVersion',
        []
    );
  };

  ACR.getReceivedData = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'getReceivedData',
        []
    );
  };

  ACR.getLedStatus = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'getLedStatus',
        []
    );
  };

  ACR.getBatteryLevel = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'getBatteryLevel',
        []
    );
  };

  ACR.readData = function(block, password, success, failure) {
    if (ACR.metadata.type === 'javacard') {
      ACR.selectFile(ACR.AID, success, failure);
    } else {
      var re = _normalizePassword(password);
      if (!re.success) {
        failure(re);
        return;
      }
      cordova.exec(
          success,
          failure,
          'ACRNFCReaderPhoneGapPlugin',
          'readData',
          [block, re.password]
      );
    }
  };

  ACR.readMobileData = function(success, failure) {
    ACR.selectFile(ACR.AID, success, failure);
  };

  ACR.isReady = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'isReady',
        []
    );
  };

  ACR.connectReader = function(address, success, failure) {
    try {
      cordova.exec(
          success,
          failure,
          'ACRNFCReaderPhoneGapPlugin',
          'connectReader',
          [address]
      );
    } catch (e) {
      console.log({ e });
    }
  };

  ACR.disconnectReader = function() {
    cordova.exec(
        function() {},
        function() {},
        'ACRNFCReaderPhoneGapPlugin',
        'disconnectReader',
        []
    );
  };

  ACR.writeData = function(block, data, password, success, failure) {
    if (ACR.metadata.type === 'javacard') {
      failure({ success: false, exception: 'javacard' });
    } else {
      if (data === undefined || data === null) data = '';

      var re = _normalizePassword(password);
      if (!re.success) {
        failure(re);
        return;
      }

      cordova.exec(
          success,
          failure,
          'ACRNFCReaderPhoneGapPlugin',
          'writeData',
          [block, data, re.password]
      );
    }
  };

  ACR.onCardAbsent = function() {};
  ACR.onReady = function() {};
  ACR.onAttach = function(device) {};
  ACR.onDetach = function(device) {};
  ACR.onBatteryLevelChange = function(level) {};
  ACR.onScan = function(device) {};

  ACR.startScan = function(success, failure) {
    cordova.exec(
        success,
        failure,
        'ACRNFCReaderPhoneGapPlugin',
        'startScan',
        []
    );
  };

  ACR.stopScan = function() {
    cordova.exec(
        function() {},
        function() {},
        'ACRNFCReaderPhoneGapPlugin',
        'stopScan',
        []
    );
  };

  ACR.runCardAbsent = function() {
    ACR.metadata = {};
    ACR.onCardAbsent();
  };

  function _normalizePassword(password) {
    if (typeof password !== 'string') password = '';

    if (password === '' || /^[0-9a-fA-F]{8}$/.test(password)) {
      return { success: true, password: password };
    } else {
      return { success: false, exception: 'Invalid password' };
    }
  }

  window.ACR = ACR;
})();
