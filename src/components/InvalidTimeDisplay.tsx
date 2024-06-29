// import React from 'react';

import { NetworkInfo } from '../lib/common';

interface Props {
  timeOriginMode: string;
  network: NetworkInfo;
  networkTimeInitialized: boolean;
  timeFormatted: string;
  timeFetchingMessage: {
    color: string;
    text: string;
  };
}

function InvalidTimeDisplay({
  network,
  networkTimeInitialized,
  timeOriginMode,
  timeFormatted,
  timeFetchingMessage,
}: Props) {
  return (
    <>
      <div className="invalid-time-container">
        <h3>Waiting for time update...</h3>
        <h2>from {timeOriginMode == 'network' ? 'network' : 'device'}</h2>
        <h3>
          <small>Network Status: </small>
          <strong>{network.status}</strong>
        </h3>
        <h1 style={{ color: networkTimeInitialized ? '#ff1919' : '#ff1919' }}>
          <small>Device time:</small> {timeFormatted}
        </h1>
        {timeFetchingMessage ? (
          <h3 v-if="timeFetchingMessage" style={{ color: timeFetchingMessage.color }}>
            {timeFetchingMessage.text}
          </h3>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default InvalidTimeDisplay;
