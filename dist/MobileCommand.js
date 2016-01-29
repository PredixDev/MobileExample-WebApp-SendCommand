
var Command = function()
{
  var currentUser = null; // current logged in user
  var commandRoute = "/cmdp_test/"; //same as registered with command router using 'pm add-route' command
  var textarea = null;
  var statusDiv = null;
  this.isWaiting = false; // flag which checks if there a command is already sent.
  this.currentCommandDocID = null; // document id of current command document
  //var counter = 0;
  //var setIntervalID = null;

  // public

  // sends a command document. Push it to local db which gets replicated to backend.
  // On backend command router service picks it up and deliver to relevant command processor
  // based on the route and endpoint configuration done using pm cli tool {pm add-route command}
  this.sendCommandToRouter = function(idTextArea, idCounter)
  {
    if (this.isWaiting) {
      console.warn('Patience is a virtue. Waiting for recently sent command response.');
      return;
    }

    if (null == textarea) {
      textarea = idTextArea;
    }

    if (null == statusDiv) {
      statusDiv = idCounter;
    }

    if(null == _getCurrentUser())
      return;

    console.log(_getCurrentUser(),' |< will send a new command =^=^=^=^=>>');

    statusDiv.innerHTML = 'IDLE';
    currentCommandDocID = "command_EX_" + _getCurrentUser() + new Date().getTime();
    var cdbServiceURL = "http://pmapi/cdb/pm/"+currentCommandDocID;
    var document = _getNewCommandDocument();

    textarea.value = JSON.stringify(document);
    //sending PUT request to CDB service which will push this document in local database.
    _sendPUTRequest(cdbServiceURL, document, function(responseData) {
      this.isWaiting = true;
      _watchDocChanges(currentCommandDocID);
      _updatestatusDiv();
      console.log('sendCommandToRouter response: ',JSON.stringify(responseData));
      // now we will start watching this doc for changes to see when we get the response back from our micro-service.
    }, function(err) {
      console.error('sendCommandToRouter error:', err);
    });
  };

  //fethces the recently pushed/updated command document
  this.refreshData = function()
  {
    var getDocServiceURL = 'http://pmapi/db/~/document/'+currentCommandDocID;
    console.log('getDocServiceURL: '+ getDocServiceURL);

    //sending GET request to db service to fetch document.
    _sendRequest(getDocServiceURL, function(data) {
      console.log('updated Document: '+ JSON.stringify(data));
      textarea.value = JSON.stringify(data);
      var respOnCounter = data['~status'] + ' : ';
      if (data.hasOwnProperty('response')) {
        respOnCounter = respOnCounter + data.response.message;
      }
      statusDiv.innerHTML = respOnCounter;//data['~status'] + ' : ' + data.response.message;

    }, function(err) {
      console.error('Something went wrong:', err);
    });
  };


  // sends a DELETE HTTP request
  this._sendDELETERequest = function(url, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status >= 200 && status <= 299) {
        successHandler && successHandler(xhr.response);
      } else {
        errorHandler && errorHandler(status);
      }
    };
    xhr.send();
  };

  // private

  // returns a new json compliant command document
  function _getNewCommandDocument()
  {
    var data = {
      "type": "command", //command router expect type should be 'command'
      "~userid": _getCurrentUser(),
      "channels": ["entity_" + _getCurrentUser()], // this document will be assigned to user channel
      "~status": "pending", //status of this document, if its in pending state command-router will deliver it to command-processor
      "request": { //like HTTP request
        "uri": commandRoute, // uri for command-processor
        "method": "PUT",
        "headers": {},
        "body": { //Whatever is in body will be sent to registered command-processor
          "result": [
            {
              "TS_MOBILE_START": new Date().getTime() // some data, you can send any key value pair here
            }
          ]
        }
      }
    };
    console.log("Created document: " + JSON.stringify(data));
    return data;

  };

  function _getCurrentUser()
  {
    if (currentUser == null) {
      currentUser = _getCurrentUserFromSDK();
    }
    return currentUser;
  };

  function _getCurrentUserFromSDK()
  {
    var userServiceURL = "http://pmapi/user/";

    // sending get request to user service to know who is logged in currently.
    _sendRequest(userServiceURL, function(respData) {
      if (respData.hasOwnProperty('username')) {
        currentUser = respData.username;
        statusDiv.innerHTML = currentUser+', please press again to send command.';
      }
      console.log('_getCurrentUserFromSDK: ',JSON.stringify(respData));
    }, function(err) {
      console.error('_getCurrentUserFromSDK error:' , err);
    });
  }

  // I'll watch for any changes happen on current command document.
  function _watchDocChanges(docID)
  {
    console.log('waiting for changes on :'+ docID);

    // sending POST request to Notify service for a specific event 'DocumentChangedNotification' with a document id
    var notifyURL = 'http://pmapi/notify/events/DocumentChangedNotification/'+docID;
    var body = {
      "script":"gotChanges"
    };

    _sendPOSTRequest(notifyURL, body, function(data) {
      // console.log('_watchDocChanges response: ',JSON.stringify(data));
    }, function(err) {
      console.error('_watchDocChanges error:', err);
    });
  };

  // :-)
  function _updatestatusDiv()
  {
    if (!this.isWaiting)
    {
      console.warn('shouldn\'t be called');
      return;
    }
    statusDiv.innerHTML = 'in-progress: Command sent, waiting for it to be synced and processed by command processor.';
  }


  // sends a PUT HTTP request
  function _sendPUTRequest(url, body, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader('Content-Length', body.length);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status >= 200 && status <= 299) {
        successHandler && successHandler(xhr.response);
      } else {
        errorHandler && errorHandler(status);
      }
    };
    xhr.send(JSON.stringify(body));
  };


  // sends a GET HTTP request
  var _sendRequest = function(url, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status >= 200 && status <= 299) {
        successHandler && successHandler(xhr.response);
      } else {
        errorHandler && errorHandler(status);
      }
    };
    xhr.send();
  };

  // sends a POST HTTP request
  var _sendPOSTRequest = function(url, body, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader('Content-Length', body.length);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status >= 200 && status <= 299) {
        successHandler && successHandler(xhr.response);
      } else {
        errorHandler && errorHandler(status);
      }
    };
    xhr.send(JSON.stringify(body));
  };


}

var command = new Command();

// this will be called by native container app as and when and changes happens to our watched document (command)
function gotChanges(data)
{
  command.isWaiting = false;
  console.log('gotChanges-> wathed document changed:', data);
  //No more intersted in changes for this doc as we have received response from command-processor
  stopWatchingDoc(data.documentID);
  // Lets see what we got as a reponse from our command-processor
  command.refreshData();
};

//I'll unsubribe from changes on documentID passed.
function stopWatchingDoc(docID)
{
  console.log('Unsubscribing from document changes update feed.');
  var notifyUnsubscribeURL = 'http://pmapi/notify/events/DocumentChangedNotification/';

  command._sendDELETERequest(notifyUnsubscribeURL, function(data) {
    console.log('unsubscribe to doc changes sucess');
  },
  function(err) {
    console.error('Something went wrong while unsubscribing from doc changes:', err);
  });

};
