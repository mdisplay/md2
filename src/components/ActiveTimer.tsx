import { useEffect, useState } from 'react';
import { ClockInterface } from '../lib/clock';
import { CountDownType } from '../lib/common';
import { PrayerInterface } from '../lib/prayer-manager';

interface Props {
  clock: ClockInterface;
}

type TimerType = {
  currentPrayer?: PrayerInterface;
  currentPrayerWaiting?: CountDownType;
  currentPrayerBefore?: CountDownType;
  currentPrayerAfter?: CountDownType;
};

//  priority: currentPrayerBefore > currentPrayerWaiting > currentPrayerAfter
function ActiveTimer({ clock }: Props) {
  const [timer, setTimer] = useState<TimerType>({});
  //   (state) => state.main,
  // );
  const currentPrayerDescription = 'cool';
  // const currentPrayerBefore = { minutes: '02', colon: ':', seconds: '33' };
  // const currentPrayerAfter = { minutes: '02', colon: ':', seconds: '33' };
  // const currentPrayerWaiting = { minutes: '02', colon: ':', seconds: '33' };

  useEffect(() => {
    clock.onTick(({ currentPrayer, currentPrayerWaiting, currentPrayerBefore, currentPrayerAfter }) => {
      if (!(currentPrayerWaiting || currentPrayerBefore || currentPrayerAfter)) {
        setTimer({
          currentPrayer: undefined,
          currentPrayerWaiting: undefined,
          currentPrayerBefore: undefined,
          currentPrayerAfter: undefined,
        });
        return;
      }
      // setTimeDisplay({
      //   hours: mnt.format(settings.time24Check ? 'HH' : 'hh'),
      //   minutes: mnt.format('mm'),
      //   seconds: mnt.format('ss'),
      //   showColon: !(mnt.seconds() % 2 === 0),
      //   amPm: settings.time24Check ? '' : mnt.format('A'),
      // });
      // setSeconds(mnt.format('ss'));
      // setListDisplay(parseValue(mnt));
      // setShowColon(!(mnt.seconds() % 2 === 0));
      setTimer({
        currentPrayer,
        currentPrayerWaiting,
        currentPrayerBefore,
        currentPrayerAfter,
      });
    }, 'ActiveTimer');
  }, []);

  const { currentPrayer, currentPrayerWaiting, currentPrayerBefore, currentPrayerAfter } = timer;

  // console.log('current...', currentPrayerWaiting, currentPrayerBefore, currentPrayerAfter);

  const wrapper = document.getElementById('root')!;
  wrapper.classList.remove('is-active');
  wrapper.classList.remove('is-before');
  wrapper.classList.remove('is-waiting');
  wrapper.classList.remove('is-after');
  if (currentPrayerBefore) {
    wrapper.classList.add('is-before');
  } else if (currentPrayerWaiting) {
    wrapper.classList.add('is-waiting');
  } else if (currentPrayerAfter) {
    wrapper.classList.add('is-after');
  } else {
  }

  if (!currentPrayer) {
    return <></>;
  }
  wrapper.classList.add('is-active');
  return (
    <>
      <div className="active-timer">
        {currentPrayerBefore ? (
          <div className="timer timer-is-before">
            <div className="time">
              <span className="minutes">{currentPrayerBefore.minutes}</span>
              <span className="colon active-colon">:</span>
              <span className="seconds">{currentPrayerBefore.seconds}</span>
            </div>
            <div className="description">{currentPrayerDescription}</div>
          </div>
        ) : (
          <>
            {currentPrayerWaiting ? (
              <div className="timer timer-is-waiting">
                <div className="time">
                  <span className="minutes">{currentPrayerWaiting.minutes}</span>
                  <span className="colon active-colon">:</span>
                  <span className="seconds">{currentPrayerWaiting.seconds}</span>
                </div>
                <div className="description">{currentPrayerDescription}</div>
              </div>
            ) : (
              <>
                {currentPrayerAfter ? (
                  <div className="timer timer-is-after">
                    <div className="time">
                      <span className="minutes">{currentPrayerAfter.minutes}</span>
                      <span className="colon active-colon">:</span>
                      <span className="seconds">{currentPrayerAfter.seconds}</span>
                    </div>
                    <div className="description">{currentPrayerDescription}</div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ActiveTimer;
