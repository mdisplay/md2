import moment from 'moment';
import { MonthName, PrayerName, padZero, prayerDataList, DateParams, CountDownType } from './common';
import { SettingsInterface } from './settings-manager';
import { PrayerInterface } from './prayer-manager';

type Range = { range: [number, number]; times: [string, string, string, string, string, string] };

type PrayerDataType = {
  [month in MonthName]: Range[];
};
type AllPrayerDataType = {
  [key: string]: PrayerDataType;
};

type PrayerTimes = {
  [month in PrayerName]: Date;
};

const months: MonthName[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class Prayer implements PrayerInterface {
  name: PrayerName;
  time: Date;
  iqamahTime: Date;
  nameDisplay: string;
  //
  timeDisplay: string;
  timeAmPm: string;
  timeHours: string;
  timeMinutes: string;
  iqamahTimeDisplay: string;
  iqamahTimeHours: string;
  iqamahTimeMinutes: string;
  iqamahTimeAmPm: string;
  constructor(name: PrayerName, time: Date, iqamahTime: Date, lang: string, time24Format: boolean) {
    this.name = name;
    this.nameDisplay = translations[lang][this.name];
    this.time = time;
    // self.iqamah = iqamahTime;
    // self.iqamah = 100;
    this.iqamahTime = iqamahTime; //new Date(self.time.getTime() + self.iqamah * 60 * 1000);
    var d = moment(this.time);
    this.timeDisplay = d.format(time24Format ? 'HH:mm' : 'hh:mm');
    this.timeAmPm = time24Format ? '' : d.format('A');
    this.timeHours = d.format(time24Format ? 'HH' : 'hh');
    this.timeMinutes = d.format('mm');
    var id = moment(this.iqamahTime);
    this.iqamahTimeDisplay = id.format(time24Format ? 'HH:mm' : 'hh:mm');
    this.iqamahTimeHours = id.format(time24Format ? 'HH' : 'hh');
    this.iqamahTimeMinutes = id.format('mm');
    this.iqamahTimeAmPm = time24Format ? '' : id.format('A');
  }
}

interface CallbackParams {
  time: Date;
  mnt: moment.Moment;
  prayers: Prayer[];
  //
  isFriday: boolean;
  isRunning: boolean;
  currentPrayer?: Prayer;
  nextPrayer?: Prayer;
  currentPrayerBefore?: CountDownType;
  currentPrayerAfter?: CountDownType;
  currentPrayerWaiting?: CountDownType;
  settings: SettingsInterface;
}

type OnTickCallback = (params: CallbackParams) => void;

const config = {
  isDeviceReady: false,
  isInitial: true,
  beforeSeconds: 5 * 60,
  // self.beforeSeconds = 1*60;
  // afterSeconds: 5 * 60,
  // self.afterSeconds = 1;
  // self.afterSeconds = 1*60;
  afterSeconds: 2 * 60,
  pauseSeconds: 15,
};

class Clock {
  initialTestTime?: Date;
  simulateTime = 100; // milliseconds to simulate instead of 1000. e.g: 50 - clock runs faster
  time = new Date();
  mnt = moment();
  currentDateParams?: DateParams;
  prayerData: PrayerDataType;
  isFriday = false;
  isRunning = false;
  currentPrayer?: Prayer;
  nextPrayer?: Prayer;
  currentPrayerBefore?: CountDownType;
  currentPrayerAfter?: CountDownType;
  currentPrayerWaiting?: CountDownType;
  isInitial = true;
  timeOverridden = false;
  selectedPrayerDataDetails: {
    id: string;
    label: string;
    parent?: undefined;
    timeAdjustmentMinutes?: undefined;
  };

  todayPrayers: Prayer[] = [];
  nextDayPrayers: Prayer[] = [];
  prayers: Prayer[] = [];

  private _theInterval?: any;

  onTickCallbacks: Record<string, OnTickCallback> = {};

  constructor(private settings: SettingsInterface) {
    this.selectedPrayerDataDetails = (prayerDataList.filter((pData) => {
      return pData.id == this.settings.prayerTimesDataId;
    })[0] || prayerDataList[0]) as any;
    this.prayerData = this.retrievePrayerData();
  }

  retrievePrayerData() {
    var prayerData = (window.PRAYER_DATA as AllPrayerDataType)[
      (this.selectedPrayerDataDetails && this.selectedPrayerDataDetails.parent) || this.settings.prayerTimesDataId
    ];
    if (!prayerData) {
      alert('Invalid Prayer Data. Falling back to default');
      prayerData = window.PRAYER_DATA['Colombo'];
    }
    return prayerData;
    // for (var month in prayerData) {
    //   if (prayerData.hasOwnProperty(month)) {
    //     this.prayerData.push(prayerData[month]);
    //   }
    // }
  }

  initialize() {}

  getMonthName(monthIndex: number) {
    return months[monthIndex];
  }

  getMonthIndex(monthName: MonthName) {
    return months.indexOf(monthName);
  }

  run(time = new Date()) {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    console.log('run called', new Date().getTime());
    this.time = time;
    if (this._theInterval) {
      clearInterval(this._theInterval);
    }
    this._theInterval = setInterval(() => {
      this.tick();
    }, (this.settings.isDevMode && this.settings.simulateMillis) || 1000);
  }

  forceUpdateTime(time: Date) {
    this.time = time;
  }

  getDateParams(date: Date): DateParams {
    return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
  }

  getTime(dateParams: DateParams, time: string) {
    // var timeParts = time.split(':');
    // var hoursAdd = 0;
    // if (timeParts[1].indexOf('p') != -1) {
    //   hoursAdd = 12;
    // }
    // var hours = hoursAdd + parseInt(timeParts[0]);
    // var minutes = parseInt(timeParts[1].replace('a', '').replace('p', ''));
    // console.log(time);
    // var m = moment(yearParam + ' ' + (monthParam + 1) + ' ' + dayParam + ' ' + time + 'm', 'YYYY M D hh:mma');
    // var m = moment(yearParam + ' ' + (monthParam + 1) + ' ' + dayParam + ' ' + time, 'YYYY M D HH:mm');
    const m = moment(`${dateParams.year} ${dateParams.month + 1} ${dateParams.day} ${time}`, 'YYYY M D HH:mm');
    if (this.selectedPrayerDataDetails && this.selectedPrayerDataDetails.timeAdjustmentMinutes) {
      m.add(this.selectedPrayerDataDetails.timeAdjustmentMinutes, 'minutes');
    }
    var timeAdjustmentMinutes = this.settings.timeAdjustmentMinutes as number;
    if (!isNaN(timeAdjustmentMinutes) && timeAdjustmentMinutes != 0) {
      timeAdjustmentMinutes = parseInt('' + timeAdjustmentMinutes);
      m.add(timeAdjustmentMinutes, 'minutes'); // when timeAdjustmentMinutes is < 0, it's substracted automatically
    }

    return m.toDate();
  }

  getTimes(dateParams: DateParams) {
    const monthName = this.getMonthName(dateParams.month);
    const times = [];
    for (let i = 0; i < this.prayerData[monthName].length; i++) {
      const segment = this.prayerData[monthName][i];
      if (segment.range[0] <= dateParams.day && segment.range[1] >= dateParams.day) {
        for (let j = 0; j < segment.times.length; j++) {
          const time = segment.times[j];
          times.push(this.getTime(dateParams, time));
        }
        break;
      }
    }
    if (!times.length) {
      return;
    }
    return {
      Subah: times[0],
      Sunrise: times[1],
      Luhar: times[2],
      Asr: times[3],
      Magrib: times[4],
      Isha: times[5],
    };
  }

  getIqamahTimes(prayerTimes: PrayerTimes, dateParams: DateParams) {
    var iqamahTimes: PrayerTimes = {} as any;
    for (var iqamahTime of this.settings.iqamahTimes) {
      const { name } = iqamahTime;
      var prayerName: PrayerName = name == 'Jummah' ? 'Luhar' : name;
      if (iqamahTime.absolute) {
        iqamahTimes[name] = this.getTime(dateParams, iqamahTime.time + (name == 'Subah' ? 'a' : 'p'));
      } else {
        iqamahTimes[name] = new Date(prayerTimes[prayerName].getTime() + parseInt(iqamahTime.minutes) * 60 * 1000);
      }
    }
    return iqamahTimes;
  }

  updateBackground(isInit = false) {
    if (!isInit) {
      // return;
    }
    // const backgroundImages = [
    //   'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max',
    // ];
    // return (self.data.backgroundImage = backgroundImages[0]);
    // self.data.backgroundImage = 'backgrounds/' + self.data.time.getMinutes() + '.jpg?v=' + self.data.bgVersion;
  }

  updateDay() {
    let dateParams = this.getDateParams(this.time);
    if (
      this.currentDateParams &&
      dateParams.year === this.currentDateParams.year &&
      dateParams.month === this.currentDateParams.month &&
      dateParams.day === this.currentDateParams.day
    ) {
      return;
    }
    this.currentDateParams = dateParams;
    let times = this.getTimes(dateParams) as PrayerTimes;
    const fallbackToNextDayOnFail = false;
    for (let i = 0; i < 100; i++) {
      if (times || !fallbackToNextDayOnFail) {
        break;
      }
      // try few more times!; - why? - fallback if data is not available for a particular day
      times = this.getTimes(dateParams) as PrayerTimes;
      var _d = new Date(this.time.getTime());
      _d.setDate(_d.getDate() + 1);
      dateParams = this.getDateParams(_d);
    }
    const lang = this.settings.langId;
    var d = moment(this.time);
    var dayOfWeek = parseInt(d.format('d'));
    // var day = translations[lang].days[dayOfWeek];
    this.isFriday = dayOfWeek === 5;
    // var month = translations[lang].months[this.time.getMonth()];
    console.log('all the times', times);
    var iqamahTimes = this.getIqamahTimes(times as PrayerTimes, dateParams);
    var time24Format = this.settings.time24Check;
    this.todayPrayers = [
      new Prayer('Subah', times.Subah, iqamahTimes.Subah, lang, time24Format),
      // new Prayer('Sunrise', times[1], 10, self.lang),
      // new Prayer('Luhar', times.Luhar, iqamahTimes.Luhar, self.lang),
      new Prayer(
        'Sunrise',
        times.Sunrise,
        iqamahTimes.Subah /* should be less than sunrise time (no iqamah) */,
        lang,
        time24Format,
      ),
      new Prayer(
        this.isFriday ? 'Jummah' : 'Luhar',
        times.Luhar,
        this.isFriday ? iqamahTimes.Jummah : iqamahTimes.Luhar,
        lang,
        time24Format,
      ),
      new Prayer('Asr', times.Asr, iqamahTimes.Asr, lang, time24Format),
      new Prayer('Magrib', times.Magrib, iqamahTimes.Magrib, lang, time24Format),
      new Prayer('Isha', times.Isha, iqamahTimes.Isha, lang, time24Format),
    ];
    if (!this.settings.sunriseSupportCheck) {
      this.todayPrayers.splice(1, 1);
    }
    this.prayers = this.todayPrayers;
    var tomorrowParams = this.getDateParams(new Date(this.time.getTime() + 24 * 60 * 60 * 1000));
    var tomorrowTimes = this.getTimes(tomorrowParams) as PrayerTimes;
    if (!tomorrowTimes) {
      tomorrowTimes = times;
    }
    var tomorrowIqamahTimes = this.getIqamahTimes(tomorrowTimes, tomorrowParams);
    this.nextDayPrayers = [
      new Prayer('Subah', tomorrowTimes.Subah, tomorrowIqamahTimes.Subah, lang, time24Format),
      new Prayer('Sunrise', tomorrowTimes.Sunrise, tomorrowIqamahTimes.Subah, lang, time24Format),
      new Prayer('Luhar', tomorrowTimes.Luhar, tomorrowIqamahTimes.Luhar, lang, time24Format),
      new Prayer('Asr', tomorrowTimes.Asr, tomorrowIqamahTimes.Asr, lang, time24Format),
      new Prayer('Magrib', tomorrowTimes.Magrib, tomorrowIqamahTimes.Magrib, lang, time24Format),
      new Prayer('Isha', tomorrowTimes.Isha, tomorrowIqamahTimes.Isha, lang, time24Format),
    ];
    if (!this.settings.sunriseSupportCheck) {
      this.nextDayPrayers.splice(1, 1);
    }
    //* @TODO: find the following logic
    // this.data = {};
    this.currentPrayer = undefined;
    this.currentPrayerBefore = undefined;
    this.currentPrayerAfter = undefined;
    this.currentPrayerWaiting = undefined;

    /*TODO:
    this.data.currentPrayerDescription = '';
    // self.data.nextPrayerNear = false;
    // self.data.currentIqamah = undefined;
    // self.data.currentIqamah
    // self.data.dateDisplay = d.format('ddd, DD MMM YYYY');
    this.data.weekDayDisplay = day;
    this.data.dateDisplay = padZero(this.time.getDate()) + ' ' + month + ' ' + this.time.getFullYear(); //day + ', ' +
    var hijriMonth = parseInt(d.format('iM'));
    // self.data.hijriDateDisplay = d.format('iDD, ___ (iMM) iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // const hijriDate = new HijriDate(self.data.time.getTime());
    var hijriDate = HijriJS.gregorianToHijri(
      this.time.getFullYear(),
      this.time.getMonth() + 1,
      this.time.getDate(),
    );
    // self.data.hijriDateDisplay = d.format('iDD ___ iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // self.data.hijriDateDisplay = padZero(hijriDate.getDate()) + ' ' + translations.ta.months[hijriDate.getMonth()] + ' ' + hijriDate.getFullYear();
    this.data.hijriDateDisplay =
      padZero(hijriDate.day) + ' ' + translations[this.lang].hijriMonths[hijriDate.month - 1] + ' ' + hijriDate.year;
    // self.data.hijriDateDisplay = hijriDate.toFormat('dd mm YYYY');

    this.data.hijriDate = hijriDate;
    // */
    this.updateBackground(true);
  }

  showNextDayPrayers() {
    this.prayers = this.nextDayPrayers.concat([]);
  }

  commitCurrentPrayer() {
    // if (!this.currentPrayer) {
    //   this.currentPrayerDescription = '';
    //   return;
    // }
    // if (this.currentPrayerWaiting) {
    //   this.currentPrayerDescription = translations[this.settings.langId].currentPrayerWaiting;
    // } else if (this.currentPrayerBefore) {
    //   this.currentPrayerDescription = translations[this.settings.langId].currentPrayerBefore;
    // } else if (this.currentPrayerAfter) {
    //   this.currentPrayerDescription = translations[this.settings.langId].currentPrayerAfter;
    // }
  }

  checkCurrentPrayer(currentPrayer: Prayer) {
    var nowTime = this.time.getTime();
    var iqamahTime = currentPrayer.iqamahTime.getTime();
    if (nowTime >= iqamahTime) {
      if (nowTime - iqamahTime < config.afterSeconds * 1000) {
        this.currentPrayer = currentPrayer;
        this.currentPrayerBefore = undefined;
        // self.data.currentPrayerAfter = true;
        var duration = moment.duration(nowTime - iqamahTime, 'milliseconds');
        // self.data.currentPrayerAfter = padZero(duration.minutes()) + ':' + padZero(duration.seconds());
        var pause = nowTime - iqamahTime < config.pauseSeconds * 1000;
        pause = true;
        this.currentPrayerAfter = {
          minutes: pause ? '00' : padZero(duration.minutes()),
          colon: this.currentPrayerAfter && this.currentPrayerAfter.colon == ':' ? ':' : ':',
          seconds: pause ? '00' : padZero(duration.seconds()),
        };
        this.currentPrayerWaiting = undefined;
      } else {
        if (currentPrayer.name === 'Isha') {
          this.showNextDayPrayers();
        }
        this.currentPrayer = undefined;
        this.currentPrayerBefore = undefined;
        this.currentPrayerAfter = undefined;
        this.currentPrayerWaiting = undefined;
      }
    } else {
      this.currentPrayer = currentPrayer;
      this.currentPrayerBefore = undefined as any;
      this.currentPrayerAfter = undefined;
      if (nowTime - currentPrayer.time.getTime() < config.pauseSeconds * 1000) {
        this.currentPrayerWaiting = undefined;
        this.currentPrayerBefore = {
          minutes: '00', // padZero(duration.minutes()),
          colon: this.currentPrayerBefore && this.currentPrayerBefore.colon == ':' ? ':' : ':',
          seconds: '00', // padZero(duration.seconds()),
        };

        return;
      }
      var _duration = moment.duration(iqamahTime - nowTime, 'milliseconds');
      this.currentPrayerWaiting = {
        minutes: padZero(_duration.minutes()),
        colon: this.currentPrayerWaiting && this.currentPrayerWaiting.colon == ':' ? '' : ':',
        seconds: padZero(_duration.seconds()),
      };
    }
  }

  updateEverySecond() {
    var nowTime = this.time.getTime();
    var nextTime = this.nextPrayer ? this.nextPrayer.time.getTime() : 0;
    // console.log('nextTick');
    if (nowTime >= nextTime + 1000) {
      console.log('coming next');
      var nextPrayer;
      const todayPrayers = this.todayPrayers || [];
      for (var i = 0; i < todayPrayers.length; i++) {
        var prayer = todayPrayers[i];
        if (nowTime < prayer.time.getTime()) {
          nextPrayer = prayer;
          break;
        }
      }
      if (!nextPrayer) {
        const nextDayPrayers = this.nextDayPrayers || [];
        if (!(nextDayPrayers[0] && nowTime < nextDayPrayers[0].time.getTime())) {
          // self.onDayUpdate();
          // return self.nextTick();
        }
        nextPrayer = nextDayPrayers[0];
        // self.showNextDayPrayers();
      }
      console.log('recalculate next prayer!', nextPrayer);
      this.nextPrayer = nextPrayer;
      nextTime = this.nextPrayer.time.getTime();

      // self.data.currentPrayer = self.data.nextPrayer;
      // this.currentPrayerBefore = undefined;
      this.currentPrayerAfter = undefined;
      this.currentPrayerWaiting = undefined;
      this.currentPrayerBefore = {
        minutes: '00', // padZero(duration.minutes()),
        colon: this.currentPrayerBefore && this.currentPrayerBefore.colon == ':' ? ':' : ':',
        seconds: '00', // padZero(duration.seconds()),
      };
    } else if (nextTime - nowTime < config.beforeSeconds * 1000) {
      this.currentPrayer = this.nextPrayer;
      var duration = moment.duration(nextTime - nowTime, 'milliseconds');
      this.currentPrayerBefore = {
        minutes: padZero(duration.minutes()),
        colon: this.currentPrayerBefore && this.currentPrayerBefore.colon == ':' ? '' : ':',
        seconds: padZero(duration.seconds()),
      };
      this.currentPrayerAfter = undefined;
      this.currentPrayerWaiting = undefined;
    } else {
      if (this.currentPrayer) {
        this.checkCurrentPrayer(this.currentPrayer);
      } else {
        if (this.isInitial) {
          console.log('is isInitial');
          // if (nowTime < ) {}
          var prevPrayer;
          if (this.nextPrayer === this.nextDayPrayers[0]) {
            prevPrayer = this.todayPrayers[this.todayPrayers.length - 1];
          } else {
            var idx = this.todayPrayers.indexOf(this.nextPrayer!);
            if (idx > 0) {
              // not subah
              prevPrayer = this.todayPrayers[idx - 1];
            }
          }
          if (prevPrayer) {
            this.checkCurrentPrayer(prevPrayer);
          }
          this.isInitial = false;
        } else {
          this.currentPrayer = undefined;
          this.currentPrayerBefore = undefined;
          this.currentPrayerAfter = undefined;
          this.currentPrayerWaiting = undefined;
        }
      }
    }
    // if (this.analogClock && this.data.analogClockActive) {
    //   this.analogClock.nextTick(this.data.time);
    // }
    this.commitCurrentPrayer();
  }

  tick() {
    // let useManualTime: Date | undefined;
    if (!this.timeOverridden && this.settings.timeOverrideCheck && this.settings.timeOverrideTime) {
      const mnt = moment(this.settings.timeOverrideTime, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
      this.time = mnt.toDate();
      this.time.setTime(this.time.getTime() - 1000);
      this.timeOverridden = true;
      console.log('timeOverridden', this.time);
    }
    if (this.timeOverridden || this.settings.simulateMillis) {
      this.time = new Date(this.time.getTime() + 1000);
    } else {
      this.time = new Date();
    }
    this.mnt = moment(this.time);
    this.updateDay();
    this.updateEverySecond();
    for (const id in this.onTickCallbacks) {
      this.onTickCallbacks[id]({
        time: this.time,
        mnt: this.mnt,
        prayers: this.prayers || [],
        //
        isFriday: this.isFriday,
        isRunning: this.isRunning,
        currentPrayer: this.currentPrayer,
        nextPrayer: this.nextPrayer,
        currentPrayerBefore: this.currentPrayerBefore,
        currentPrayerAfter: this.currentPrayerAfter,
        currentPrayerWaiting: this.currentPrayerWaiting,
        settings: this.settings,
      });
    }
  }

  onTick(callback: OnTickCallback, id: string) {
    console.log('onTick called - again', id, this.onTickCallbacks);
    this.onTickCallbacks[id] = callback;
  }
}

export type ClockInterface = Clock;

let _clock: Clock;

export const getClock = (settings: SettingsInterface) => {
  if (!_clock) {
    _clock = new Clock(settings);
  }
  return _clock;
};
