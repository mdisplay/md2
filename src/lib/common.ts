export type PrayerName = 'Subah' | 'Sunrise' | 'Luhar' | 'Asr' | 'Magrib' | 'Isha' | 'Jummah';

export type MonthName =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export const translate = (langId: string, text: string) => {
  return translations[langId][text];
};

export interface VersionInfo {
  versionString: string;
  versionNumber: number;
  fullVersion: string;
}

export interface NetworkInfo {
  status: string;
  connecting?: boolean;
  internetStatus?: string;
  internetAvailable: boolean;
  showInternetAvailability: boolean;
}

export const createVersionFrom = (fullVersion: string): VersionInfo => {
  fullVersion = fullVersion.replace('?v=', '');
  // const regex = /\?v=(\d+\.\d+\.\d+)-(\d+)/;
  const regex = /(\d+\.\d+\.\d+)-(\d+)/;
  return {
    fullVersion,
    versionString: fullVersion.replace(regex, '$1'),
    versionNumber: parseInt(fullVersion.replace(regex, '$2'), 10),
  };
};

export const padZero = (num: number) => {
  num = parseInt('' + num);
  if (num < 10) {
    return '0' + num;
  }
  return '' + num;
};

export const prayerDataList = [
  { id: 'Colombo', label: 'Sri Lanka Standard' },
  { id: 'Puttalam', label: 'Puttalam Grand Masjid' },
  { id: 'Mannar', label: 'Mannar' },
  { id: 'Eastern', label: 'Eastern', parent: 'Colombo', timeAdjustmentMinutes: -6 },
  { id: 'Central', label: 'Central (Kandy, Akurana) - beta' },
];

export type DateParams = { year: number; month: number; day: number };

export type CountDownType = {
  minutes: string;
  colon: string;
  seconds: string;
};

export const version = createVersionFrom('?v=3.0.0-100');
