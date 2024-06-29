import { useEffect, useState } from 'react';
import { translate } from '../lib/common';
import { PrayerInterface, dummyPrayers } from '../lib/prayer-manager';
import { importSettings } from '../lib/settings-manager';
import { ClockInterface } from '../lib/clock';
// import Counter from './Counter';

const _lastKnown = {
  nextPrayer: undefined,
  currentPrayer: undefined,
};

interface Props {
  clock: ClockInterface;
}

function PrayerDisplay({ clock }: Props) {
  const settings = importSettings();
  const [currentPrayer, setCurrentPrayer] = useState<PrayerInterface>();
  const [nextPrayer, setNextPrayer] = useState<PrayerInterface>();
  let display = { type: 'active', name: 'currentPrayer', prayer: dummyPrayers[2] };
  //   const display = { type: 'next', name: 'nextPrayer', prayer: dummyPrayers[3] };
  // let display;
  if (currentPrayer) {
    display = { type: 'active', name: 'currentPrayer', prayer: currentPrayer };
  } else {
    display = { type: 'next', name: 'nextPrayer', prayer: nextPrayer! };
  }
  // const display = { type: currentPrayer ? 'active' : 'next', name: 'currentPrayer', prayer: dummyPrayers[2] };

  useEffect(() => {
    clock.onTick(({ currentPrayer, nextPrayer }) => {
      if (_lastKnown.currentPrayer !== currentPrayer) {
        setCurrentPrayer(currentPrayer);
      }
      if (nextPrayer && _lastKnown.nextPrayer !== nextPrayer) {
        setNextPrayer(nextPrayer);
      }
    }, 'PrayerDisplay');
  }, []);

  return (
    <>
      {display.prayer ? (
        <section
          v-for="display in [
    {type: 'active', name: 'currentPrayer', prayer: currentPrayer},
    {type: 'next', name: 'nextPrayer', prayer: nextPrayer}
  ]"
        >
          <div className={`${display.type}-prayer prayer-display`}>
            <span className="name">
              <span className="label">{translate(settings.langId, display.name + '.label')}:</span>
              {translate(settings.langId, display.prayer.name)}
            </span>
            <span className={`time ${display.prayer.name == 'Sunrise' ? 'is-sunrise' : ''}`}>
              {/* <Counter /> */}
              <span className="hours">{display.prayer.timeHours}</span>
              <span className="colon">:</span>
              <span className="minutes">{display.prayer.timeMinutes}</span>
              <small className="am-pm">{display.prayer.timeAmPm}</small>
              {display.prayer.name != 'Sunrise' ? (
                <small className="label">{translate(settings.langId, 'prayer.label')}</small>
              ) : (
                <></>
              )}
            </span>
            {display.prayer.name != 'Sunrise' ? (
              <span className="iqamah-time">
                <span className="hours">{display.prayer.iqamahTimeHours}</span>
                <span className="colon">:</span>
                <span className="minutes">{display.prayer.iqamahTimeMinutes}</span>
                <small className="iqamah-am-pm">{display.prayer.iqamahTimeAmPm}</small>
                <small className="iqamah-label">{translate(settings.langId, 'prayer.iqamah-label')}</small>
              </span>
            ) : (
              <></>
            )}
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
}

export default PrayerDisplay;
