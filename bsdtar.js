
function extractZIPfile(fileName) {

  var nativeClient = document.createElement("EMBED");

  nativeClient.setAttribute("id", "bsdtar");
  nativeClient.setAttribute("width", 0);
  nativeClient.setAttribute("height", 0);
  nativeClient.setAttribute("PS_STDOUT", "/dev/tty");
  nativeClient.setAttribute("PS_TTY_PREFIX", "tty:");
  nativeClient.setAttribute("PS_EXIT_MESSAGE", "exit");
  nativeClient.setAttribute("src", "bsdtar.nmf");
  nativeClient.setAttribute("type", "application/x-nacl");
  nativeClient.setAttribute("ARG0", "bsdtar");
  nativeClient.setAttribute("ARG1", "-C");
  nativeClient.setAttribute("ARG2", C_DRIVE);
  nativeClient.setAttribute("ARG3", "-xkmf");
  nativeClient.setAttribute("ARG4", "/mnt/html5/home/user/" + fileName);

  document.getElementById('nativeClient').appendChild(nativeClient);

  console.warn("Waiting for debugger...");

  nativeClient.addEventListener("message", function handleBSDtarMessage(message) {

    if (typeof message.data == "string" && message.data.startsWith("tty:")) {

      console.log("tty: " + message.data.slice(4, message.data.length));

    } else {

      console.log("tty: " + message.data);
      nativeClient.removeEventListener("message", handleBSDtarMessage, false);
      document.getElementById('nativeClient').removeChild(nativeClient);
      removeTEMPfile(fileName);

    }

  }, false);

}

function extractISOfile(fileName) {

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("D_DRIVE", {}, function(dirEntry) {
            dirEntry.getDirectory("CDROM", {create: true}, function() {

              var nativeClient = document.createElement("EMBED");

              nativeClient.setAttribute("id", "bsdtar");
              nativeClient.setAttribute("width", 0);
              nativeClient.setAttribute("height", 0);
              nativeClient.setAttribute("PS_STDOUT", "/dev/tty");
              nativeClient.setAttribute("PS_TTY_PREFIX", "tty:");
              nativeClient.setAttribute("PS_EXIT_MESSAGE", "exit");
              nativeClient.setAttribute("src", "bsdtar.nmf");
              nativeClient.setAttribute("type", "application/x-nacl");
              nativeClient.setAttribute("ARG0", "bsdtar");
              nativeClient.setAttribute("ARG1", "-C");
              nativeClient.setAttribute("ARG2", D_DRIVE + "/CDROM");
              nativeClient.setAttribute("ARG3", "-xkmf");
              nativeClient.setAttribute("ARG4", "/mnt/html5/home/user/" + fileName);

              document.getElementById('nativeClient').appendChild(nativeClient);

              console.warn("Waiting for debugger...");

              nativeClient.addEventListener("message", function handleBSDtarMessage(message) {

                if (typeof message.data == "string" && message.data.startsWith("tty:")) {

                  console.log("tty: " + message.data.slice(4, message.data.length));

                } else {

                  console.log("tty: " + message.data);
                  nativeClient.removeEventListener("message", handleBSDtarMessage, false);
                  document.getElementById('nativeClient').removeChild(nativeClient);
                  VCD = true;
                  removeDOSBoxConfig();
                  removeTEMPfile(fileName);

                }

              }, false);

            }, errorHandler);
          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}
