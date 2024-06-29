import { useEffect, useState } from 'react';
import { ClockInterface } from '../lib/clock';
import EverySecond from './EverySecond';
import { importSettings } from '../lib/settings-manager';
import moment from 'moment';

interface Props {
  clock: ClockInterface;
  dateDisplay: React.ReactNode;
}

const _lastKnown: { mnt?: moment.Moment } = {
  mnt: undefined,
};

function DigitalClock({ dateDisplay, clock }: Props) {
  const settings = importSettings();
  const [mnt, setMnt] = useState(moment());

  // const [timeDisplay, setTimeDisplay] = useState<TimeDisplay>({
  //   hours: '00',
  //   minutes: '00',
  //   seconds: '00',
  //   showColon: true,
  //   amPm: settings.time24Check ? '' : 'AM',
  // });

  useEffect(() => {
    clock.onTick(({ mnt }) => {
      if (!_lastKnown.mnt || !(mnt.hours() === _lastKnown.mnt.hours() && mnt.minutes() === _lastKnown.mnt.minutes())) {
        // check further
        console.log('check further', 33);
        const timeMinuteFormat = 'YYYY-MM-DD HH:mm';
        if (!_lastKnown.mnt || mnt.format(timeMinuteFormat) != _lastKnown.mnt.format(timeMinuteFormat)) {
          console.log('aha .. next minute!');
          setMnt(mnt);
        }
      }
      _lastKnown.mnt = mnt;
    }, 'DigitalClock');
  }, []);
  // timeFormatted = m.format('DD MMM YYYY, ' + (time24Format ? 'HH:mm:ss' : 'h:mm:ss A'));
  // timeDisplay = m.format(time24Format ? 'HH:mm' : 'hh:mm');
  // const timeDisplay: TimeDisplay = {
  //   hours: mnt.format(time24Format ? 'HH' : 'hh'),
  //   minutes: mnt.format('mm'),
  //   seconds: mnt.format('ss'),
  //   colon: mnt.seconds() % 2 === 0 ? '' : ':',
  //   amPm: time24Format ? '' : mnt.format('A'),

  const timeDisplay = {
    hours: mnt.format(settings.time24Check ? 'HH' : 'hh'),
    minutes: mnt.format('mm'),
    // seconds: mnt.format('ss'),
    showColon: true,
    amPm: settings.time24Check ? '' : mnt.format('A'),
  };
  // };
  return (
    <>
      <div className="digital-clock">
        <span className="time">
          <span className="hours">
            <span className="h">{timeDisplay.hours}</span>
            {dateDisplay}
          </span>
          <span className="colon colon-main active-colon">{timeDisplay.showColon ? ':' : ''}</span>
          <span className="minutes">
            <span className="m">{timeDisplay.minutes}</span>

            <span className="seconds-container">
              <span className="seconds">
                <span className="colon active-colon">&nbsp;{timeDisplay.showColon ? ':' : ''}</span>
                {/* {timeDisplay.seconds} */}
                <EverySecond clock={clock} />
              </span>
              <span className="am-pm">{timeDisplay.amPm}</span>
            </span>
          </span>
        </span>
      </div>
    </>
  );
}

export default DigitalClock;
