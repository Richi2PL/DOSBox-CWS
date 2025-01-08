WINDOW_H_FRAME = window.outerHeight - window.innerHeight; /* WINDOW DECORATION */

FS_SIZE = 1024*1024 /* UNLIMITED STORAGE */

VFD_SIZE = 1000*(2.88*1024) 		/* VIRTUAL FLOPPY DRIVE */
VHD_SIZE = (1000*[2000*1024]) / 4	/* VIRTUAL HARD DISK DRIVE */
VCD_SIZE = 1000*(700*1024)			/* VIRTUAL CD-ROM DRIVE */
VRD_SIZE = VHD_SIZE					/* VIRTUAL REMOVABLE DRIVE */

/* DOSBox File System */
var HOME = "/mnt/html5/home/user/.dosbox";
var CAPTURE = HOME + "/capture";
var VI_DRIVE = HOME + "/VI_DRIVE";
var C_DRIVE = HOME + "/C_DRIVE";
var D_DRIVE = HOME + "/D_DRIVE";

var hdDriveFreesizes = [
                        "256 MB",
                        "512 MB",
                        "1 GB",
                        "2 GB"
                       ];

VFD_0 = false;
VFD_1 = false;
VHD = false;
VCD = false;
VRD = false;

/* DOSBox Screen */
var dosboxWVGAwidth = 384 * 2;
var dosboxWVGAheight = 240 * 2;
var dosboxWidth = 320 * 2;
var dosboxHeight = 200 * 2;

var dosboxVideoModes = [
                        "NORMAL",
                        "TV",
                        "RGB",
                        "SCAN",
                        "ADVMAME",
                        "ADVINTERP",
                        "SAI",
                        "SUPERSAI",
                        "SUPEREAGLE",
                        "HQ"
                       ];

var naclScale = 1;

/* Memory */
var memorySizes = [
                   "4 MByte",
                   "8 MByte",
                   "16 MByte",
                   "32 MByte",
                   "64 MByte"
                  ];

/* Timings */
var popupTimer = 5000;

function errorHandler(error) {

  error = error.toString().replace("DOMException: ", "");

  console.error(error);
  document.getElementById('splash').style.zIndex = "0";
  updatePopup(error);

}

function readDOSBoxConfig() {

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getFile("dosbox-0.74.conf", {}, function(fileEntry) {

            fileEntry.file(function(file) {

              var reader = new FileReader();
              var result = null;

              reader.onloadend = function() {
                console.log("--- BEGIN ---");
                console.log(this.result);
                console.log("---- END ----");
              };

              reader.readAsText(file);

            }, errorHandler);

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function writeDOSBoxConfig() {

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getFile("dosbox-0.74.conf", {create: true}, function(fileEntry) {

            fileEntry.createWriter(function(fileWriter) {

              fileWriter.onwriteend = function() {
                console.log("Writing config");
                readDOSBoxConfig();
              }

              fileWriter.onerror = function() {
                console.log("Writing config error");
              }

              window.VM = [];

              var mouseSensitivity = document.getElementById('mouseSensitivity').value;
              VM.push(mouseSensitivity);

              var memorySize = document.getElementById('memorySize').value;
              memorySize = memorySize.split(" ");
              memorySize = memorySize[0];
              VM.push(memorySize);

              for (i=0; i<cpuTypes.length; i++) {

                if (cpuTypes[i].includes(document.getElementById('cpuType').value)) {
                  var cpuInfo = cpuTypes[i];
                  cpuInfo = cpuInfo.split("-");
                  var cpuType = cpuInfo[0].split(" ");
                  cpuType = cpuType[0] + "_slow";
                  cpuType = cpuType.toLowerCase();
                  var cpuCycles = "fixed " + cpuInfo[1];
                  VM.push(cpuType);
                  VM.push(cpuCycles);
                  break;
                }

              }

              var freesize = document.getElementById('hdDriveSize').value;
              freesize = freesize.split(" ");
              freesize = parseInt(freesize[0]);

              if (freesize < 256) {
                freesize = freesize * 1024;
              }

              VM.push(freesize);

              var autoexecLines = document.getElementById('autoexecLines').value;

              console.log("Virtual Machine: " + VM);
              console.log("Autoexec: " + autoexecLines);

              var dosboxConfig = setDOSBoxConfig(VM, autoexecLines);

              var blob = new Blob([dosboxConfig], {type: 'text/plain'});

              fileWriter.write(blob);

            }, errorHandler);

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function removeDOSBoxConfig() {

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getFile("dosbox-0.74.conf", {}, function(fileEntry) {

            fileEntry.remove(function() {
              console.log("Removing config");
              writeDOSBoxConfig();
            }, errorHandler);

          }, writeDOSBoxConfig);
        }, writeDOSBoxConfig);
      }, writeDOSBoxConfig);
    }, writeDOSBoxConfig);
  }, errorHandler);

}

function updateSettings() {

  var aspectRatio = false;
  var enableMouseLock = false;

  if (document.getElementById('aspectRatio').innerHTML == "ON") {
    document.getElementById('aspectRatio').classList.remove('OFF');
    document.getElementById('aspectRatio').classList.add('ON');
    aspectRatio = true;
  } else {
    document.getElementById('aspectRatio').classList.remove('ON');
    document.getElementById('aspectRatio').classList.add('OFF');
    aspectRatio = true;
  }

  if (document.getElementById('enableMouseLock').innerHTML == "ON") {
    document.getElementById('enableMouseLock').classList.remove('OFF');
    document.getElementById('enableMouseLock').classList.add('ON');
    enableMouseLock = true;
  } else {
    document.getElementById('enableMouseLock').classList.remove('ON');
    document.getElementById('enableMouseLock').classList.add('OFF');
    enableMouseLock = true;
  }

  var updateSettingsInterval = setInterval (function() {
    if (aspectRatio == true &&
        enableMouseLock == true) {

      clearInterval(updateSettingsInterval);
      removeDOSBoxConfig();

    }
  }, 250);

}

function loadAutoexec() {

  chrome.storage.sync.get({
    autoexecLines: "# Lines in this section will be run at startup."
  }, function(items) {
    document.getElementById('autoexecLines').value = items.autoexecLines;
	updateSettings();
  });
  
}

function syncAutoexec() {

  var autoexecLines = document.getElementById('autoexecLines').value;
  chrome.storage.sync.set({
    autoexecLines: autoexecLines
  }, removeDOSBoxConfig);

}

function resetAutoexec() {

  document.getElementById('autoexecLines').value = "# Lines in this section will be run at startup.";
  syncAutoexec();

}

function loadSettings() {

  chrome.storage.sync.get({
    cpuType: "486 DX 25",
    memorySize: "4 MByte",
    videoMode: "NORMAL",
    aspectRatio: "OFF",
    enableMouseLock: "OFF",
    mouseSensitivity: 100,
    hdDriveSize: "256 MB"
  }, function(items) {
    document.getElementById('cpuType').value = items.cpuType;
    document.getElementById('memorySize').value = items.memorySize;
    document.getElementById('videoMode').value = items.videoMode;
    document.getElementById('aspectRatio').innerHTML = items.aspectRatio;
    document.getElementById('enableMouseLock').innerHTML = items.enableMouseLock;
    document.getElementById('mouseSensitivity').value = items.mouseSensitivity;
    document.getElementById('hdDriveSize').value = items.hdDriveSize;
	loadAutoexec();
  });

}

function syncSettings() {

  var cpuType = document.getElementById('cpuType').value;
  var memorySize = document.getElementById('memorySize').value;
  var videoMode = document.getElementById('videoMode').value;
  var aspectRatio = document.getElementById('aspectRatio').innerHTML;
  var enableMouseLock = document.getElementById('enableMouseLock').innerHTML;
  var mouseSensitivity = document.getElementById('mouseSensitivity').value;
  var hdDriveSize = document.getElementById('hdDriveSize').value;

  chrome.storage.sync.set({
    cpuType: cpuType,
    memorySize: memorySize,
    videoMode: videoMode,
    aspectRatio: aspectRatio,
    enableMouseLock: enableMouseLock,
    mouseSensitivity: mouseSensitivity,
    hdDriveSize: hdDriveSize
  }, updateSettings);

}

function resetSettings() {

  document.getElementById('cpuType').value = "486 DX 25";
  document.getElementById('memorySize').value = "4 MByte";
  document.getElementById('videoMode').value = "NORMAL";
  document.getElementById('aspectRatio').innerHTML = "OFF";
  document.getElementById('enableMouseLock').innerHTML = "OFF";
  document.getElementById('mouseSensitivity').value = 100;
  syncSettings();

}

function onInitFs() {

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {create: true}, function(dirEntry) {
      dirEntry.getDirectory("user", {create: true}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {create: true}, function(dirEntry) {

          dirEntry.getDirectory("VI_DRIVE", {create: true}, function(dirEntry) {
            var reader = dirEntry.createReader();
            reader.readEntries(function(entries) {
              console.log("VIRTUAL IMAGES", entries);
              for (var i=0; i<entries.length; i++) {
                if (entries[i].name.includes("VFD_0")) {
                  VFD_0 = true;
                }
                if (entries[i].name.includes("VFD_1")) {
                  VFD_1 = true;
                }
                if (entries[i].name.includes("VHD")) {
                  VHD = true;
                }
                if (entries[i].name.includes("VRD")) {
                  VRD = true;
                }
              }
            }, errorHandler);
          }, errorHandler);

          dirEntry.getDirectory("C_DRIVE", {create: true}, function(dirEntry) {
            var reader = dirEntry.createReader();
            reader.readEntries(function(entries) {
              console.log("C:\\>", entries);
            }, errorHandler);
          }, errorHandler);

          dirEntry.getDirectory("D_DRIVE", {create: true}, function(dirEntry) {
            var reader = dirEntry.createReader();
            reader.readEntries(function(entries) {
              console.log("D:\\>", entries);
              for (var j=0; j<entries.length; j++) {
                if (entries[j].name.includes("CDROM")) {
                  VCD = true;
                }
              }
              loadSettings();
            }, errorHandler);
          }, errorHandler);

        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function scaleBackgroundImage() {

  chrome.windows.getCurrent(function(extensionWindow) {
    if (extensionWindow.state === "fullscreen") {
      var backgroundImageTop = ([screen.height + 64] - 196) / 2;
      var backgroundImageLeft = (screen.width - 172) / 2;
    } else {
      if (window.innerHeight > 464) {
        var backgroundImageTop = ([window.innerHeight + 64] - 196) / 2;
      } else {
        var backgroundImageTop = ([[200 * 2] - 196] / 2) + 64;
      }
      if (window.innerWidth > [320 * 2]) {
        var backgroundImageLeft = (window.innerWidth - 172) / 2;
      } else {
        var backgroundImageLeft = ([320 * 2] - 172) / 2;
      }
    }
    document.getElementById('backgroundImage').style.top = backgroundImageTop + "px";
    document.getElementById('backgroundImage').style.left = backgroundImageLeft + "px";
  });

}

function scaleSettingsPanel() {

  chrome.windows.getCurrent(function(extensionWindow) {
    if (extensionWindow.state === "fullscreen") {
      var settingsPanelHeight = screen.height - 64;
    } else {
      var settingsPanelHeight = window.innerHeight - 64;
    }
    document.getElementById('settingsPanel').style.top = "64px";
    document.getElementById('settingsPanel').style.height = settingsPanelHeight + "px";
    document.getElementById('settingsPanel').style.overflowY = "scroll";
  });

}

function scaleNativeClient() {

  chrome.windows.getCurrent(function(extensionWindow) {
    if (extensionWindow.state === "fullscreen") {
      if (document.getElementById('dosbox')) {
        document.getElementById('topPanel').style.visibility = "hidden";
        if (document.getElementById('splash').style.zIndex == "0") {
          hideContextMenu();
          closeSidePanel();
        }
      }
      var nativeClientTop = (screen.height - dosboxHeight) / 2;
      var nativeClientLeft = (screen.width - dosboxWidth) / 2;
      var naclScaleWidth = screen.width / dosboxWidth;
      var naclScaleHeight = screen.height / dosboxHeight;
    } else {
      document.getElementById('topPanel').style.visibility = "visible";
      if (window.innerHeight > 464) {
        var nativeClientTop = ([window.innerHeight + 64] - dosboxHeight) / 2;
        var naclScaleHeight = (window.innerHeight - 64) / dosboxHeight;
      } else {
        var nativeClientTop = 64;
        var naclScaleHeight = naclScale;
      }
      if (window.innerWidth > [320 * 2]) {
        var nativeClientLeft = (window.innerWidth - dosboxWidth) / 2;
        var naclScaleWidth = window.innerWidth / dosboxWidth;
      } else {
        var nativeClientLeft = ([320 * 2] - dosboxWidth) / 2;
        var naclScaleWidth = naclScale;
      }
    }
    document.getElementById('nativeClient').style.top = nativeClientTop + "px";
    document.getElementById('nativeClient').style.left = nativeClientLeft + "px";
    if (document.getElementById('aspectRatio').innerHTML == "OFF") {
      document.getElementById('nativeClient').style.webkitTransform = "scale(" + naclScaleWidth + ", " + naclScaleHeight + ")";
    } else {
      document.getElementById('nativeClient').style.webkitTransform = "scale(" + naclScaleHeight + ")";
    }
  });

}

function scalePopup() {

  chrome.windows.getCurrent(function(extensionWindow) {
    if (extensionWindow.state === "fullscreen") {
      var popupTop = screen.height - 48;
      var popupLeft = (screen.width - 480) / 2;
    } else {
      if (window.innerHeight > 464) {
        var popupTop = window.innerHeight - 48;
      } else {
        var popupTop = (dosboxHeight + 64) - 48;
      }
      if (window.innerWidth > [320 * 2]) {
        var popupLeft = (window.innerWidth - 480) / 2;
      } else {
        var popupLeft = (dosboxWidth - 480) / 2;
      }
    }
    document.getElementById('popup').style.top = popupTop + "px";
    document.getElementById('popup').style.left = popupLeft + "px";
  });

}

function scaleExtensionWindow() {

  var extensionWindowWidth = (window.outerWidth - window.innerWidth) + window.outerWidth;
  var extensionWindowHeight = WINDOW_H_FRAME + window.outerHeight;
  var extensionWindowTop = (screen.height - extensionWindowHeight) / 2;
  var extensionWindowLeft = (screen.width - extensionWindowWidth) / 2;

  window.resizeTo(extensionWindowWidth, extensionWindowHeight);
  window.moveTo(extensionWindowLeft, extensionWindowTop);

  scaleBackgroundImage();
  scaleSettingsPanel();
  scaleNativeClient();
  scalePopup();

  chrome.windows.onBoundsChanged.addListener(scaleBackgroundImage);
  chrome.windows.onBoundsChanged.addListener(scaleSettingsPanel);
  chrome.windows.onBoundsChanged.addListener(scaleNativeClient);
  chrome.windows.onBoundsChanged.addListener(scalePopup);

}

function restoreExtensionWindow() {

  chrome.windows.getCurrent(function(extensionWindow) {

    if (extensionWindow.state === "fullscreen") {
      document.getElementById('topPanel').style.visibility = "visible";
    }

  });

  document.getElementById('nativeClient').innerHTML = "";
  document.getElementById("nativeClient").style.zIndex = "1";
  document.getElementById('backgroundImage').style.visibility = "visible";
  document.body.style.backgroundColor = "#2c2c2c";

}

function toggleFullscreen() {

  chrome.windows.getCurrent(function(extensionWindow) {

    if (extensionWindow.state === "fullscreen") {

      chrome.windows.update(extensionWindow.id, {state: "normal"});
      window.resizeTo(dosboxWidth, [(WINDOW_H_FRAME + 64) + dosboxHeight]);

    } else {

      chrome.windows.update(extensionWindow.id, {state: "fullscreen"});

    }

  });

}

function closeSidePanel() {

  document.getElementById('sidePanel').style.width = 0;
  document.getElementById('sidePanel').style.borderRightStyle = "none";
  document.getElementById('settingsPanel').style.width = 0;
  document.getElementById('settingsPanel').style.borderRightStyle = "none";
  document.getElementById('systemBootPanel').style.width = 0;
  document.getElementById('systemBootPanel').style.borderRightStyle = "none";
  document.getElementById('fileManagerPanel').style.width = 0;
  document.getElementById('fileManagerPanel').style.borderRightStyle = "none";
  document.getElementById('helpPanel').style.width = 0;
  document.getElementById('helpPanel').style.borderRightStyle = "none";
  if (document.getElementById('dosbox')) {
    document.getElementById('dosbox').focus();
  }

}

function hideContextMenu() {

  document.getElementById('floppyDriveContextMenu').style.visibility = "hidden";
  document.getElementById('hdDriveContextMenu').style.visibility = "hidden";
  document.getElementById('cdromDriveContextMenu').style.visibility = "hidden";
  document.getElementById('removableDriveContextMenu').style.visibility = "hidden";

}

function updatePopup(message) {

  var updatePopupTimer = 0;

  document.getElementById('popup').innerHTML = message;
  document.getElementById('popup').style.visibility = "visible";
  var updatePopupInterval = setInterval (function() {
    updatePopupTimer = updatePopupTimer + 250;
    if (document.getElementById('popup').innerHTML == message && updatePopupTimer >= popupTimer) {
      document.getElementById('popup').innerHTML = "";
      document.getElementById('popup').style.visibility = "hidden";
      clearInterval(updatePopupInterval);
    } else if (document.getElementById('popup').innerHTML != message) {
      clearInterval(updatePopupInterval);
    }
  }, 250);

}

function handleFloppiesSelect(e) {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Mount Floppy Images: Mounting Please Wait...");

  var files = e.target.files;

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("VI_DRIVE", {create: true}, function(fileEntry) {

            var floppiesNumber = files.length;
            var floppyNumber = 0;

            for (var i=0, file; file = files[i]; ++i) {

              var fileName = "VFD_" + i + ".IMG";
              var fileSize = file.size;

              if (floppiesNumber <= 2) {

                floppyNumber = floppyNumber + 1;

                if (floppyNumber == 1) {
                  VFD_0 = true;
                }
                if (floppyNumber == 2) {
                  VFD_1 = true;
                }

                if (fileSize <= VFD_SIZE) {

                  (function(f) {

                    if (floppyNumber == floppiesNumber) {

                      removeDOSBoxConfig();
                      setTimeout (function() {
                        document.getElementById('splash').style.zIndex = "0";
                        startDOSBox();
                      }, 250);

                    }

                    fileEntry.getFile(fileName, {create: true}, function(fileEntry) {
                      fileEntry.createWriter(function(fileWriter) {

                        fileWriter.write(f);

                      }, errorHandler);
                    }, errorHandler);

                  })(file);

                } else {

                  document.getElementById('splash').style.zIndex = "0";
                  updatePopup("Mount Floppy Images: File Is Not A Floppy Image");
                  break;

                }

              } else {

                document.getElementById('splash').style.zIndex = "0";
                updatePopup("Mount Floppy Images: Floppy Images Limit Has Been Exceeded!");
                break;

              }

            }

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function removeFloppyImages() {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Unmount Floppy Image: Unmounting Please Wait...");

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("VI_DRIVE", {}, function(dirEntry) {

            dirEntry.getFile("VFD_0.IMG", {}, function(fileEntry) {
              fileEntry.remove(function() {
                VFD_0 = false;
                if (VFD_1 == false) {
                  removeDOSBoxConfig();
                  setTimeout (function() {
                    document.getElementById('splash').style.zIndex = "0";
                    startDOSBox();
                  }, 250);
                }
              }, errorHandler);
            }, errorHandler);

            if (VFD_1 == true) {
              dirEntry.getFile("VFD_1.IMG", {}, function(fileEntry) {
                fileEntry.remove(function() {
                  VFD_1 = false;
                  removeDOSBoxConfig();
                  setTimeout (function() {
                    document.getElementById('splash').style.zIndex = "0";
                    startDOSBox();
                  }, 250);
                }, errorHandler);
              }, errorHandler);
            }

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function createNode(dirEntry, file, nextNode) {

  var iNode = file.webkitRelativePath.split("/");

  if (nextNode < (iNode.length - 1)) {

    dirEntry.getDirectory(iNode[nextNode], {create: true}, function(dirEntry) {
      createNode(dirEntry, file, nextNode);
    }, errorHandler);

  } else {

    dirEntry.getFile(iNode[nextNode], {create: true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {

        fileWriter.onwriteend = function() {

          var relativePath = file.webkitRelativePath;

          for (j=0; j<relativePath.length; j++) {
            relativePath = relativePath.replace("/", "\\");
          }

          console.log("Import Directory: C:\\" + relativePath + "...");

        }

        fileWriter.write(file);

      }, errorHandler);
    }, errorHandler);

  }

  nextNode = nextNode + 1;

}

function handleDirectorySelect(e) {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Import Directory: Copying Please Wait...");

  var files = e.target.files;

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("C_DRIVE", {}, function(dirEntry) {

            for (i=0; i<files.length; i++) {

              var file = files[i];
              var nextNode = 0;

              createNode(dirEntry, file, nextNode);

              if ((i + 1) == files.length) {

                document.getElementById('splash').style.zIndex = "0";
                startDOSBox();

              }

            }

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function removeTEMPfile(fileName) {

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getFile(fileName, {}, function(fileEntry) {

          fileEntry.remove(function() {
            console.log("Removing " + fileName);
            setTimeout (function() {
              document.getElementById('splash').style.zIndex = "0";
              startDOSBox();
            }, 250);
          }, errorHandler);

        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function handleZIPselect(e) {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Import ZIP File: Uncompressing Please Wait...");

  var file = e.target.files[0];
  var reader = new FileReader();
  var result = null;

  reader.onloadend = onReadSuccess;
  reader.onerror = errorHandler;
  reader.readAsArrayBuffer(file);

  var fileExtension = file.name.split(".");
  fileExtension = fileExtension[fileExtension.length - 1];
  fileExtension = fileExtension.toLowerCase();

  function onReadSuccess() {
    result = this.result;
    if (fileExtension == "zip") {
      window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, onRequestQuotaSuccess, errorHandler);
    } else {
      document.getElementById('splash').style.zIndex = "0";
      updatePopup("Import ZIP File: File Is Not A Compress Format!");
    }
  }

  function onRequestQuotaSuccess(fs) {

    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {

        dirEntry.getFile(file.name, {create: true}, onGetFileSuccess, errorHandler);

      }, errorHandler);
    }, errorHandler);

  }

  function onGetFileSuccess(fileEntry) {
    fileEntry.createWriter(onCreateWriterSuccess, errorHandler);
  }

  function onCreateWriterSuccess(writer) {
    writer.onwriteend = onWriteSuccess;
    writer.onerror = errorHandler;
    var blob = new Blob([result]);
    writer.write(blob);
  }

  function onWriteSuccess() {
    extractZIPfile(file.name);
  }

}

function removeHDdrive() {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Format Hard Disk Drive: Formatting Please Wait...");

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("C_DRIVE", {}, function(dirEntry) {

            dirEntry.removeRecursively(function() {
              onInitFs();
              setTimeout (function() {
                document.getElementById('splash').style.zIndex = "0";
                startDOSBox();
              }, 250);
            }, errorHandler);

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function handleHDselect(e) {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Mount Hard Disk Image: Mounting Please Wait...");

  var file = e.target.files[0];
  var reader = new FileReader();
  var result = null;

  reader.onloadend = onReadSuccess;
  reader.onerror = errorHandler;
  reader.readAsArrayBuffer(file);

  var fileExtension = file.name.split(".");
  fileExtension = fileExtension[fileExtension.length - 1];
  fileExtension = fileExtension.toLowerCase();

  function onReadSuccess() {
    result = this.result;
    if (file.size == VHD_SIZE) {
      if (fileExtension == "img") {
        window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, onRequestQuotaSuccess, errorHandler);
      } else {
        document.getElementById('splash').style.zIndex = "0";
        updatePopup("Mount Hard Disk Image: File Is Not A Hard Disk Image!");
      }
    } else {
      document.getElementById('splash').style.zIndex = "0";
      updatePopup("Mount Hard Disk Image: File Is Not A " + (VHD_SIZE / 1000000) + " MB Hard Disk Image!");
    }
  }

  function onRequestQuotaSuccess(fs) {

    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("VI_DRIVE", {}, function(dirEntry) {

            dirEntry.getFile("VHD.IMG", {create: true}, onGetFileSuccess, errorHandler);

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);

  }

  function onGetFileSuccess(fileEntry) {
    fileEntry.createWriter(onCreateWriterSuccess, errorHandler);
  }

  function onCreateWriterSuccess(writer) {
    writer.onwriteend = onWriteSuccess;
    writer.onerror = errorHandler;
    var blob = new Blob([result]);
    writer.write(blob);
  }

  function onWriteSuccess() {
    VHD = true;
    removeDOSBoxConfig();
    setTimeout (function() {
      document.getElementById('splash').style.zIndex = "0";
      startDOSBox();
    }, 250);
  }

}

function removeHDimage() {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Unmount Hard Disk Image: Unmounting Please Wait...");

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("VI_DRIVE", {}, function(dirEntry) {
            dirEntry.getFile("VHD.IMG", {}, function(fileEntry) {

              fileEntry.remove(function() {
                VHD = false;
                removeDOSBoxConfig();
                setTimeout (function() {
                  document.getElementById('splash').style.zIndex = "0";
                  startDOSBox();
                }, 250);
              }, errorHandler);

            }, errorHandler);
          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function cleanCDROMimage(fileName) {

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("D_DRIVE", {}, function(dirEntry) {
            dirEntry.getDirectory("CDROM", {}, function(dirEntry) {

              dirEntry.removeRecursively(function() {
                console.log("Cleaning CD-ROM image");
                extractISOfile(fileName);
              }, errorHandler);

            }, function(dirEntry) {
                 console.log("Cleaning CD-ROM image error");
                 extractISOfile(fileName);
               });

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function handleCDROMselect(e) {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Mount CD-ROM Image: Mounting Please Wait...");

  var file = e.target.files[0];
  var reader = new FileReader();
  var result = null;

  reader.onloadend = onReadSuccess;
  reader.onerror = errorHandler;
  reader.readAsArrayBuffer(file);

  var fileExtension = file.name.split(".");
  fileExtension = fileExtension[fileExtension.length - 1];
  fileExtension = fileExtension.toLowerCase();

  function onReadSuccess() {
    result = this.result;
    if (file.size <= VCD_SIZE) {
      if (fileExtension == "iso") {
        window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, onRequestQuotaSuccess, errorHandler);
      } else {
        document.getElementById('splash').style.zIndex = "0";
        updatePopup("Mount CD-ROM Image: File Is Not An ISO Image!");
      }
    } else {
      document.getElementById('splash').style.zIndex = "0";
      updatePopup("Mount CD-ROM Image: File Is Not A CD-ROM Image!");
    }
  }

  function onRequestQuotaSuccess(fs) {

    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {

        dirEntry.getFile(file.name, {create: true}, onGetFileSuccess, errorHandler);

      }, errorHandler);
    }, errorHandler);

  }

  function onGetFileSuccess(fileEntry) {
    fileEntry.createWriter(onCreateWriterSuccess, errorHandler);
  }

  function onCreateWriterSuccess(writer) {
    writer.onwriteend = onWriteSuccess;
    writer.onerror = errorHandler;
    var blob = new Blob([result]);
    writer.write(blob);
  }

  function onWriteSuccess() {
    cleanCDROMimage(file.name);
  }

}

function removeCDROMimage() {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Unmount CD-ROM Image: Unmounting Please Wait...");

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("D_DRIVE", {}, function(dirEntry) {

            dirEntry.removeRecursively(function() {
              VCD = false;
              onInitFs();
              setTimeout (function() {
                document.getElementById('splash').style.zIndex = "0";
                startDOSBox();
              }, 250);
            }, errorHandler);

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function handleRemovableSelect(e) {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Mount Removable Disk Image: Mounting Please Wait...");

  var file = e.target.files[0];
  var reader = new FileReader();
  var result = null;

  reader.onloadend = onReadSuccess;
  reader.onerror = errorHandler;
  reader.readAsArrayBuffer(file);

  var fileExtension = file.name.split(".");
  fileExtension = fileExtension[fileExtension.length - 1];
  fileExtension = fileExtension.toLowerCase();

  function onReadSuccess() {
    result = this.result;
    if (file.size == VRD_SIZE) {
      if (fileExtension == "img") {
        window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, onRequestQuotaSuccess, errorHandler);
      } else {
        document.getElementById('splash').style.zIndex = "0";
        updatePopup("Mount Removable Disk Image: File Is Not A Removable Disk Image!");
      }
    } else {
      document.getElementById('splash').style.zIndex = "0";
      updatePopup("Mount Removable Disk Image: File Is Not A " + (VRD_SIZE / 1000000) + " MB Removable Disk Image!");
    }
  }

  function onRequestQuotaSuccess(fs) {

    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("VI_DRIVE", {}, function(dirEntry) {

            dirEntry.getFile("VRD.IMG", {create: true}, onGetFileSuccess, errorHandler);

          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);

  }

  function onGetFileSuccess(fileEntry) {
    fileEntry.createWriter(onCreateWriterSuccess, errorHandler);
  }

  function onCreateWriterSuccess(writer) {
    writer.onwriteend = onWriteSuccess;
    writer.onerror = errorHandler;
    var blob = new Blob([result]);
    writer.write(blob);
  }

  function onWriteSuccess() {
    VRD = true;
    removeDOSBoxConfig();
    setTimeout (function() {
      document.getElementById('splash').style.zIndex = "0";
      startDOSBox();
    }, 250);
  }

}

function removeRemovableImage() {

  document.getElementById('splash').style.zIndex = "4";
  updatePopup("Unmount Removable Disk Image: Unmounting Please Wait...");

  window.webkitRequestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
    fs.root.getDirectory("home", {}, function(dirEntry) {
      dirEntry.getDirectory("user", {}, function(dirEntry) {
        dirEntry.getDirectory(".dosbox", {}, function(dirEntry) {
          dirEntry.getDirectory("VI_DRIVE", {}, function(dirEntry) {
            dirEntry.getFile("VRD.IMG", {}, function(fileEntry) {

              fileEntry.remove(function() {
                VRD = false;
                removeDOSBoxConfig();
                setTimeout (function() {
                  document.getElementById('splash').style.zIndex = "0";
                  startDOSBox();
                }, 250);
              }, errorHandler);

            }, errorHandler);
          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);

}

function startDOSBox() {

  document.getElementById('backgroundImage').style.visibility = "hidden";
  document.body.style.backgroundColor = "#000000";

  chrome.windows.getCurrent(function(extensionWindow) {

    if (extensionWindow.state === "fullscreen") {
      document.getElementById('topPanel').style.visibility = "hidden";
    }

  });

  var nativeClient = document.createElement("EMBED");

  nativeClient.setAttribute("id", "dosbox");
  nativeClient.setAttribute("width", dosboxWVGAwidth);
  nativeClient.setAttribute("height", dosboxWVGAheight);
  nativeClient.setAttribute("sdl_tar_extract", "dosbox_tools.tar:" + C_DRIVE);
  nativeClient.setAttribute("PS_STDOUT", "/dev/tty");
  nativeClient.setAttribute("PS_TTY_PREFIX", "tty:");
  nativeClient.setAttribute("PS_EXIT_MESSAGE", "exit");
  nativeClient.setAttribute("src", "dosbox.nmf");
  nativeClient.setAttribute("type", "application/x-nacl");
  nativeClient.setAttribute("ARG0", "dosbox");
  nativeClient.setAttribute("ARG1", "-scaler");
  
  if (document.getElementById('videoMode').value == "NORMAL") {
    nativeClient.setAttribute("ARG2", "normal2x");
    console.log("Set video mode: Normal");
  }
  if (document.getElementById('videoMode').value == "TV") {
    nativeClient.setAttribute("ARG2", "tv2x");
    console.log("Set video mode: Tv2x");
  }
  if (document.getElementById('videoMode').value == "RGB") {
    nacl.setAttribute("ARG2", "rgb2x");
    console.log("Set video mode: Rgb2x");
  }
  if (document.getElementById('videoMode').value == "SCAN") {
    nativeClient.setAttribute("ARG2", "scan2x");
    console.log("Set video mode: Scan2x");
  }
  if (document.getElementById('videoMode').value == "ADVMAME") {
    nativeClient.setAttribute("ARG2", "advmame2x");
    console.log("Set video mode: Advmame2x");
  }
  if (document.getElementById('videoMode').innerHTML == "ADVINTERP") {
    nativeClient.setAttribute("ARG2", "advinterp2x");
    console.log("Set video mode: Advinterp2x");
  }
  if (document.getElementById('videoMode').value == "SAI") {
    nativeClient.setAttribute("ARG2", "2xsai");
    console.log("Set video mode: 2xsai");
  }
  if (document.getElementById('videoMode').value == "SUPERSAI") {
    nativeClient.setAttribute("ARG2", "super2xsai");
    console.log("Set video mode: Super2xsai");
  }
  if (document.getElementById('videoMode').value == "SUPEREAGLE") {
    nativeClient.setAttribute("ARG2", "supereagle");
    console.log("Set video mode: Supereagle");
  }
  if (document.getElementById('videoMode').value == "HQ") {
    nativeClient.setAttribute("ARG2", "hq2x");
    console.log("Set video mode: Hq2x");
  }

  document.getElementById('nativeClient').innerHTML = "";
  document.getElementById('nativeClient').appendChild(nativeClient);
  document.getElementById("nativeClient").style.zIndex = "2";

  if (document.getElementById('dosbox')) {
    document.getElementById('dosbox').focus();
  }

  console.warn("Waiting for debugger...");

  nativeClient.addEventListener("message", function handleDOSBoxMessage(message) {
    if (typeof message.data == "string" && message.data.startsWith("tty:")) {

      console.log("tty: " + message.data.slice(4, message.data.length));

      if (message.data.includes("Setting video mode")) {

        var dosboxVideoMode = message.data.split(" ");
        dosboxVideoMode = dosboxVideoMode[3];
        dosboxVideoMode = dosboxVideoMode.split("-");
        dosboxVideoMode = dosboxVideoMode[0];

        var dosboxVideoResolution = dosboxVideoMode.split("x");
        dosboxWidth = parseInt(dosboxVideoResolution[0]);
        dosboxHeight = parseInt(dosboxVideoResolution[1]);

        var extensionWindowWidth = dosboxWidth;
        var extensionWindowHeight = WINDOW_H_FRAME + (64 + dosboxHeight);

        document.getElementById('nativeClient').style.width = dosboxWidth + "px";
        document.getElementById('nativeClient').style.height = dosboxHeight + "px";
        nativeClient.setAttribute("width", dosboxWidth);
        nativeClient.setAttribute("height", dosboxHeight);

        chrome.windows.getCurrent(function(extensionWindow) {

          if (extensionWindow.state === "normal") {

            window.resizeTo(extensionWindowWidth, extensionWindowHeight);

          } else {

            scaleNativeClient();

          }

        });

      }

      if (message.data.includes("Could not set windowed video mode")) {

        updatePopup("Could Not Set Video Mode!");
        restoreExtensionWindow();
        nativeClient.removeEventListener("message", handleDOSBoxMessage, false);

      }

      if (message.data.includes("Unhandled country information")) {

        updatePopup("Unhandled Country Information!");
        restoreExtensionWindow();
        nativeClient.removeEventListener("message", handleDOSBoxMessage, false);

      }

      if (message.data.includes("Reboot requested")) {

        updatePopup("Reboot Requested, Quitting Now!");
        restoreExtensionWindow();
        nativeClient.removeEventListener("message", handleDOSBoxMessage, false);

      }

    } else {

      console.log("tty: " + message.data);
      window.close();

    }
  }, false);

  /* Toggle Fullscreen [F11] */
  document.addEventListener("keydown", function(e) {
    if (e.keyCode == 122) {
      e.preventDefault();
      toggleFullscreen();
    }
  }, false);

  //Prevent DOSBox Special Keys
  document.addEventListener("keydown", function(e) { 	/* Alt + Enter - [Switch to full-screen (and back)] */
    if (e.keyCode == 13 && e.altKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + F4 - [Update cached information about mounted drives] */
    if (e.keyCode == 115 && e.ctrlKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + F5 - [Save a screenshot] */
    if (e.keyCode == 116 && e.ctrlKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + ALT + F5 - [Start/Stop recording of AVI video] */
    if (e.keyCode == 116 && e.ctrlKey && e.altKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + F6 - [Start/Stop recording sound output to a wave file] */
    if (e.keyCode == 117 && e.ctrlKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + F7 - [Decreases frameskip] */
    if (e.keyCode == 118 && e.ctrlKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + ALT + F7 - [Start/Stop recording of OPL commands] */
    if (e.keyCode == 118 && e.ctrlKey && e.altKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + F8 - [Increases frameskip] */
    if (e.keyCode == 119 && e.ctrlKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + ALT + F8 - [Start/Stop the recording of raw MIDI commands] */
    if (e.keyCode == 119 && e.ctrlKey && e.altKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + F10 - [Capture/Release the mouse] */
    if (e.keyCode == 121 && e.ctrlKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + F11 - [Decrease DOSBox cycles] */
    if (e.keyCode == 122 && e.ctrlKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* CTRL + F12 - [Increase DOSBox cycles] */
    if (e.keyCode == 123 && e.ctrlKey) {
      e.preventDefault();
    }
  }, false);

  document.addEventListener("keydown", function(e) {	/* ALT + F12 - [Unlock speed] */
    if (e.keyCode == 123 && e.altKey) {
      e.preventDefault();
    }
  }, false);

  /* Mouse Lock [ESC] */
  nativeClient.onmousedown = function(e) {

    if (document.getElementById('enableMouseLock').innerHTML == "ON" && document.pointerLockElement == null) {

      e.preventDefault();
      nativeClient.requestPointerLock();
      var rAF = window.requestAnimationFrame(updateMouseStatus);

      function updateMouseStatus() {
        console.log("Mouse locked");

        document.addEventListener("keydown", function handleMouseUnlock(e) {
          if (e.keyCode == 27) {
            e.preventDefault();
            document.exitPointerLock();
            document.removeEventListener("keydown", handleMouseUnlock);
            window.cancelAnimationFrame(rAF);
            console.log("Mouse unlocked");
          }
        }, false);
      }

    }

  }

  closeSidePanel();

}

function domContentLoaded() {

  onInitFs();

  scaleExtensionWindow();

  updateCPUtypes();

  document.getElementById('splash').style.zIndex = "0";

  /* Side Panel */
  document.getElementById('startButton').addEventListener("click", function() {
    document.getElementById('sidePanel').style.width = "319px";
    document.getElementById('sidePanel').style.borderRightStyle = "solid";
    document.getElementById('sidePanel').style.borderRightWidth = "1px";
    document.getElementById('sidePanel').style.borderColor = "#222222";
  }, false);

  document.getElementById('playDOSBox').addEventListener("click", startDOSBox, false);
  document.getElementById('toggleFullscreen').addEventListener("click", toggleFullscreen, false);

  /* Settings Panel */
  document.getElementById('settings').addEventListener("click", function() {
    document.getElementById('settingsPanel').style.width = "319px";
    document.getElementById('settingsPanel').style.borderRightStyle = "solid";
    document.getElementById('settingsPanel').style.borderRightWidth = "1px";
    document.getElementById('settingsPanel').style.borderColor = "#222222";
  }, false);

  document.getElementById('cpuType').addEventListener("click", function() {
    for (var i=0; i<cpuTypes.length; i++) {
      if (cpuTypes[i].includes(document.getElementById('cpuType').value)) {
        var j = i + 1;
        if (j == cpuTypes.length) {
          j = 0;
        }
        var cpuType = cpuTypes[j];
        cpuType = cpuType.split("-");
        cpuType = cpuType[0];
        document.getElementById('cpuType').value = cpuType;
        break;
      }
    }
  }, false);

  document.getElementById('memorySize').addEventListener("click", function() {
    for (var i=0; i<memorySizes.length; i++) {
      if (document.getElementById('memorySize').value == memorySizes[i]) {
        if ((i + 1) < memorySizes.length) {
          document.getElementById('memorySize').value = memorySizes[i + 1];
		  break;
        } else {
          document.getElementById('memorySize').value = memorySizes[0];
        }
      }
    }
  }, false);

  document.getElementById('videoMode').addEventListener("click", function() {
    for (var i=0; i<dosboxVideoModes.length; i++) {
      if (document.getElementById('videoMode').value == dosboxVideoModes[i]) {
        if ((i + 1) < dosboxVideoModes.length) {
          document.getElementById('videoMode').value = dosboxVideoModes[i + 1];
		  break;
        } else {
          document.getElementById('videoMode').value = dosboxVideoModes[0];
        }
      }
    }
  }, false);

  document.getElementById('aspectRatio').addEventListener("click", function() {
    if (document.getElementById('aspectRatio').innerHTML == "OFF") {
      document.getElementById('aspectRatio').classList.remove('OFF');
      document.getElementById('aspectRatio').classList.add('ON');
      document.getElementById('aspectRatio').innerHTML = "ON";
    } else {
      document.getElementById('aspectRatio').classList.remove('ON');
      document.getElementById('aspectRatio').classList.add('OFF');
      document.getElementById('aspectRatio').innerHTML = "OFF";
    }
  }, false);

  document.getElementById('enableMouseLock').addEventListener("click", function() {
    if (document.getElementById('enableMouseLock').innerHTML == "OFF") {
      document.getElementById('enableMouseLock').classList.remove('OFF');
      document.getElementById('enableMouseLock').classList.add('ON');
      document.getElementById('enableMouseLock').innerHTML = "ON";
    } else {
      document.getElementById('enableMouseLock').classList.remove('ON');
      document.getElementById('enableMouseLock').classList.add('OFF');
      document.getElementById('enableMouseLock').innerHTML = "OFF";
    }
  }, false);

  document.getElementById('mouseSensitivity').addEventListener("blur", function() {
    if (document.getElementById('mouseSensitivity').value <= 0) {
      document.getElementById('mouseSensitivity').value = 1;
    }
    if (document.getElementById('mouseSensitivity').value > 1000) {
      document.getElementById('mouseSensitivity').value = 1000;
    }
  }, false);

  document.getElementById('syncSettings').addEventListener("click", syncSettings);
  document.getElementById('resetSettings').addEventListener("click", resetSettings);

  /* System Boot Panel */
  document.getElementById('systemBoot').addEventListener("click", function() {
    document.getElementById('systemBootPanel').style.width = "319px";
    document.getElementById('systemBootPanel').style.borderRightStyle = "solid";
    document.getElementById('systemBootPanel').style.borderRightWidth = "1px";
    document.getElementById('systemBootPanel').style.borderColor = "#222222";
  }, false);
  document.getElementById('closeSystemBootPanel').addEventListener("click", function() {
    document.getElementById('systemBootPanel').style.width = 0;
    document.getElementById('systemBootPanel').style.borderRightStyle = "none";
  }, false);

  document.getElementById('syncAutoexec').addEventListener("click", syncAutoexec);
  document.getElementById('resetAutoexec').addEventListener("click", resetAutoexec);

  /* File Manager Panel */
  document.getElementById('fileManager').addEventListener("click", function() {
    document.getElementById('fileManagerPanel').style.width = "319px";
    document.getElementById('fileManagerPanel').style.borderRightStyle = "solid";
    document.getElementById('fileManagerPanel').style.borderRightWidth = "1px";
    document.getElementById('fileManagerPanel').style.borderColor = "#222222";
  }, false);

  /* Floppy Drive Context Menu */
  document.getElementById('floppyDrive').addEventListener("click", function(e) {
    var contextMenuTop = e.clientY;
    var contextMenuLeft = e.clientX;
    if ((contextMenuTop + 218) >= window.outerHeight) {
      contextMenuTop = contextMenuTop - 218;
    }
    document.getElementById('floppyDriveContextMenu').style.top = contextMenuTop + "px";
    document.getElementById('floppyDriveContextMenu').style.left = contextMenuLeft + "px";
    document.getElementById('floppyDriveContextMenu').style.visibility = "visible";
  }, false);

  document.getElementById('mountFloppyImages').addEventListener("change", handleFloppiesSelect, false);
  document.getElementById('umountFloppyImages').addEventListener("click", removeFloppyImages, false);

  /* Hard Disk Drive Context Menu */
  document.getElementById('hdDrive').addEventListener("click", function(e) {
    var contextMenuTop = e.clientY;
    var contextMenuLeft = e.clientX;
    if ((contextMenuTop + 218) >= window.outerHeight) {
      contextMenuTop = contextMenuTop - 218;
    }
    document.getElementById('hdDriveContextMenu').style.top = contextMenuTop + "px";
    document.getElementById('hdDriveContextMenu').style.left = contextMenuLeft + "px";
    document.getElementById('hdDriveContextMenu').style.visibility = "visible";
  }, false);

  document.getElementById('importDirectory').addEventListener("change", handleDirectorySelect, false);
  document.getElementById('importZipFile').addEventListener("change", handleZIPselect, false);
  document.getElementById('formatHDdrive').addEventListener("click", removeHDdrive, false);
  document.getElementById('createHDimage').addEventListener("click", createHDimage, false);
  document.getElementById('mountHDimage').addEventListener("change", handleHDselect, false);
  document.getElementById('umountHDimage').addEventListener("click", removeHDimage, false);

  /* CD-ROM Drive Context Menu */
  document.getElementById('cdromDrive').addEventListener("click", function(e) {
    var contextMenuTop = e.clientY;
    var contextMenuLeft = e.clientX;
    if ((contextMenuTop + 218) >= window.outerHeight) {
      contextMenuTop = contextMenuTop - 218;
    }
    document.getElementById('cdromDriveContextMenu').style.top = contextMenuTop + "px";
    document.getElementById('cdromDriveContextMenu').style.left = contextMenuLeft + "px";
    document.getElementById('cdromDriveContextMenu').style.visibility = "visible";
  }, false);

  document.getElementById('mountCDROMimage').addEventListener("change", handleCDROMselect, false);
  document.getElementById('umountCDROMimage').addEventListener("click", removeCDROMimage, false);

  /* Removable Drive Context Menu */
  document.getElementById('removableDrive').addEventListener("click", function(e) {
    var contextMenuTop = e.clientY;
    var contextMenuLeft = e.clientX;
    if ((contextMenuTop + 218) >= window.outerHeight) {
      contextMenuTop = contextMenuTop - 218;
    }
    document.getElementById('removableDriveContextMenu').style.top = contextMenuTop + "px";
    document.getElementById('removableDriveContextMenu').style.left = contextMenuLeft + "px";
    document.getElementById('removableDriveContextMenu').style.visibility = "visible";
  }, false);

  document.getElementById('createRemovableImage').addEventListener("click", createRemovableImage, false);
  document.getElementById('mountRemovableimage').addEventListener("change", handleRemovableSelect, false);
  document.getElementById('umountRemovableimage').addEventListener("click", removeRemovableImage, false);

  document.getElementById('hdDriveSize').addEventListener("click", function() {
    for (var i=0; i<hdDriveFreesizes.length; i++) {
      if (document.getElementById('hdDriveSize').value == hdDriveFreesizes[i]) {
        if ((i + 1) < hdDriveFreesizes.length) {
          document.getElementById('hdDriveSize').value = hdDriveFreesizes[i + 1];
          syncSettings();
		  break;
        } else {
          document.getElementById('hdDriveSize').value = hdDriveFreesizes[0];
          syncSettings();
        }
      }
    }
  }, false);

  /* Help Panel */
  document.getElementById('help').addEventListener("click", function() {
    document.getElementById('helpPanel').style.width = "319px";
    document.getElementById('helpPanel').style.borderRightStyle = "solid";
    document.getElementById('helpPanel').style.borderRightWidth = "1px";
    document.getElementById('helpPanel').style.borderColor = "#222222";
  }, false);

  chrome.runtime.getPlatformInfo(function(PlatformInfo) {

    if (PlatformInfo.os === "cros") {

      /* Settings Panel */
      document.getElementById("autoexecLines").cols = "37";

      /* Help Panel */
      for (i=1; i<3; i++) {

        document.getElementById('keyboardShortcuts' + i).remove();

        var div = document.getElementById('helpPanel');
        var span = document.createElement("SPAN");
        var strong = document.createElement("STRONG");
        var p1 = document.createElement("P");
        var searchKey = document.createElement("IMG");
        var p2 = document.createElement("P");
        var functionKey = document.createElement("IMG");
        var p3 = document.createElement("P");

        span.classList.add('keyboardShortcuts' + i);
        strong.innerHTML = "CTRL";
        p1.innerHTML = "+";
        searchKey.src = "images/key_search.png";
        p2.innerHTML = "+";

        div.appendChild(span);

        if (i == 1) {

          p3.innerHTML = "Show The Keymapper";
          functionKey.src = "images/key_f7.png";

        } else if (i == 2) {

          p3.innerHTML = "Close DOSBox";
          functionKey.src = "images/key_f9.png";

        }

        span.appendChild(strong);
        span.appendChild(p1);
        span.appendChild(searchKey);
        span.appendChild(p2);
        span.appendChild(functionKey);
        span.appendChild(p3);

        p1.style.left = "58px";
        searchKey.style.left = "66px";
        p2.style.left = "98px";
        functionKey.style.left = "106px";
        p3.style.left = "146px";

      }

    }

  });

  document.getElementById('topPanel').addEventListener("mouseup", closeSidePanel, false);
  document.getElementById('nativeClient').addEventListener("mouseup", closeSidePanel, false);
  document.body.addEventListener("mouseup", hideContextMenu, false);

}

document.addEventListener("DOMContentLoaded", domContentLoaded);
