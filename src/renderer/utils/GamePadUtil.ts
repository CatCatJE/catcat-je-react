class GamePadUtil {
  static getGamePad() {
    return navigator.getGamepads()[0];
  }

  static getGamePadButton(button: number) {
    const gamePad = this.getGamePad();
    if (gamePad) {
      return gamePad.buttons[button];
    }
    return null;
  }

  static getGamePadAxis(axis: number) {
    const gamePad = this.getGamePad();
    if (gamePad) {
      return gamePad.axes[axis];
    }
    return null; // null if no gamepad
  }

  static getGamePadDirection() {
    const gamePad = this.getGamePad();
    if (gamePad) {
      const x = gamePad.axes[0];
      const y = gamePad.axes[1];
      if (x > 0.5) {
        return 'right';
      }
      if (x < -0.5) {
        return 'left';
      }
      if (y > 0.5) {
        return 'down';
      }
      if (y < -0.5) {
        return 'up';
      }
    }
    return null;
  }

  gamepadAPI = {
    controller: {},
    turbo: false,
    connect() {},
    disconnect() {},
    update() {},
    buttonPressed() {},
    buttons: [],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: [],
  };

  buttons = [
    'DPad-Up',
    'DPad-Down',
    'DPad-Left',
    'DPad-Right',
    'Start',
    'Back',
    'Axis-Left',
    'Axis-Right',
    'LB',
    'RB',
    'Power',
    'A',
    'B',
    'X',
    'Y',
  ];

  connect = (evt: GamepadEvent) => {
    this.gamepadAPI.controller = evt.gamepad;
    this.gamepadAPI.turbo = true;
    console.log('控制器已连接。');
  };
}
export default GamePadUtil;
