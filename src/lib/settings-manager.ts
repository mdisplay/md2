import { PrayerName, padZero } from './common';
import { timeServerApi, timeServerSSID } from './time-server-manager';

const settingsStorageKey = 'mdisplay.settings_json';

let allSettings: AllSettingsInterface;
// let currentProfile = 0;

export class IqamahTime {
  minutes: string;
  time: string = '';
  absolute: boolean;

  constructor(public name: PrayerName, minutes: number, absolute: boolean = false, time = '') {
    this.minutes = padZero(minutes || 0);
    this.absolute = !!absolute;
    this.time = time;
  }
}

export interface SettingsInterface {
  profileName: string;
  prayerTimesDataId: string;
  timeAdjustmentMinutes: number | '';
  jummahEndMinutes: number;
  langId: string;
  clockThemeId: string;
  time24Check: boolean;
  sunriseSupportCheck: boolean;
  alertIconsCheck: boolean;
  timeOverrideCheck: boolean;
  timeOverrideTime: string;
  useNetworkTime: boolean;
  networkTimeApiUrl: string;
  networkTimeServerSSID: string;
  iqamahTimes: IqamahTime[];
  simulateMillis: number;
  isDevMode: boolean;
}

interface AllSettingsInterface {
  configured: boolean;
  currentProfile: string;
  settings: SettingsInterface[];
}

let importedSettings: SettingsInterface;

const fillSettings = (oldSettings: SettingsInterface) => {
  const settings: SettingsInterface = { ...oldSettings };
  settings.prayerTimesDataId = settings.prayerTimesDataId || 'Colombo';
  settings.langId = settings.langId || 'en';
  settings.clockThemeId = settings.clockThemeId || 'digitalModern';
  settings.sunriseSupportCheck = settings.sunriseSupportCheck !== false;
  settings.alertIconsCheck = settings.alertIconsCheck !== false;
  settings.timeOverrideCheck = !!settings.timeOverrideCheck;
  //   settings.timeOverrideTime;
  settings.useNetworkTime = !!settings.useNetworkTime;
  settings.time24Check = !!settings.time24Check;
  settings.timeAdjustmentMinutes = parseInt('' + settings.timeAdjustmentMinutes) || '';
  settings.jummahEndMinutes = settings.jummahEndMinutes ? parseInt('' + settings.jummahEndMinutes) : 30;
  settings.networkTimeApiUrl = settings.networkTimeApiUrl || timeServerApi;
  settings.networkTimeServerSSID = settings.networkTimeServerSSID || timeServerSSID;
  settings.isDevMode = !!settings.isDevMode;
  settings.simulateMillis = settings.simulateMillis ? parseInt('' + settings.simulateMillis) : 0;
  return settings;
};

const getCurrentProfileSettings = () => {
  return allSettings.settings[parseInt(allSettings.currentProfile)];
};

export const importSettings = (force = false): SettingsInterface => {
  if (!force && importedSettings) {
    return importedSettings;
  }
  let savedSettings = {} as any;
  try {
    savedSettings = JSON.parse(localStorage.getItem(settingsStorageKey) || '{}');
    console.log('readSettings', savedSettings);
  } catch (e) {}
  allSettings = savedSettings || {};
  allSettings.settings = allSettings.settings && allSettings.settings.length ? allSettings.settings : [{} as any];
  allSettings.currentProfile = allSettings.currentProfile || '0';
  if (!allSettings.configured) {
    allSettings.configured = false;
  }
  importedSettings = fillSettings(getCurrentProfileSettings() || {});
  if (!importedSettings.isDevMode && importedSettings.timeOverrideCheck) {
    // @TODO: implement logic to reset timeOverrideCheck on next page load
    const newSettings = { ...importedSettings };
    newSettings.timeOverrideCheck = false;
    // reset timeOverrideCheck on next page load
    writeSettings(newSettings);
  }
  importedSettings.iqamahTimes = importIqamahTimes(importedSettings.iqamahTimes);
  return importedSettings;
};

const importIqamahTimes = (
  rawIqamahTimes: { [Property in keyof IqamahTime]?: IqamahTime[Property] }[],
): IqamahTime[] => {
  const iqamahTimes = [
    new IqamahTime('Subah', 20),
    new IqamahTime('Luhar', 15),
    new IqamahTime('Asr', 15),
    new IqamahTime('Magrib', 10),
    new IqamahTime('Isha', 15),
    new IqamahTime('Jummah', 15, true, '12:30'),
  ];
  for (const iq of rawIqamahTimes || []) {
    const iqamahTime = iqamahTimes.filter((iqamahTime) => {
      return iqamahTime.name == iq.name;
    })[0];
    if (iqamahTime) {
      Object.assign(iqamahTime, iq);
    }
  }
  return iqamahTimes;
};

export const updateIqamahTimeProp = (
  iqamahTimes: IqamahTime[],
  iqamahTime: IqamahTime,
  prop: keyof IqamahTime,
  value: any,
) => {
  const newIqamahTimes = iqamahTimes.concat();
  const idx = iqamahTimes.indexOf(iqamahTime);
  if (idx !== -1) {
    const newIqamahTime = new IqamahTime(iqamahTime.name, parseInt(iqamahTime.minutes));
    Object.assign(newIqamahTime, iqamahTime);
    (newIqamahTime as any)[prop] = value;
    newIqamahTimes[idx] = newIqamahTime;
  }
  return newIqamahTimes;
};

export const getConfigProfileData = (forceUpdate = false) => {
  return {
    configured: allSettings.configured,
    currentProfile: allSettings.currentProfile,
    settings: importSettings(forceUpdate),
    profiles: allSettings.settings.map((settings, i) => {
      return {
        id: '' + i,
        label: settings.profileName,
      };
    }),
  };
};

export const createConfigProfile = (profileName: string) => {
  allSettings.settings.push({ profileName } as any);
  allSettings.currentProfile = `${allSettings.settings.length - 1}`;
  writeSettings(getCurrentProfileSettings());
  // return getConfigProfileData(true);
};

export const editConfigProfile = (profileName: string) => {
  const currentProfile = getCurrentProfileSettings();
  currentProfile.profileName = profileName;
  writeSettings(currentProfile);
};

export const deleteConfigProfile = (tobeDeletedProfileId: string) => {
  allSettings.settings.splice(parseInt(tobeDeletedProfileId), 1);
  allSettings.currentProfile = '0';
  writeSettings(getCurrentProfileSettings());
};

export const selectConfigProfile = (selected: string) => {
  allSettings.currentProfile = `${selected}`;
  writeSettings(getCurrentProfileSettings());
};

export const writeSettings = (settings: SettingsInterface) => {
  //   alert('todo'); // @TODO: implement
  console.log('writeSettings', settings);
  // allSettings = {
  //   allSettings.currentProfile,
  //   settings: [settings],
  // };
  allSettings.configured = true;
  allSettings.settings[parseInt(allSettings.currentProfile)] = settings;
  localStorage.setItem(settingsStorageKey, JSON.stringify(allSettings));
};
