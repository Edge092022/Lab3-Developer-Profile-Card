import { useState } from 'react';
import CrateCard from './CrateCard.jsx';
import { CRATES } from '../data/crates.js';

function AirdropArena() {
  const [crates, setCrates] = useState(CRATES);

  // delta = -1 khi claim (optimistic), +1 khi rollback 409.
  function changeCrateStock(crateId, delta) {
    setCrates((previousCrates) =>
      previousCrates.map((crate) =>
        crate.id === crateId ? { ...crate, stock: crate.stock + delta } : crate,
      ),
    );
  }

  return (
    <main>
      <header>
        <p className="kicker" lang="zh-Hant"></p>
        <h1 className="title">KRAFTON PUBG VN Airdrop Arena</h1>
        <p className="sub" lang="ja">エアドロップ・アリーナ</p>
      </header>

      <ul className="grid">
        {crates.map((crate) => (
          <CrateCard
            key={crate.id}
            crate={crate}
            onStockChange={changeCrateStock}
          />
        ))}
      </ul>
    </main>
  );
}

export default AirdropArena;
