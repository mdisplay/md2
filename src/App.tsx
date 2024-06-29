// import React from 'react';

import SettingButton from './components/SettingButton';
import { version } from './lib/common';
import BgHandler from './components/BgHandler';
import InvalidTimeDisplay from './components/InvalidTimeDisplay';
import DigitalClock from './components/DigitalClock';
import DateDisplay from './components/DateDisplay';
import AlertDisplay from './components/AlertDisplay';
import PrayerList from './components/PrayerList';
import { useEffect, useState } from 'react';
import SettingWindow from './components/SettingWindow';
import PrayerDisplay from './components/PrayerDisplay';
import ActiveTimer from './components/ActiveTimer';
import { onEnterCallback, openSettings } from './lib/shortcuts-manager';
import { getClock } from './lib/clock';
import { importSettings } from './lib/settings-manager';

// import { AppDispatch, RootState } from './state/store';
// import { setTime } from './state/main/index.ts';
// import { useDispatch } from 'react-redux';

// interface TimeDisplay {
//   hours: string;
//   minutes: string;
//   seconds: string;
//   colon: string;
//   amPm: string;
// }

const _lastKnown: any = {};

function App() {
  const [settingOpen, setSettingOpen] = useState(false);
  // const [timeDisplay, setTimeDisplay] = useState<TimeDisplay>({} as any);
  const timeIsValid = true;
  const showAlert = false;

  const settings = importSettings();
  // const dispatch = useDispatch<AppDispatch>();

  const analogClockTheme = 'modern';
  const digitalClockTheme = 'modern';
  const appClasses = [
    // {
    //   "analog-clock-active": analogClockActive,
    //   "is-active": currentPrayer,
    //   "is-waiting": currentPrayerWaiting,
    //   "is-before": currentPrayerBefore,
    //   "is-after": currentPrayerAfter,
    // },
    // 'active-prayer-info-' + prayerInfo,
    'analog-clock-theme-' + analogClockTheme,
    'digital-clock-theme-' + digitalClockTheme,
  ];

  const clock = getClock(settings);
  clock.run();

  useEffect(() => {
    onEnterCallback(() => {
      openSettings(true);
      setSettingOpen(true);
    });
    clock.onTick(
      ({
        time,
        mnt,
        prayers,
        //
        isFriday,
        // isRunning,
        currentPrayer,
        nextPrayer,
        currentPrayerBefore,
        currentPrayerAfter,
        currentPrayerWaiting,
      }) => {
        // if (currentPrayerBefore && _lastKnown.currentPrayerBefore !== currentPrayerBefore) {
        //   dispatch(setCurrentPrayerBefore(currentPrayerBefore));
        // }
        // if (currentPrayerAfter && _lastKnown.currentPrayerAfter !== currentPrayerAfter) {
        //   dispatch(setCurrentPrayerAfter(currentPrayerAfter));
        // }
        // if (currentPrayerWaiting && _lastKnown.currentPrayerWaiting !== currentPrayerWaiting) {
        //   dispatch(setCurrentPrayerWaiting(currentPrayerWaiting));
        // }
        _lastKnown.time = time;
        _lastKnown.mnt = mnt;
        _lastKnown.prayers = prayers;
        _lastKnown.isFriday = isFriday;
        _lastKnown.currentPrayer = currentPrayer;
        _lastKnown.nextPrayer = nextPrayer;
        _lastKnown.currentPrayerBefore = currentPrayerBefore;
        _lastKnown.currentPrayerAfter = currentPrayerAfter;
        _lastKnown.currentPrayerWaiting = currentPrayerWaiting;
      },
      'App',
    );
  }, []);

  console.log('render...');

  return (
    <section id="app" className={appClasses.join(' ')}>
      {settingOpen ? (
        <SettingWindow version={version} />
      ) : (
        <>
          <SettingButton
            network={{
              showInternetAvailability: true,
              internetAvailable: true,
              status: 'Test',
            }}
            version={version}
            onClick={() => {
              setSettingOpen(true);
              openSettings(true);
            }}
          />
          {settings.isDevMode ? <div className="is-dev-mode">Developer Mode</div> : <></>}
          <BgHandler clock={clock} />
          {timeIsValid ? (
            <>
              <DigitalClock
                clock={clock}
                dateDisplay={
                  <DateDisplay
                    clock={clock}
                    currentlyShowingAlert=""
                    showAlert={showAlert}
                    alertDisplay={<AlertDisplay clock={clock} />}
                  />
                }
              />
              <PrayerDisplay clock={clock} />
              <ActiveTimer clock={clock} />
              <PrayerList clock={clock} />
              <div>Valid</div>
            </>
          ) : (
            <InvalidTimeDisplay
              network={{
                showInternetAvailability: true,
                internetAvailable: true,
                status: 'Test',
              }}
              networkTimeInitialized={true}
              timeOriginMode={'device'}
              timeFormatted="dfdf"
              timeFetchingMessage={{
                color: 'red',
                text: 'cool',
              }}
            />
          )}
        </>
      )}
    </section>
  );
}

export default App;
