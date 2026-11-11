import { useCallback, useId, useState } from 'react';
import { useDrumKeyboard } from './hooks/useDrumKeyboard.js';
import { useTaikoAudio } from './hooks/useTaikoAudio.js';
import { PADS, PADS_BY_ID } from './data/pads.js';


function App() {
  const [lastPadId, setLastPadId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const playerNameId = useId();
  const { playPad } = useTaikoAudio();

  // useCallback để hàm giữ nguyên giữa các lần render,
  // effect trong hook không phải gỡ/gắn lại listener mỗi lần App render.
  // playPad ổn định (useCallback deps rỗng trong useTaikoAudio) nên listener cũng không bị gắn lại.
  const handleTriggerPad = useCallback(
    (padId) => {
      const pad = PADS_BY_ID.get(padId);
      if (pad === undefined) {
        return;
      }
      playPad(pad.kind);
      setLastPadId(padId);
    },
    [playPad],
  );

  useDrumKeyboard(PADS, handleTriggerPad);

  return (
    <main>
      <h1>Matsuri Drum Dojo</h1>

      <label htmlFor={playerNameId}>Tên người chơi</label>
      <input
        id={playerNameId}
        type="text"
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
        autoComplete="off"
      />

      <p>
        Pad vừa gõ: <output>{lastPadId ?? 'chưa có'}</output>
      </p>
    </main>
  );
}

export default App;
