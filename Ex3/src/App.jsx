import { useState } from 'react';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';
import styles from './App.module.css';

const SQUADS = [
  { id: 'ces', label: 'CES' },
  { id: 'te', label: 'TE' },
  { id: 'ge', label: 'GE' },
];

function App() {
  const [squadId, setSquadId] = useState(null);

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>PVS Live Telemetry</h1>

      <p className={styles.squads}>
        {SQUADS.map((squad) => (
          <button
            className={styles.squadButton}
            key={squad.id}
            type="button"
            aria-pressed={squadId === squad.id}
            onClick={() => setSquadId(squad.id)}
          >
            {squad.label}
          </button>
        ))}
      </p>

      <PubgMatchTelemetry squadId={squadId} />
    </main>
  );
}

export default App;
