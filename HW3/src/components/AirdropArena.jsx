import { useState } from 'react';
import CrateCard from './CrateCard.jsx';
import PvsLeaderboard from './PvsLeaderboard.jsx';
import { CRATES } from '../data/crates.js';
import styles from './AirdropArena.module.css';

function AirdropArena() {
  const [crates, setCrates] = useState(CRATES);
  // id tăng mỗi lần có thông báo mới, để trình đọc màn hình đọc lại cả khi nội dung trùng lần trước.
  const [announcement, setAnnouncement] = useState({ id: 0, text: '' });

  // delta = -1 khi claim (optimistic), +1 khi rollback 409.
  function changeCrateStock(crateId, delta) {
    setCrates((previousCrates) =>
      previousCrates.map((crate) =>
        crate.id === crateId ? { ...crate, stock: crate.stock + delta } : crate,
      ),
    );
  }

  // Chỉ được gọi khi phase đổi hoặc có kết quả claim; đồng hồ không gọi hàm này.
  function announce(text) {
    setAnnouncement((previousAnnouncement) => ({
      id: previousAnnouncement.id + 1,
      text,
    }));
  }

  return (
    <main className={styles.arena}>
      <header className={styles.header}>
        <p className={styles.kicker} lang="zh-Hant"></p>
        <h1 className={styles.title}>KRAFTON PUBG VN Airdrop Arena</h1>
        <p className={styles.sub} lang="ja">エアドロップ・アリーナ</p>
      </header>

      <output role="status" aria-live="polite" className={styles.status}>
        <span key={announcement.id}>{announcement.text}</span>
      </output>

      <ul className={styles.grid}>
        {crates.map((crate) => (
          <CrateCard
            key={crate.id}
            crate={crate}
            onStockChange={changeCrateStock}
            onAnnounce={announce}
          />
        ))}
      </ul>

      <PvsLeaderboard />
    </main>
  );
}

export default AirdropArena;
