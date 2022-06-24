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

  static getAllButtons() {
    const gamePad = this.getGamePad();
    if (gamePad) {
      return gamePad.buttons;
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

  static buttonsCache = this.getAllButtons() || [];

  static update() {
    const btns = this.getAllButtons();
    const listenBtns = [
      { btn: 'A', sort: 0, pressed: this.getGamePadButton(0)?.pressed }, // A i
      { btn: 'B', sort: 1, pressed: this.getGamePadButton(1)?.pressed }, // B 7
      { btn: 'X', sort: 2, pressed: this.getGamePadButton(2)?.pressed }, // X 5
      { btn: 'Y', sort: 3, pressed: this.getGamePadButton(3)?.pressed }, // Y 6
      { btn: 'Left', sort: 12, pressed: this.getGamePadButton(12)?.pressed }, // Left ← 1
      { btn: 'Right', sort: 13, pressed: this.getGamePadButton(13)?.pressed }, // Right → 3
      { btn: 'Up', sort: 14, pressed: this.getGamePadButton(14)?.pressed }, // Up ↑ 2
      { btn: 'Down', sort: 15, pressed: this.getGamePadButton(15)?.pressed }, // Down ↓ 4
      { btn: 'LB', sort: 4, pressed: this.getGamePadButton(4)?.pressed }, // left bumper 低半音
      { btn: 'RB', sort: 5, pressed: this.getGamePadButton(5)?.pressed }, // right bumper 高半音
      { btn: 'LT', sort: 6, pressed: this.getGamePadButton(6)?.pressed }, // left trigger 低八度
      { btn: 'RT', sort: 7, pressed: this.getGamePadButton(7)?.pressed }, // right trigger 高八度
    ];
    const newBtns = listenBtns.filter((btn) => btn.pressed === true);
    const lastNewBtnsState = this.buttonsCache.filter((btn) =>
      newBtns.find((newBtn) => newBtn.sort === this.buttonsCache?.indexOf(btn))
    );
    const buttonPressed: {
      btn: string;
      sort: number;
      pressed: boolean | undefined;
    }[] = [];
    newBtns.forEach((btn) => {
      if (btn.pressed && lastNewBtnsState[newBtns.indexOf(btn)].pressed) {
        console.info(`${btn.btn} pressed`);
        buttonPressed.push(btn);
      }
    });
    this.buttonsCache = btns || [];
    return buttonPressed;
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
