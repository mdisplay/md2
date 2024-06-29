import { useEffect, useState } from 'react';
import { ClockInterface } from '../lib/clock';
import { padZero } from '../lib/common';
import moment from 'moment';
import { importSettings } from '../lib/settings-manager';

interface Props {
  showAlert: boolean;
  currentlyShowingAlert: string; // why this here?
  alertDisplay: React.ReactNode;
  clock: ClockInterface;
}

interface DateDisplay {
  hijriDateDisplay: string;
  dateDisplay: string;
  weekDayDisplay: string;
  // showAlert: boolean;
  // currentlyShowingAlert: string; // why this here?
}

let _lastKnownDateString: string;

function DateDisplay({ showAlert, alertDisplay, clock }: Props) {
  const settings = importSettings();

  const parseValue = (mnt: moment.Moment): DateDisplay => {
    const dayOfWeek = mnt.day();
    const month = translations[settings.langId].months[mnt.month()];
    const day = translations[settings.langId].days[dayOfWeek];

    const hijriDate = HijriJS.gregorianToHijri(mnt.year(), mnt.month() + 1, mnt.date());

    console.log('what the hell DateDisplay', mnt.format('HH:mm:ss SSS'));
    return {
      hijriDateDisplay: translations[settings.langId].hijriMonths[hijriDate.month - 1] + ' ' + hijriDate.year,
      // hijriDateDisplay: `${padZero(hijriDate.day)} ${translations[settings.langId].hijriMonths[hijriDate.month - 1]} ${
      //   hijriDate.year
      // }`,
      // dateDisplay: padZero(time.getDate()) + ' ' + month + ' ' + time.getFullYear(),
      dateDisplay: `${padZero(mnt.date())} ${month} ${mnt.year()}`,
      weekDayDisplay: day,
    };
  };

  // const [date, setDate] = useState(new Date());
  const [dateDisplay, setDateDisplay] = useState<DateDisplay>({
    hijriDateDisplay: '...',
    dateDisplay: '...',
    weekDayDisplay: '...',
  });

  useEffect(() => {
    clock.onTick(({ mnt }) => {
      const dateString = mnt.format('YYYY-MM-DD');
      if (_lastKnownDateString === dateString) {
        // do not set without checking - avoid re rendering
        return;
      }
      _lastKnownDateString = dateString;
      setDateDisplay(parseValue(mnt));
    }, 'DateDisplay');
  }, []);

  // const mnt = moment(date);

  // const dayOfWeek = mnt.day();
  // const month = translations[settings.langId].months[mnt.month()];
  // const day = translations[settings.langId].days[dayOfWeek];

  // const hijriDate = HijriJS.gregorianToHijri(mnt.year(), mnt.month() + 1, mnt.date());

  // const dateDisplay: DateDisplay = {
  //   hijriDateDisplay:
  //     padZero(hijriDate.day) +
  //     ' ' +
  //     translations[settings.langId].hijriMonths[hijriDate.month - 1] +
  //     ' ' +
  //     hijriDate.year,
  //   // hijriDateDisplay: `${padZero(hijriDate.day)} ${translations[settings.langId].hijriMonths[hijriDate.month - 1]} ${
  //   //   hijriDate.year
  //   // }`,
  //   // dateDisplay: padZero(time.getDate()) + ' ' + month + ' ' + time.getFullYear(),
  //   dateDisplay: `${padZero(mnt.date())} ${month} ${mnt.year()}`,
  //   weekDayDisplay: day,
  // };

  return (
    <>
      <span className="date-display">
        {alertDisplay}
        <span style={{ opacity: showAlert ? '0.95' : '1' }}>
          <span className="hijri-datex">{dateDisplay.hijriDateDisplay}</span>
          <span className="datex">{dateDisplay.dateDisplay}</span>
          <span className="weekday">{dateDisplay.weekDayDisplay}</span>
        </span>
      </span>
    </>
  );
}

export default DateDisplay;
