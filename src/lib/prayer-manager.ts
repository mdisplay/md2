import { PrayerName } from './common';

export interface PrayerInterface {
  name: PrayerName;
  nameDisplay: string;
  timeDisplay: string;
  timeAmPm: string;
  iqamahTimeDisplay: string;
  iqamahTimeAmPm: string;
  timeHours: string;
  timeMinutes: string;
  iqamahTimeHours: string;
  iqamahTimeMinutes: string;
}

const createDummyPrayer = function (
  name: PrayerName,
  timeDisplay: string,
  iqamahTimeDisplay: string,
  timeAmPm = 'PM',
  iqamahTimeAmPm = 'PM',
): PrayerInterface {
  const prayer: PrayerInterface = {
    name: name,
    nameDisplay: name,
    timeDisplay,
    iqamahTimeDisplay,
    timeAmPm,
    iqamahTimeAmPm,
    timeHours: '03',
    timeMinutes: '44',
    iqamahTimeHours: '03',
    iqamahTimeMinutes: '55',
  };
  return prayer;
};

const dummyPrayers = [
  createDummyPrayer('Subah', '04:33', '04:53', 'AM', 'AM'),
  // createDummyPrayer('Sunrise', times[1], 10, self.lang),
  // createDummyPrayer('Luhar', times.Luhar, iqamahTimes.Luhar, self.lang),
  createDummyPrayer('Sunrise', '05:57', '05:57', 'AM', 'AM'),
  createDummyPrayer('Luhar', '12:14', '12:29', 'PM', 'PM'),
  createDummyPrayer('Asr', '03:41', '03:56'),
  createDummyPrayer('Magrib', '06:29', '06:39'),
  createDummyPrayer('Isha', '07:45', '08:45'),
];

export { dummyPrayers };
