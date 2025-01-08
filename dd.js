SIZE = (4*[1000*1000]) / 4	/* MAX 2GB / 4 - 512MB SIZE */
BUFFER = 512				/* 512KB BUFFER */

/* dd Debug */
var LEVEL = "progress";		/* none - noxfer - progress */

/* dd File System */
var ZERO = "/dev/zero";

function createHDimage() {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Create Hard Disk Image: Partitioning Please Wait...");

  var nativeClient = document.createElement("EMBED");

  nativeClient.setAttribute("id", "dd");
  nativeClient.setAttribute("width", 0);
  nativeClient.setAttribute("height", 0);
  nativeClient.setAttribute("PS_STDOUT", "/dev/tty");
  nativeClient.setAttribute("PS_TTY_PREFIX", "tty:");
  nativeClient.setAttribute("PS_EXIT_MESSAGE", "exit");
  nativeClient.setAttribute("src", "dd.nmf");
  nativeClient.setAttribute("type", "application/x-nacl");
  nativeClient.setAttribute("ARG0", "dd");
  nativeClient.setAttribute("ARG1", "if=" + ZERO);
  nativeClient.setAttribute("ARG2", "of=" + VI_DRIVE + "/VHD.IMG");
  nativeClient.setAttribute("ARG3", "count=" + SIZE);
  nativeClient.setAttribute("ARG4", "bs=" + BUFFER);
  nativeClient.setAttribute("ARG5", "status=" + LEVEL);

  document.getElementById('nativeClient').appendChild(nativeClient);

  console.warn("Waiting for debugger...");

  nativeClient.addEventListener("message", function handleDDmessage(message) {
    if (typeof message.data == "string" && message.data.startsWith("tty:")) {

      console.log("tty: " + message.data.slice(4, message.data.length));

    } else {

      console.log("tty: " + message.data);
      nativeClient.removeEventListener("message", handleDDmessage, false);
      document.getElementById('nativeClient').removeChild(nativeClient);
      partitionHDimage();

    }
  }, false);

}

function createRemovableImage() {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Create Removable Disk Image: Partitioning Please Wait...");

  var nativeClient = document.createElement("EMBED");

  nativeClient.setAttribute("id", "dd");
  nativeClient.setAttribute("width", 0);
  nativeClient.setAttribute("height", 0);
  nativeClient.setAttribute("PS_STDOUT", "/dev/tty");
  nativeClient.setAttribute("PS_TTY_PREFIX", "tty:");
  nativeClient.setAttribute("PS_EXIT_MESSAGE", "exit");
  nativeClient.setAttribute("src", "dd.nmf");
  nativeClient.setAttribute("type", "application/x-nacl");
  nativeClient.setAttribute("ARG0", "dd");
  nativeClient.setAttribute("ARG1", "if=" + ZERO);
  nativeClient.setAttribute("ARG2", "of=" + VI_DRIVE + "/VRD.IMG");
  nativeClient.setAttribute("ARG3", "count=" + SIZE);
  nativeClient.setAttribute("ARG4", "bs=" + BUFFER);
  nativeClient.setAttribute("ARG5", "status=" + LEVEL);

  document.getElementById('nativeClient').appendChild(nativeClient);

  console.warn("Waiting for debugger...");

  nativeClient.addEventListener("message", function handleDDmessage(message) {
    if (typeof message.data == "string" && message.data.startsWith("tty:")) {

      console.log("tty: " + message.data.slice(4, message.data.length));

    } else {

      console.log("tty: " + message.data);
      nativeClient.removeEventListener("message", handleDDmessage, false);
      document.getElementById('nativeClient').removeChild(nativeClient);
      partitionRemovableImage();

    }
  }, false);

}
