import { useEffect, useState } from 'react';
import { ClockInterface } from '../lib/clock';
import { importSettings } from '../lib/settings-manager';
import { PrayerInterface } from '../lib/prayer-manager';

interface Props {
  // prayersList: PrayerInterface[];
  // currentPrayer?: PrayerInterface;
  clock: ClockInterface;
}

const _lastKnown = {
  currentPrayer: undefined,
  prayerList: [],
};

function PrayerList({ clock }: Props) {
  const settings = importSettings();
  const [currentPrayer, setCurrentPrayer] = useState<PrayerInterface>();
  const [prayerList, setPrayerList] = useState<PrayerInterface[]>([]);

  // const [prayerInfo, setPrayerInfo] = useState('athan');
  // const [showSunriseNow, setShowSunriseNow] = useState(false);

  // const parseValue = (mnt: moment.Moment) => {
  //   const seconds = mnt.seconds();
  //   if (seconds % 2 !== 0) {
  //     return _lastKnownValue;
  //   }
  //   _lastKnownValue = {
  //     ..._lastKnownValue,
  //     // prayerInfo: _lastKnownValue.prayerInfo == 'iqamah' ? 'athan' : 'iqamah',
  //   };
  //   // _lastKnownValue.prayerInfo = _lastKnownValue.prayerInfo == 'iqamah' ? 'athan' : 'iqamah';
  //   if (_lastKnownValue.prayerInfo == 'iqamah') {
  //     _lastKnownValue.prayerInfo = 'athan';
  //     _lastKnownValue.showSunriseNow = false;
  //   } else {
  //     _lastKnownValue.prayerInfo = 'iqamah';
  //     _sunriseShownLast = !_sunriseShownLast;
  //     _lastKnownValue.showSunriseNow = _sunriseShownLast;
  //   }

  //   return _lastKnownValue;
  //   // if (prayerInfo == 'iqamah') {
  //   //   setShowSunriseNow(!showSunriseNow);
  //   // }
  //   // setPrayerInfo((prev) => (prev == 'athan' ? 'iqamah' : 'athan'));
  // };

  useEffect(() => {
    clock.onTick(({ currentPrayer, prayers }) => {
      if (_lastKnown.currentPrayer !== currentPrayer) {
        setCurrentPrayer(currentPrayer);
      }
      if (_lastKnown.prayerList !== prayers) {
        setPrayerList(prayers);
      }
    }, 'PrayerList');
  }, []);

  // const [listDisplay, setListDisplay] = useState(_lastKnownValue);
  // const [prayersList, setPrayersList] = useState<PrayerInterface[]>(_lastKnownPrayers);
  // const [currentPrayer]

  const prayersListDisplay = prayerList.filter((prayer) => {
    return prayer.name != 'Sunrise';
  });

  // const showSunrise = settings.sunriseSupportCheck && listDisplay.showSunriseNow;

  const sunriseSupport = settings.sunriseSupportCheck;
  // currentPrayer = prayerList[2];

  return (
    <section className={`prayer-info-wrapper active-prayer-info-athan`}>
      <div className="prayer-info-container">
        {prayersListDisplay.map((prayer, i) => (
          <div
            key={i}
            className={`prayer-info ${prayer === currentPrayer ? 'is-current' : ''} ${
              prayer.name == 'Subah' ? 'is-subah' : ''
            }`}
          >
            <div className="prayer-name">{prayer.nameDisplay}</div>
            <div className="prayer-time">
              {prayer.timeDisplay}
              <span className="am-pm">{prayer.timeAmPm}</span>
            </div>
            <div className="iqamah-time">
              {prayer.name == 'Subah' && sunriseSupport ? (
                <span className="sunrise-time">
                  {prayerList[1].timeDisplay}
                  <span className="am-pm">{prayerList[1].iqamahTimeAmPm}</span>
                </span>
              ) : (
                <></>
              )}
              <span className="normal-time">
                {prayer.iqamahTimeDisplay}
                <span className="am-pm">{prayer.iqamahTimeAmPm}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PrayerList;
