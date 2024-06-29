// import React from 'react';

import { VersionInfo, prayerDataList } from '../lib/common';
import { useEffect, useState } from 'react';
import OptionSelect from './OptionSelect';
import {
  IqamahTime,
  SettingsInterface,
  createConfigProfile,
  deleteConfigProfile,
  editConfigProfile,
  getConfigProfileData,
  importSettings,
  // importSettings,
  selectConfigProfile,
  updateIqamahTimeProp,
  writeSettings,
} from '../lib/settings-manager';
import CheckBox from './CheckBox';

interface Props {
  version: VersionInfo;
}

function SettingWindow({ version }: Props) {
  const [settings, setSettings] = useState<SettingsInterface>(importSettings());
  const [settingsConfigured, setSettingsConfigured] = useState(false);
  const [settingDemo, setSettingDemo] = useState({
    buttonClicking: false,
    isAbsolute: false,
  });
  const [configProfiles, setConfigProfiles] = useState([
    { id: '0', label: 'Default' },
    { id: '-1', label: 'Create New' },
  ]);
  const [currentProfileId, setCurrentProfileId] = useState('0');

  // const [iqamahTimes, setIqamahTimes] = useState(settings.iqamahTimes);

  //////////////////////////////////
  const langList = [
    { id: 'si', label: 'Sinhala' },
    { id: 'ta', label: 'Tamil' },
    { id: 'en', label: 'English' },
  ];
  const clockThemes = [
    { id: 'digitalDefault', label: 'Classic Digital' },
    { id: 'digitalModern', label: 'Modern Digital' },
    { id: 'analogDefault', label: 'Classic Analog' },
    { id: 'analogModern', label: 'Modern Analog' },
  ];
  const timeServerSSIDs = [
    { id: 'NodeMCU TimeServer', label: 'NodeMCU TimeServer' },
    { id: 'MDisplay TimeServer', label: 'MDisplay TimeServer' },
  ];
  //////////////////////////////////

  const updateSettings = (partialSettings: { [Property in keyof SettingsInterface]?: SettingsInterface[Property] }) => {
    const newSettings = { ...settings, ...partialSettings };
    setSettings(newSettings);
    writeSettings(newSettings);
    setSettingsConfigured(true);
  };

  const updateIqamahTimeMinutes = (iqamahTime: IqamahTime, minutes: string) => {
    updateIqamahTimes(updateIqamahTimeProp(settings.iqamahTimes, iqamahTime, 'minutes', minutes));
  };

  const updateIqamahTimeValue = (iqamahTime: IqamahTime, value: string) => {
    updateIqamahTimes(updateIqamahTimeProp(settings.iqamahTimes, iqamahTime, 'time', value));
  };

  const updateIqamahTimeAbsolute = (iqamahTime: IqamahTime) => {
    updateIqamahTimes(updateIqamahTimeProp(settings.iqamahTimes, iqamahTime, 'absolute', !iqamahTime.absolute));
  };

  const updateIqamahTimes = (iqamahTimes: IqamahTime[]) => {
    updateSettings({ iqamahTimes });
  };

  const createProfile = (profileName: string) => {
    createConfigProfile(profileName);
    getProfileData();
  };
  const editProfile = (profileName: string) => {
    editConfigProfile(profileName);
    getProfileData();
  };
  const deleteProfile = () => {
    const tobeDeletedProfileId = currentProfileId;
    deleteConfigProfile(tobeDeletedProfileId);
    selectProfile('0');
  };
  const selectProfile = (selected: string) => {
    selectConfigProfile(selected);
    getProfileData(true);
  };
  const getProfileData = (force = false) => {
    const data = getConfigProfileData(force);
    setSettings(data.settings);
    setConfigProfiles(
      [...data.profiles, { id: '-1', label: 'Create New' }].map((profile, i) => {
        profile.label = profile.label || `Profile ${i + 1}`;
        if (i === 0) {
          profile.label = 'Default';
        }
        return profile;
      }),
    );
    setCurrentProfileId(data.currentProfile);
    setSettingsConfigured(data.configured);
  };

  const demostrate = (absolute = false) => {
    console.log('demonstrating', absolute, settingDemo);
    setSettingDemo({
      isAbsolute: absolute,
      buttonClicking: true,
    });
    setTimeout(() => {
      setSettingDemo({
        isAbsolute: absolute,
        buttonClicking: false,
      });
      setTimeout(() => {
        console.log('demo 2', settingDemo);
        setSettingDemo({
          // isAbsolute: absolute,
          buttonClicking: false,
          isAbsolute: !absolute,
        });
        setTimeout(() => {
          demostrate(!absolute);
        }, 1500);
      }, 100);
    }, 300);
  };

  useEffect(() => {
    getProfileData();
    console.log('configProfiles', configProfiles);
    setTimeout(() => {
      demostrate();
    }, 1000);
  }, []);

  const closeSettings = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="modal-wrapper">
        <div
          className="modal-overlay"
          onClick={() => {
            closeSettings();
          }}
        ></div>
        <div className="modal-dialog">
          <div
            onClick={() => {
              closeSettings();
            }}
            className="modal-close modal-close-top"
          >
            Close
          </div>
          <div className="modal-content">
            <div className="configured-info">
              <span style={{ color: '#aaa', background: '#000', padding: '2px 5px' }}>
                Version {version.versionString}
                (v.{version.versionNumber})
              </span>
              &nbsp;
              {settingsConfigured ? (
                <span className="configured">Configured</span>
              ) : (
                <span className="not-configured">Not Configured</span>
              )}
            </div>
            <div className="update-info">
              <div className="kiosk-config"></div>
            </div>
            <div style={{ textAlign: 'left', color: '#f0f0f0' }}>
              {currentProfileId !== '0' ? (
                <small style={{ float: 'right', marginTop: '5px' }}>
                  <a
                    style={{ color: '#fff', background: '#3d77a6', padding: '1px 5px' }}
                    href="#"
                    onClick={() => {
                      let profileName = prompt('Edit Profile Name', configProfiles[currentProfileId as any].label);
                      if (profileName !== null) {
                        if (profileName.trim() == '') {
                          alert('Profile Name cannot be empty!');
                          return;
                        }
                        editProfile(profileName);
                        return;
                      }
                    }}
                  >
                    Edit Profile
                  </a>
                  &nbsp;
                  <a
                    style={{ background: '#ab2d06', color: '#FFF', padding: '1px 5px' }}
                    href="#"
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete profile "${configProfiles[currentProfileId as any].label}"`,
                        )
                      ) {
                        deleteProfile();
                      }
                    }}
                  >
                    Delete Profile
                  </a>
                </small>
              ) : (
                <></>
              )}
              <div className="setting-profile-container" style={{ marginBottom: '5px', marginTop: '-5px' }}>
                <OptionSelect
                  id="config-profile"
                  label="Settings Profile"
                  optionList={configProfiles}
                  selectedId={currentProfileId}
                  onSelect={(selected) => {
                    // updateSettings({ clockThemeId: selected });
                    if (selected === '-1') {
                      const profileName = prompt('Create New Config Profile', `Profile ${configProfiles.length}`);
                      if (profileName !== null) {
                        if (profileName.trim() == '') {
                          alert('Profile Name cannot be empty!');
                          return;
                        }
                        createProfile(profileName);
                        return;
                      }

                      return;
                    }
                    selectProfile(selected);
                  }}
                />
              </div>
            </div>
            <div className="config-wrapper">
              <section className="config-container others-config">
                <div className="config-item other-config" style={{ height: 'auto' }}>
                  <OptionSelect
                    id="prayer-data"
                    label="Prayer Times Data"
                    optionList={prayerDataList}
                    selectedId={settings.prayerTimesDataId}
                    onSelect={(selected) => {
                      updateSettings({
                        prayerTimesDataId: selected,
                      });
                    }}
                  />
                </div>
                <div className="config-item other-config">
                  <label>Time Adjustment:</label>
                  &nbsp;
                  <input
                    className="time-input"
                    type="number"
                    value={settings.timeAdjustmentMinutes}
                    onChange={(event) => {
                      updateSettings({ timeAdjustmentMinutes: parseInt(event.target.value) });
                    }}
                  />
                  &nbsp;
                  <span>minutes</span>
                </div>
                <div className="config-item other-config" style={{ height: 'auto' }}>
                  <OptionSelect
                    id="languages"
                    label="Language"
                    optionList={langList}
                    selectedId={settings.langId}
                    onSelect={(selected) => {
                      updateSettings({ langId: selected });
                    }}
                  />
                </div>
                <div className="config-item other-config" style={{ height: 'auto' }}>
                  <OptionSelect
                    id="clock-themes"
                    label="Clock Theme"
                    optionList={clockThemes}
                    selectedId={settings.clockThemeId}
                    onSelect={(selected) => {
                      updateSettings({ clockThemeId: selected });
                    }}
                  />
                </div>
                <div className="config-item other-config">
                  <CheckBox
                    id="time24-format"
                    label="24 Hours time format (beta)"
                    checked={settings.time24Check}
                    onChange={(checked) => {
                      updateSettings({ time24Check: checked });
                    }}
                  />
                </div>
                <div className="config-item other-config">
                  <CheckBox
                    id="sunrise-support"
                    label="Sunrise Support (beta)"
                    checked={settings.sunriseSupportCheck}
                    onChange={(checked) => {
                      updateSettings({ sunriseSupportCheck: checked });
                    }}
                  />
                </div>
                <div className="config-item other-config">
                  <CheckBox
                    id="alert-icons"
                    label="Warning and Reminder Icons"
                    checked={settings.alertIconsCheck}
                    onChange={(checked) => {
                      updateSettings({ alertIconsCheck: checked });
                    }}
                  />
                </div>
                <div className="config-item other-config" style={{ height: 'auto' }}>
                  <CheckBox
                    id="network-time"
                    label="Use Network Time API"
                    checked={settings.useNetworkTime}
                    onChange={(checked) => {
                      updateSettings({ useNetworkTime: checked });
                    }}
                  />
                  {settings.useNetworkTime ? (
                    <div>
                      <input
                        type="url"
                        value={settings.networkTimeApiUrl}
                        onChange={(event) => {
                          updateSettings({ networkTimeApiUrl: event.target.value });
                        }}
                        style={{ width: '100%', marginBottom: '5px' }}
                      />

                      <div>
                        <OptionSelect
                          id="time-server-ssid"
                          label="SSID"
                          optionList={timeServerSSIDs}
                          selectedId={settings.networkTimeServerSSID}
                          onSelect={(selected) => {
                            updateSettings({ networkTimeServerSSID: selected });
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="config-item other-config">
                  {settingsConfigured ? (
                    <span>
                      <a
                        href="#"
                        onClick={() => {
                          //   backupSettings();
                        }}
                      >
                        <small>Backup Settings</small>
                      </a>
                      &nbsp; &middot; &nbsp;
                    </span>
                  ) : (
                    <></>
                  )}
                  <a href="#">
                    <small>Restore Settings</small>
                  </a>
                </div>
              </section>

              <section className="config-container times-config">
                <div className="config-item time-config" style={{ background: '#999', paddingTop: '3px' }}>
                  {/* <small>Example: &nbsp;</small> */}
                  <span className="label">
                    <small style={{ textDecoration: 'underline' }}>Iqamah</small>
                  </span>
                  <span style={{ position: 'relative' }}>
                    {settingDemo.buttonClicking ? (
                      <span
                        style={{
                          background: 'rgba(255, 0, 0, 0.6)',
                          display: 'inline-block',
                          width: '1.5rem',
                          height: '1.5rem',
                          borderRadius: '50%',
                          position: 'absolute',
                          left: '4px',
                          top: '-1px',
                        }}
                      ></span>
                    ) : (
                      <></>
                    )}
                    {!settingDemo.isAbsolute ? (
                      <span>
                        <span className="is-not-absolute toggle-absolute" style={{ opacity: '0.95' }}>
                          <span className="plus">+</span>
                        </span>
                        <input className="time-input" type="number" value="20" readOnly={true} disabled={true} />
                        <span className="time-info">
                          <small className="">minutes</small>
                        </span>
                      </span>
                    ) : (
                      <span>
                        <span className="is-absolute toggle-absolute" style={{ opacity: '0.95' }}>
                          <span className="at">@</span>
                        </span>
                        <input type="time" value="12:30" readOnly={true} disabled={true} />
                        <span className="time-info">
                          <small className="">fixed</small>
                        </span>
                      </span>
                    )}
                  </span>
                </div>
                {settings.iqamahTimes.map((iqamahTime, i) => {
                  return (
                    <div key={i} className="config-item time-config">
                      <span className="label">{iqamahTime.name}</span>

                      <span
                        className={`${iqamahTime.absolute ? 'is-absolute' : 'is-not-absolute'} toggle-absolute`}
                        onClick={() => {
                          updateIqamahTimeAbsolute(iqamahTime);
                        }}
                      >
                        {iqamahTime.absolute ? <span className="at">@</span> : <span className="plus">+</span>}
                      </span>

                      {iqamahTime.absolute ? (
                        <>
                          <input
                            type="time"
                            value={iqamahTime.time}
                            onChange={(event) => {
                              updateIqamahTimeValue(iqamahTime, event.target.value);
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <input
                            className="time-input"
                            type="number"
                            value={iqamahTime.minutes}
                            onChange={(event) => {
                              updateIqamahTimeMinutes(iqamahTime, event.target.value);
                            }}
                          />
                        </>
                      )}

                      <span className="time-info">
                        {iqamahTime.absolute ? (
                          <small>
                            {/* <span v-if="name == 'Subah'">AM</span>
                            <span v-else>PM</span> */}
                            fixed
                          </small>
                        ) : (
                          <small className="">minutes</small>
                        )}
                      </span>
                    </div>
                  );
                })}
              </section>

              <section className="config-container times-config" style={{ marginTop: '0.5rem' }}>
                <div className="config-item other-config">
                  <label>Jummah Duration:</label>
                  &nbsp;
                  <input
                    className="time-input"
                    type="number"
                    value={settings.jummahEndMinutes}
                    onChange={(event) => {
                      updateSettings({ jummahEndMinutes: parseInt(event.target.value) });
                    }}
                  />
                  &nbsp;
                  <span>minutes</span>
                </div>
                <div className="config-item other-config" style={{ height: 'auto' }}>
                  <CheckBox
                    id="time-override"
                    label="Time Override (beta)"
                    checked={settings.timeOverrideCheck}
                    onChange={(checked) => {
                      updateSettings({ timeOverrideCheck: checked });
                    }}
                  />
                  <a
                    href="#"
                    onClick={() => {
                      updateSettings({ timeOverrideTime: '', timeOverrideCheck: false });
                    }}
                  >
                    &nbsp; Reset
                  </a>
                  <input
                    id="time-override-input"
                    type="datetime-local"
                    name="time-override-input"
                    value={settings.timeOverrideTime}
                    step="1"
                    onChange={(event) => {
                      updateSettings({ timeOverrideTime: event.target.value });
                    }}
                  />
                </div>
                <div className="config-item other-config">
                  <CheckBox
                    id="is-dev-mode"
                    label="Developer Mode"
                    checked={settings.isDevMode}
                    onChange={(checked) => {
                      updateSettings({ isDevMode: checked });
                    }}
                  />
                </div>
                {settings.isDevMode ? (
                  <div className="config-item other-config">
                    <label>[Dev] Simulate millis:</label>
                    &nbsp;
                    <input
                      className="time-input"
                      type="number"
                      value={settings.simulateMillis}
                      onChange={(event) => {
                        updateSettings({ simulateMillis: parseInt(event.target.value) });
                      }}
                    />
                    &nbsp;
                    {/* <span>millis</span> */}
                  </div>
                ) : (
                  <></>
                )}
              </section>
            </div>
            <div
              onClick={() => {
                closeSettings();
              }}
              className="modal-close modal-close-bottom"
            >
              Close
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingWindow;
