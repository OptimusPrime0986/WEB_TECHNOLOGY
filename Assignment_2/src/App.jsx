import { useEffect, useMemo, useState } from 'react'
import './App.css'

const zoneCatalog = [
  { id: 'local', label: 'Local Device', city: 'System Time' },
  { id: 'UTC', label: 'UTC', city: 'London / GMT' },
  { id: 'America/New_York', label: 'New York', city: 'United States' },
  { id: 'America/Los_Angeles', label: 'Los Angeles', city: 'United States' },
  { id: 'Europe/London', label: 'London', city: 'United Kingdom' },
  { id: 'Europe/Paris', label: 'Paris', city: 'France' },
  { id: 'Europe/Berlin', label: 'Berlin', city: 'Germany' },
  { id: 'Asia/Dubai', label: 'Dubai', city: 'United Arab Emirates' },
  { id: 'Asia/Kolkata', label: 'Mumbai', city: 'India' },
  { id: 'Asia/Tokyo', label: 'Tokyo', city: 'Japan' },
  { id: 'Asia/Singapore', label: 'Singapore', city: 'Singapore' },
  { id: 'Australia/Sydney', label: 'Sydney', city: 'Australia' },
]

const accentOptions = [
  { name: 'Cyan', value: '#67e8f9' },
  { name: 'Violet', value: '#a78bfa' },
  { name: 'Emerald', value: '#6ee7b7' },
  { name: 'Coral', value: '#f9a8d4' },
]

const defaultTimezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney']

const defaultAlarms = [
  { id: 1, name: 'Morning Brief', zone: 'UTC', time: '08:30', enabled: true, ringing: false },
  { id: 2, name: 'Standup Call', zone: 'Asia/Kolkata', time: '10:00', enabled: true, ringing: false },
]

function getZoneMeta(zoneId) {
  if (zoneId === 'local') {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    return { id: tz, label: tz.split('/').at(-1).replace('_', ' '), city: 'Local Device' }
  }

  return zoneCatalog.find((zone) => zone.id === zoneId) || {
    id: zoneId,
    label: zoneId,
    city: zoneId,
  }
}

function getOffsetLabel(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const zoneName = parts.find((part) => part.type === 'timeZoneName')?.value || 'GMT+0'
  return zoneName.replace('GMT', 'UTC')
}

function getZoneClock(date, timeZone, hour12) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12,
  })

  const parts = formatter.formatToParts(date)
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]),
  )

  const hour = Number(values.hour || 0)
  const minute = Number(values.minute || 0)
  const second = Number(values.second || 0)

  return {
    hour,
    minute,
    second,
    display: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
    shortTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    dateLabel: new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date),
    dayLabel: new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
    }).format(date),
    offset: getOffsetLabel(date, timeZone),
  }
}

function App() {
  const [now, setNow] = useState(new Date())
  const [primaryZone, setPrimaryZone] = useState('UTC')
  const [timeZones, setTimeZones] = useState(defaultTimezones)
  const [newZone, setNewZone] = useState('Europe/Paris')
  const [hourMode, setHourMode] = useState('24h')
  const [darkMode, setDarkMode] = useState(true)
  const [accentColor, setAccentColor] = useState('#67e8f9')
  const [glassLevel, setGlassLevel] = useState(72)
  const [newAlarm, setNewAlarm] = useState({
    name: 'Focus Block',
    zone: 'UTC',
    time: '09:00',
  })
  const [alarms, setAlarms] = useState(defaultAlarms)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    alarms.forEach((alarm) => {
      if (!alarm.enabled) return

      const currentTime = getZoneClock(now, alarm.zone, false).shortTime

      if (currentTime === alarm.time && !alarm.ringing) {
        setAlarms((previous) =>
          previous.map((entry) =>
            entry.id === alarm.id ? { ...entry, ringing: true } : entry,
          ),
        )

        const AudioContextClass = window.AudioContext || window.webkitAudioContext
        if (AudioContextClass) {
          const context = new AudioContextClass()
          const oscillator = context.createOscillator()
          const gain = context.createGain()

          oscillator.type = 'sine'
          oscillator.frequency.value = 880
          gain.gain.value = 0.04

          oscillator.connect(gain)
          gain.connect(context.destination)

          oscillator.start()
          oscillator.stop(context.currentTime + 0.8)
          gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.8)
        }
      }

      if (currentTime !== alarm.time && alarm.ringing) {
        setAlarms((previous) =>
          previous.map((entry) =>
            entry.id === alarm.id ? { ...entry, ringing: false } : entry,
          ),
        )
      }
    })
  }, [alarms, now])

  const primaryClock = useMemo(
    () => getZoneClock(now, primaryZone === 'local' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : primaryZone, hourMode === '12h'),
    [hourMode, now, primaryZone],
  )

  const analogAngles = useMemo(() => {
    const hourValue = primaryClock.hour % 12 + primaryClock.minute / 60 + primaryClock.second / 3600
    const minuteValue = primaryClock.minute + primaryClock.second / 60

    return {
      hour: hourValue * 30,
      minute: minuteValue * 6,
      second: primaryClock.second * 6,
    }
  }, [primaryClock])

  const zoneList = useMemo(
    () =>
      timeZones.map((zoneId) => {
        const zone = getZoneMeta(zoneId)
        const info = getZoneClock(now, zoneId === 'local' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : zoneId, hourMode === '12h')

        return {
          ...zone,
          ...info,
        }
      }),
    [hourMode, now, timeZones],
  )

  const addZone = () => {
    if (!newZone || timeZones.includes(newZone)) {
      return
    }

    setTimeZones((current) => [...current, newZone])
    setPrimaryZone(newZone)
  }

  const removeZone = (zoneId) => {
    if (timeZones.length <= 1) {
      return
    }

    setTimeZones((current) => current.filter((entry) => entry !== zoneId))
    if (primaryZone === zoneId) {
      setPrimaryZone('UTC')
    }
  }

  const updateAlarmState = (alarmId, attribute, value) => {
    setAlarms((previous) =>
      previous.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, [attribute]: value } : alarm,
      ),
    )
  }

  const addAlarm = () => {
    if (!newAlarm.name || !newAlarm.time) {
      return
    }

    const nextAlarm = {
      id: Date.now(),
      name: newAlarm.name,
      zone: newAlarm.zone,
      time: newAlarm.time,
      enabled: true,
      ringing: false,
    }

    setAlarms((previous) => [...previous, nextAlarm])
    setNewAlarm({ name: '', zone: newAlarm.zone, time: '09:00' })
  }

  return (
    <div
      className={`app-shell ${darkMode ? 'dark' : 'light'}`}
      style={{
        '--accent-color': accentColor,
        '--panel-opacity': `${glassLevel / 100}`,
      }}
    >
      <aside className="sidebar panel">
        <div className="logo-block">
          <div className="logo-mark">◔</div>
          <div>
            <p className="eyebrow">LIVE MONITOR</p>
            <h1>World Clock</h1>
          </div>
        </div>

        <div className="section-block">
          <label className="field">
            <span>Primary Time Zone</span>
            <select value={primaryZone} onChange={(event) => setPrimaryZone(event.target.value)}>
              {zoneCatalog.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.label}
                </option>
              ))}
            </select>
          </label>

          <div className="field">
            <span>Display Format</span>
            <div className="segmented-control">
              <button
                type="button"
                className={hourMode === '24h' ? 'active' : ''}
                onClick={() => setHourMode('24h')}
              >
                24h
              </button>
              <button
                type="button"
                className={hourMode === '12h' ? 'active' : ''}
                onClick={() => setHourMode('12h')}
              >
                12h
              </button>
            </div>
          </div>

          <div className="field">
            <span>Theme</span>
            <div className="switch-row">
              <button
                type="button"
                className={`toggle ${darkMode ? 'active' : ''}`}
                onClick={() => setDarkMode(true)}
              >
                Dark
              </button>
              <button
                type="button"
                className={`toggle ${!darkMode ? 'active' : ''}`}
                onClick={() => setDarkMode(false)}
              >
                Light
              </button>
            </div>
          </div>

          <div className="field">
            <span>Glass Intensity</span>
            <input
              type="range"
              min="35"
              max="100"
              value={glassLevel}
              onChange={(event) => setGlassLevel(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="section-block">
          <div className="section-header">
            <h2>Regions</h2>
          </div>

          <div className="add-zone-wrap">
            <select value={newZone} onChange={(event) => setNewZone(event.target.value)}>
              {zoneCatalog
                .filter((zone) => zone.id !== 'local')
                .map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.label}
                  </option>
                ))}
            </select>
            <button type="button" className="primary-btn" onClick={addZone}>
              Add
            </button>
          </div>

          <div className="zone-list">
            {timeZones.map((zoneId) => {
              const zone = getZoneMeta(zoneId)
              const info = getZoneClock(
                now,
                zoneId === 'local' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : zoneId,
                hourMode === '12h',
              )

              return (
                <div key={zoneId} className={`zone-item ${primaryZone === zoneId ? 'selected' : ''}`}>
                  <button type="button" className="select-zone" onClick={() => setPrimaryZone(zoneId)}>
                    <span>
                      <strong>{zone.label}</strong>
                      <small>{zone.city}</small>
                    </span>
                    <span className="time-line">{info.shortTime}</span>
                  </button>
                  {timeZones.length > 1 && (
                    <button type="button" className="remove-zone" onClick={() => removeZone(zoneId)}>
                      ×
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-block">
          <div className="section-header">
            <h2>Alarm Planner</h2>
          </div>

          <div className="alarm-form">
            <input
              type="text"
              placeholder="Alarm name"
              value={newAlarm.name}
              onChange={(event) => setNewAlarm((current) => ({ ...current, name: event.target.value }))}
            />
            <div className="inline-form">
              <input
                type="time"
                value={newAlarm.time}
                onChange={(event) => setNewAlarm((current) => ({ ...current, time: event.target.value }))}
              />
              <select
                value={newAlarm.zone}
                onChange={(event) => setNewAlarm((current) => ({ ...current, zone: event.target.value }))}
              >
                {zoneCatalog.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="primary-btn wide" onClick={addAlarm}>
              Add Alarm
            </button>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="top-strip panel">
          <div>
            <p className="eyebrow">SYSTEM STATUS</p>
            <h2>Global Time Hub</h2>
          </div>
          <div className="live-indicator">
            <span className="live-dot" />
            Live synchronized
          </div>
        </header>

        <section className="hero-grid">
          <div className="clock-panel panel">
            <div className="clock-shell">
              <div className="clock-face">
                {Array.from({ length: 12 }, (_, index) => (
                  <span
                    key={index}
                    className="tick"
                    style={{ transform: `translate(-50%, -50%) rotate(${index * 30}deg) translateY(-120px)` }}
                  />
                ))}
                <div className="center-dot" />
                <div className="hand hour-hand" style={{ transform: `translateX(-50%) rotate(${analogAngles.hour}deg)` }} />
                <div className="hand minute-hand" style={{ transform: `translateX(-50%) rotate(${analogAngles.minute}deg)` }} />
                <div className="hand second-hand" style={{ transform: `translateX(-50%) rotate(${analogAngles.second}deg)` }} />
              </div>
            </div>
          </div>

          <div className="digital-panel panel">
            <p className="eyebrow">ACTIVE REGION</p>
            <h3>{getZoneMeta(primaryZone).label}</h3>
            <div className="time-readout">{primaryClock.display}</div>
            <div className="date-readout">{primaryClock.dateLabel}</div>
            <div className="meta-row">
              <span>{primaryClock.dayLabel}</span>
              <span>{primaryClock.offset}</span>
            </div>

            <div className="accent-picker">
              {accentOptions.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  className={accentColor === option.value ? 'swatch active' : 'swatch'}
                  aria-label={option.name}
                  style={{ background: option.value }}
                  onClick={() => setAccentColor(option.value)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="regions-grid">
          {zoneList.map((zone) => (
            <article key={zone.id} className="region-card panel">
              <div className="region-header">
                <div>
                  <p className="eyebrow">{zone.city}</p>
                  <h4>{zone.label}</h4>
                </div>
                <span className="region-offset">{zone.offset}</span>
              </div>

              <div className="region-time">{zone.display}</div>
              <div className="region-date">{zone.dateLabel}</div>
            </article>
          ))}
        </section>

        <section className="alarm-dashboard panel">
          <div className="section-header">
            <h2>Alarm Board</h2>
            <span>{alarms.filter((alarm) => alarm.enabled).length} active</span>
          </div>

          <div className="alarm-list">
            {alarms.map((alarm) => (
              <div key={alarm.id} className={`alarm-item ${alarm.ringing ? 'ringing' : ''}`}>
                <div>
                  <p className="alarm-name">{alarm.name}</p>
                  <p className="alarm-meta">
                    {getZoneMeta(alarm.zone).label} • {alarm.time}
                  </p>
                </div>

                <div className="alarm-actions">
                  <label className="mini-toggle">
                    <input
                      type="checkbox"
                      checked={alarm.enabled}
                      onChange={(event) => updateAlarmState(alarm.id, 'enabled', event.target.checked)}
                    />
                    <span />
                  </label>
                  <button type="button" onClick={() => setAlarms((current) => current.filter((entry) => entry.id !== alarm.id))}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
