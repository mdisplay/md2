// import React from 'react';

import { useEffect, useState } from 'react';
import { ClockInterface } from '../lib/clock';

// import { VersionInfo, NetworkInfo } from "../common";

function allImages() {
  const allImages = [];
  const bgVersion = 7;
  for (let i = 1; i <= 60; i++) {
    allImages.push(<img key={i} src={`backgrounds/${i - 1}.jpg?v=${bgVersion}`} />);
  }
  return allImages;
}

let _lastKnownMinute = -1;

interface Props {
  clock: ClockInterface;
}

function BgHandler({ clock }: Props) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    clock.onTick(({ mnt }) => {
      const minute = mnt.minutes();
      if (_lastKnownMinute === minute) {
        // do not set without checking - avoid re rendering
        return;
      }
      _lastKnownMinute = minute;
      setImageIndex(minute);
    }, 'BgHandler');
  }, []);

  const backgroundImage = `backgrounds/${imageIndex}.jpg`;
  console.log('backgroundImage', backgroundImage);

  return (
    <>
      <div
        style={{
          visibility: 'hidden',
          position: 'fixed',
          top: '-125%',
        }}
      >
        {allImages()}
      </div>

      {backgroundImage ? (
        <div id="bgful" className="bgful-container">
          <div className="bgful-overlay"></div>
          <div className="bgful-image">
            <img src={backgroundImage} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default BgHandler;
