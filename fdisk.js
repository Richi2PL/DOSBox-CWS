/* fdisk File System */
var DOS_MODE = "dos"; 		/* DOS Compatible Mode */
var UNIT = "cylinders";
var CYLINDERS = 3968 / 4;	/* MAX 2GB / 4 - 512MB VHD Image */
var HEADS = 16;
var SECTORS = 63;

function partitionHDimage() {

  var nativeClient = document.createElement("EMBED");

  nativeClient.setAttribute("id", "fdisk");
  nativeClient.setAttribute("width", 0);
  nativeClient.setAttribute("height", 0);
  nativeClient.setAttribute("PS_STDIN", "/dev/tty");
  nativeClient.setAttribute("PS_STDOUT", "/dev/tty");
  nativeClient.setAttribute("PS_TTY_PREFIX", "tty:");
  nativeClient.setAttribute("PS_EXIT_MESSAGE", "exit");
  nativeClient.setAttribute("src", "fdisk.nmf");
  nativeClient.setAttribute("type", "application/x-nacl");
  nativeClient.setAttribute("ARG0", "fdisk");
  nativeClient.setAttribute("ARG1", "-b");
  nativeClient.setAttribute("ARG2", BUFFER);
  nativeClient.setAttribute("ARG3", "-c=" + DOS_MODE);
  nativeClient.setAttribute("ARG4", "-u=" + UNIT);
  nativeClient.setAttribute("ARG5", "-C");
  nativeClient.setAttribute("ARG6", CYLINDERS);
  nativeClient.setAttribute("ARG7", "-H");
  nativeClient.setAttribute("ARG8", HEADS);
  nativeClient.setAttribute("ARG9", "-S");
  nativeClient.setAttribute("ARG10", SECTORS);
  nativeClient.setAttribute("ARG11", VI_DRIVE + "/VHD.IMG");

  document.getElementById('nativeClient').appendChild(nativeClient);

  console.warn("Waiting for debugger...");

  var commandNumber = 0;

  nativeClient.addEventListener("message", function handleFdiskMessage(message) {
    if (typeof message.data == "string" && message.data.startsWith("tty:")) {

      console.log("tty: " + message.data.slice(4, message.data.length));

      if (message.data.includes("Command (m for help):")) {

        if (commandNumber == 0) {
          nativeClient.postMessage({"tty:": "n\n"});
        }

        if (commandNumber == 1) {
          nativeClient.postMessage({"tty:": "t\n"});
        }

        if (commandNumber == 2) {
          nativeClient.postMessage({"tty:": "a\n"});
        }

        if (commandNumber == 3) {
          nativeClient.postMessage({"tty:": "p\n"});
        }

        if (commandNumber == 4) {
          nativeClient.postMessage({"tty:": "x\n"});
        }

        commandNumber = commandNumber + 1;

      } else if (message.data.includes("Expert command (m for help):")) {

        if (commandNumber == 5) {
          nativeClient.postMessage({"tty:": "d\n"});
        }

        if (commandNumber == 6) {
          nativeClient.postMessage({"tty:": "w\n"});
        }

        commandNumber = commandNumber + 1;

      }

      if (message.data.includes("Select (default p):")) {
        nativeClient.postMessage({"tty:": "p\n"});
      }

      if (message.data.includes("Partition number (1-4, default 1):")) {
        nativeClient.postMessage({"tty:": "1\n"});
      }

      if (message.data.includes("First cylinder (1-" + CYLINDERS + ", default 1):")) {
        nativeClient.postMessage({"tty:": "1\n"});
      }

      if (message.data.includes("Last cylinder, +cylinders or +size{K,M,G} (1-" + CYLINDERS + ", default " + CYLINDERS + "):")) {
        nativeClient.postMessage({"tty:": CYLINDERS + "\n"});
      }

      if (message.data.includes("Hex code (type L to list codes):")) {
        nativeClient.postMessage({"tty:": "e\n"});
      }

      if (message.data.includes("Partition number (1-4):")) {
        nativeClient.postMessage({"tty:": "1\n"});
      }

    } else {

      console.log("tty: " + message.data);
      nativeClient.removeEventListener("message", handleFdiskMessage);
      document.getElementById('nativeClient').removeChild(nativeClient);

      VHD = true;
      removeDOSBoxConfig();
      setTimeout (function() {
        document.getElementById('splash').style.zIndex = "0";
        startDOSBox();
      }, 250);

    }
  }, false);

}

function partitionRemovableImage() {

  var nativeClient = document.createElement("EMBED");

  nativeClient.setAttribute("id", "fdisk");
  nativeClient.setAttribute("width", 0);
  nativeClient.setAttribute("height", 0);
  nativeClient.setAttribute("PS_STDIN", "/dev/tty");
  nativeClient.setAttribute("PS_STDOUT", "/dev/tty");
  nativeClient.setAttribute("PS_TTY_PREFIX", "tty:");
  nativeClient.setAttribute("PS_EXIT_MESSAGE", "exit");
  nativeClient.setAttribute("src", "fdisk.nmf");
  nativeClient.setAttribute("type", "application/x-nacl");
  nativeClient.setAttribute("ARG0", "fdisk");
  nativeClient.setAttribute("ARG1", "-b");
  nativeClient.setAttribute("ARG2", BUFFER);
  nativeClient.setAttribute("ARG3", "-c=" + DOS_MODE);
  nativeClient.setAttribute("ARG4", "-u=" + UNIT);
  nativeClient.setAttribute("ARG5", "-C");
  nativeClient.setAttribute("ARG6", CYLINDERS);
  nativeClient.setAttribute("ARG7", "-H");
  nativeClient.setAttribute("ARG8", HEADS);
  nativeClient.setAttribute("ARG9", "-S");
  nativeClient.setAttribute("ARG10", SECTORS);
  nativeClient.setAttribute("ARG11", VI_DRIVE + "/VRD.IMG");

  document.getElementById('nativeClient').appendChild(nativeClient);

  console.warn("Waiting for debugger...");

  var commandNumber = 0;

  nativeClient.addEventListener("message", function handleFdiskMessage(message) {
    if (typeof message.data == "string" && message.data.startsWith("tty:")) {

      console.log("tty: " + message.data.slice(4, message.data.length));

      if (message.data.includes("Command (m for help):")) {

        if (commandNumber == 0) {
          nativeClient.postMessage({"tty:": "n\n"});
        }

        if (commandNumber == 1) {
          nativeClient.postMessage({"tty:": "t\n"});
        }

        if (commandNumber == 2) {
          nativeClient.postMessage({"tty:": "p\n"});
        }

        if (commandNumber == 3) {
          nativeClient.postMessage({"tty:": "x\n"});
        }

        commandNumber = commandNumber + 1;

      } else if (message.data.includes("Expert command (m for help):")) {

        if (commandNumber == 4) {
          nativeClient.postMessage({"tty:": "d\n"});
        }

        if (commandNumber == 5) {
          nativeClient.postMessage({"tty:": "w\n"});
        }

        commandNumber = commandNumber + 1;

      }

      if (message.data.includes("Select (default p):")) {
        nativeClient.postMessage({"tty:": "p\n"});
      }

      if (message.data.includes("Partition number (1-4, default 1):")) {
        nativeClient.postMessage({"tty:": "1\n"});
      }

      if (message.data.includes("First cylinder (1-" + CYLINDERS + ", default 1):")) {
        nativeClient.postMessage({"tty:": "1\n"});
      }

      if (message.data.includes("Last cylinder, +cylinders or +size{K,M,G} (1-" + CYLINDERS + ", default " + CYLINDERS + "):")) {
        nativeClient.postMessage({"tty:": CYLINDERS + "\n"});
      }

      if (message.data.includes("Hex code (type L to list codes):")) {
        nativeClient.postMessage({"tty:": "e\n"});
      }

    } else {

      console.log("tty: " + message.data);
      nativeClient.removeEventListener("message", handleFdiskMessage);
      document.getElementById('nativeClient').removeChild(nativeClient);

      VRD = true;
      removeDOSBoxConfig();
      setTimeout (function() {
        document.getElementById('splash').style.zIndex = "0";
        startDOSBox();
      }, 250);

    }
  }, false);

}
