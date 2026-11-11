import { useState } from 'react';
import CrateCard from './CrateCard.jsx';
import { CRATES } from '../data/crates.js';

function AirdropArena() {
  const [crates] = useState(CRATES);

  return (
    <main>
      <header>
        <p className="kicker" lang="zh-Hant"></p>
        <h1 className="title">KRAFTON PUBG VN Airdrop Arena</h1>
        <p className="sub" lang="ja">エアドロップ・アリーナ</p>
      </header>

      <ul className="grid">
        {crates.map((crate) => (
          <CrateCard key={crate.id} crate={crate} />
        ))}
      </ul>
    </main>
  );
}

export default AirdropArena;
