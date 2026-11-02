import { useState } from 'react';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';

const SQUADS = [
  { id: 'ces', label: 'CES' },
  { id: 'te', label: 'TE' },
  { id: 'ge', label: 'GE' },
];

function App() {
  const [squadId, setSquadId] = useState(null);

  return (
    <main>
      {SQUADS.map((squad) => (
        <button
          key={squad.id}
          type="button"
          aria-pressed={squadId === squad.id}
          onClick={() => setSquadId(squad.id)}
        >
          {squad.label}
        </button>
      ))}

      <PubgMatchTelemetry squadId={squadId} />
    </main>
  );
}

export default App;
