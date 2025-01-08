/* # Gamepads  */
var controllersNumber = 1;  /* 1 [MAX = 4 Gamepads] */

var controllers = new Array(controllersNumber);

function connectHandler(e) {
  addGamepad(e.gamepad);
}

function disconnectHandler(e) {	
  removeGamepad(e.gamepad);
}

function addGamepad(gamepad) {

  for (var i= 0; i<controllersNumber; i++) {
    if (controllers[i] == null) {
      controllers[gamepad.index] = gamepad;
      console.log("Connected gamepad at index #" + gamepad.index + ": " + gamepad.id);
      updatePopup("Connected Gamepad: " + gamepad.id);
    }
  }

}

function removeGamepad(gamepad) {

  delete controllers[gamepad.index];
  console.log("Disconnected gamepad at index #" + gamepad.index + ": " + gamepad.id);
  updatePopup("Disconnected Gamepad: " + gamepad.id);

}

window.addEventListener("gamepadconnected", connectHandler);
window.addEventListener("gamepaddisconnected", disconnectHandler);
