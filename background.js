/* Extension Create Data */
var extensionURL = "dosbox.html";
var estensionWidth = 640;
var extensionHeight = 464;

function createExtensionWindow() {

  chrome.windows.create({url: extensionURL,
                         width: estensionWidth,
                         height: extensionHeight,
                         type: "popup"
                        },
                        function(Window) {

                          chrome.storage.local.set({

                            extensionWindowID: Window.id

                          });

                          chrome.windows.onRemoved.addListener(function() {

                            chrome.storage.local.set({
                              extensionWindowID: null
                            });

                          });

                          console.log("Window created");

  });

}

chrome.action.onClicked.addListener(function() {

  chrome.storage.local.get({

    extensionWindowID: null

  }, function(items) {

    if (items.extensionWindowID === null) {

      createExtensionWindow();

    } else {

      chrome.windows.getAll(function(Window) {

        for (var i=0; i<Window.length; i++) {

          if (Window[i].id === items.extensionWindowID) {

            chrome.windows.update(items.extensionWindowID,
                                  {drawAttention: true,
                                   focused: true
                                  },
                                  function() {

                                    console.log("Window focused");

                                  }
            )

            var restoreSession = false;

            break;

          } else {

            var restoreSession = true;

          }

        }

        if (restoreSession === true) {

          createExtensionWindow();

        }

      });

    }

  });

});
