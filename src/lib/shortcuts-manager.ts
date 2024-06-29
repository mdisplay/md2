const state = {
  lastSelectedRow: 0,
  lastSelectedCol: 0,
  isSettingsOpen: false,
  onEnterCallback: () => {},
};
const KEY_CODES = {
  ENTER: 13,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};

export const settingsOpen = (isOpen = true) => {
  state.isSettingsOpen = isOpen;
};

export const onEnterCallback = (callback: () => void) => {
  state.onEnterCallback = callback;
};

export const openSettings = (isOpen: boolean) => {
  state.isSettingsOpen = isOpen;
};

export const registerShortcuts = () => {
  const body = document.querySelector('body')!;
  body.onkeydown = function (event) {
    if (!event.metaKey) {
      // e.preventDefault();
    }
    const keyCode = event.keyCode;
    // alert('keyCode: ' + keyCode);
    if (keyCode == KEY_CODES.ENTER) {
      event.preventDefault();
      state.onEnterCallback();
      return;
    }
    if (!state.isSettingsOpen) {
      return;
    }
    console.log('keydown, ', keyCode);
    const rows = Array.from(document.querySelectorAll('.times-config .time-config')).filter((row) => {
      const input = row.querySelectorAll('input')[0];
      return input && !(input.readOnly || input.disabled);
    });
    if (keyCode == KEY_CODES.ARROW_DOWN || keyCode == KEY_CODES.ARROW_UP) {
      event.preventDefault();
      let lastSelectedRow = state.lastSelectedRow || 0;
      let lastSelectedCol = state.lastSelectedCol || 1;
      lastSelectedRow += keyCode == KEY_CODES.ARROW_UP ? -1 : 1;
      if (lastSelectedRow < 1) {
        lastSelectedRow = rows.length;
      }
      if (lastSelectedRow > rows.length) {
        lastSelectedRow = 1;
      }
      const row = rows[lastSelectedRow - 1];
      const cols = row.querySelectorAll('input');
      console.log('cols', cols, rows, row);
      if (lastSelectedCol < 1) {
        lastSelectedCol = cols.length;
      }
      if (lastSelectedCol > cols.length) {
        lastSelectedCol = 1;
      }
      const col = cols[lastSelectedCol - 1];
      console.log('SHOULD FOCUS: ', col.value, col);
      col.focus();
      state.lastSelectedRow = lastSelectedRow;
      state.lastSelectedCol = lastSelectedCol;
    }
    // if (keyCode == KEY_CODES.ARROW_LEFT || keyCode == KEY_CODES.ARROW_RIGHT) {
    //   event.preventDefault();
    //   let _lastSelectedRow = state.lastSelectedRow || 1;
    //   let _lastSelectedCol = state.lastSelectedCol || 0;
    //   if (_lastSelectedRow < 1) {
    //     _lastSelectedRow = rows.length;
    //   }
    //   if (_lastSelectedRow > rows.length) {
    //     _lastSelectedRow = 1;
    //   }
    //   const _row = rows[_lastSelectedRow - 1];
    //   const _cols = _row.querySelectorAll('input');
    //   _lastSelectedCol += keyCode == KEY_CODES.ARROW_LEFT ? -1 : 1;
    //   if (_lastSelectedCol < 1) {
    //     _lastSelectedCol = _cols.length;
    //   }
    //   if (_lastSelectedCol > _cols.length) {
    //     _lastSelectedCol = 1;
    //   }
    //   const _col = _cols[_lastSelectedCol - 1];
    //   console.log('SHOULD FOCUS: ', _col.value, _col);
    //   _col.focus();
    //   state.lastSelectedRow = _lastSelectedRow;
    //   state.lastSelectedCol = _lastSelectedCol;
    // }
  };
};
