type NextTickCallback = (time: Date) => void;
const nextTickEventHandlers: { [key: string]: NextTickCallback } = {};
const nextTick = (id: string, callback: NextTickCallback) => {
  nextTickEventHandlers[id] = callback;
};

const onNextTick = () => {
  for (const id in nextTickEventHandlers) {
    nextTickEventHandlers[id](new Date());
  }
};

setInterval(() => {
  onNextTick();
}, 1000);

export { nextTick };

export type NextTickType = typeof nextTick;

export interface PropsWithNextTick {
  nextTick: NextTickType;
}
