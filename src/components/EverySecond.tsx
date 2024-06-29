import { useEffect, useState } from 'react';
import { ClockInterface } from '../lib/clock';

let _lastKnownValue: {
  showSunriseNow: boolean;
  prayerInfo: 'athan' | 'iqamah';
} = {
  prayerInfo: 'athan',
  showSunriseNow: false,
};
let _sunriseShownLast = false;

function EverySecond({ clock }: { clock: ClockInterface }) {
  const parseValue = (mnt: moment.Moment) => {
    const seconds = mnt.seconds();
    if (seconds % 2 !== 0) {
      return _lastKnownValue;
    }
    _lastKnownValue = {
      ..._lastKnownValue,
      // prayerInfo: _lastKnownValue.prayerInfo == 'iqamah' ? 'athan' : 'iqamah',
    };
    // _lastKnownValue.prayerInfo = _lastKnownValue.prayerInfo == 'iqamah' ? 'athan' : 'iqamah';
    if (_lastKnownValue.prayerInfo == 'iqamah') {
      _lastKnownValue.prayerInfo = 'athan';
      _lastKnownValue.showSunriseNow = false;
    } else {
      _lastKnownValue.prayerInfo = 'iqamah';
      _sunriseShownLast = !_sunriseShownLast;
      _lastKnownValue.showSunriseNow = _sunriseShownLast;
    }

    return _lastKnownValue;
    // if (prayerInfo == 'iqamah') {
    //   setShowSunriseNow(!showSunriseNow);
    // }
    // setPrayerInfo((prev) => (prev == 'athan' ? 'iqamah' : 'athan'));
  };

  const [seconds, setSeconds] = useState('00');
  const [showColon, setShowColon] = useState(true);
  const [listDisplay, setListDisplay] = useState(_lastKnownValue);

  const wrapper = document.querySelector('.prayer-info-wrapper');
  if (listDisplay.prayerInfo == 'athan') {
    wrapper?.classList.remove('active-prayer-info-iqamah');
    wrapper?.classList.add('active-prayer-info-athan');
  } else {
    wrapper?.classList.remove('active-prayer-info-athan');
    wrapper?.classList.add('active-prayer-info-iqamah');
  }
  if (listDisplay.showSunriseNow) {
    wrapper?.classList.add('prayer-info-sunrise-now');
  } else {
    wrapper?.classList.remove('prayer-info-sunrise-now');
  }

  const app = document.getElementById('app');
  if (showColon) {
    app?.classList.remove('hide-colon');
    // app?.querySelectorAll('.colon').forEach(element => {
    //   element.classList.add('')
    // })
  } else {
    app?.classList.add('hide-colon');
  }

  useEffect(() => {
    clock.onTick(({ mnt }) => {
      // setTimeDisplay({
      //   hours: mnt.format(settings.time24Check ? 'HH' : 'hh'),
      //   minutes: mnt.format('mm'),
      //   seconds: mnt.format('ss'),
      //   showColon: !(mnt.seconds() % 2 === 0),
      //   amPm: settings.time24Check ? '' : mnt.format('A'),
      // });
      setSeconds(mnt.format('ss'));
      setListDisplay(parseValue(mnt));
      setShowColon(!(mnt.seconds() % 2 === 0));
    }, 'EverySecond');
  }, []);
  return <>{seconds}</>;
}

export default EverySecond;
