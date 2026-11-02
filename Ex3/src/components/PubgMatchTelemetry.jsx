import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from '../api/fetchKraftonPubgTelemetry.js';

export function PubgMatchTelemetry({ squadId = 'te' }) {
  const [view, setView] = useState({ status: 'IDLE', data: null, error: null });

  useEffect(() => {
    if (!squadId) return;

    const controller = new AbortController();
    // Loading state must reset when squadId changes; required by the 4-state contract
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView({ status: 'LOADING', data: null, error: null });

    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((data) => {
        setView({ status: 'SUCCESS', data, error: null });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: err.message });
      });

    return () => controller.abort();
  }, [squadId]);

  if (view.status === 'IDLE') {
    return <p>Select a squad</p>;
  }

  if (view.status === 'LOADING') {
    return <section aria-busy="true">Syncing KRAFTON Radar...</section>;
  }

  if (view.status === 'ERROR') {
    return (
      <section>
        <p>Blue-Zone Link Lost: {view.error}</p>
      </section>
    );
  }

  const squad = view.data;

  return (
    <article aria-live="polite">
      <h3>{squad.name}</h3>
      <dl>
        <dt>Map</dt>
        <dd>{squad.map}</dd>
        <dt>Zone phase</dt>
        <dd>{squad.phase}</dd>
        <dt>Alive</dt>
        <dd>{squad.alive}</dd>
        <dt>Kills</dt>
        <dd>{squad.kills}</dd>
        <dt>Status</dt>
        <dd>{squad.status}</dd>
      </dl>
    </article>
  );
}
