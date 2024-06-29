import { useEffect, useState } from 'react';
import { ClockInterface } from '../lib/clock';
import { PrayerInterface } from '../lib/prayer-manager';

interface Props {
  clock: ClockInterface;
}

var alerts = ['alert1.png', 'alert2.gif'];

const _lastKnown = {
  currentAlert: 0,
  shouldShow: false,
  currentPrayer: undefined,
};

function AlertDisplay({ clock }: Props) {
  const [currentPrayer, setCurrentPrayer] = useState<PrayerInterface>();

  const [alertState, setAlertState] = useState({
    currentlyShowing: 'alert1.png',
    shouldShow: false,
  });

  useEffect(() => {
    clock.onTick(({ mnt, currentPrayer, currentPrayerWaiting, currentPrayerAfter }) => {
      if (_lastKnown.currentPrayer !== currentPrayer) {
        _lastKnown.currentPrayer = currentPrayer as any;
        setCurrentPrayer(currentPrayer);
      }
      if (!(currentPrayerWaiting || currentPrayerAfter) || mnt.seconds() % 2 !== 0) {
        return;
      }
      const shouldShow = _lastKnown.shouldShow && (currentPrayerWaiting || currentPrayerAfter);

      if (!_lastKnown.currentAlert) {
        _lastKnown.currentAlert = 0;
      }
      if (shouldShow) {
        _lastKnown.currentAlert += 1;
        if (_lastKnown.currentAlert >= alerts.length) {
          _lastKnown.currentAlert = 0;
        }
      }
      const currentlyShowing = alerts[_lastKnown.currentAlert || 0];
      setAlertState({
        currentlyShowing,
        shouldShow: !!shouldShow,
      });
      _lastKnown.shouldShow = !shouldShow;
    }, 'AlertDisplay');
  }, []);

  if (!currentPrayer) {
    return <></>;
  }
  return (
    <>
      <span className="alert-container" style={{ opacity: alertState.shouldShow ? '1' : '0' }}>
        <img src={'assets/images/' + alertState.currentlyShowing} />
      </span>
    </>
  );
}

export default AlertDisplay;
