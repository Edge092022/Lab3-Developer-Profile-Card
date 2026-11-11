import { useId, useState } from 'react';
import { STANDINGS } from '../data/standings.js';
import styles from './PvsLeaderboard.module.css';

const SORT_OPTIONS = [
  { value: 'total', label: 'Tổng điểm' },
  { value: 'wwcd', label: 'WWCD' },
  { value: 'placement', label: 'Placement' },
  { value: 'kill', label: 'Kill' },
];

// Lấy giá trị dùng để sắp xếp theo tiêu chí đang chọn.
function getSortValue(team, sortBy) {
  if (sortBy === 'wwcd') {
    return team.wwcd;
  }
  if (sortBy === 'placement') {
    return team.placementPts;
  }
  if (sortBy === 'kill') {
    return team.killPts;
  }
  return team.totalPts;
}

// Giảm dần theo tiêu chí chính; bằng điểm thì Kill giảm dần; vẫn bằng thì theo tên A-Z.
function compareTeams(teamA, teamB, sortBy) {
  const byCriterion = getSortValue(teamB, sortBy) - getSortValue(teamA, sortBy);
  if (byCriterion !== 0) {
    return byCriterion;
  }
  const byKill = teamB.killPts - teamA.killPts;
  if (byKill !== 0) {
    return byKill;
  }
  return teamA.name.localeCompare(teamB.name, 'vi');
}

function PvsLeaderboard() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('total');

  const headingId = useId();
  const searchInputId = useId();
  const sortSelectId = useId();
  const captionId = useId();

  // Derived trong render: tổng điểm, thứ hạng, kết quả lọc. Không state, không useEffect.
  const rankedTeams = STANDINGS.map((team) => ({
    ...team,
    totalPts: team.placementPts + team.killPts,
  }))
    .toSorted((teamA, teamB) => compareTeams(teamA, teamB, sortBy))
    .map((team, index) => ({ ...team, rank: index + 1 }));

  const normalizedQuery = query.trim().toLowerCase();
  const visibleTeams = rankedTeams.filter((team) =>
    team.name.toLowerCase().includes(normalizedQuery),
  );

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section className={styles.leaderboard} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.leaderboardTitle}>
        PVS Leaderboard
      </h2>

      <form
        role="search"
        className={styles.leaderboardControls}
        onSubmit={handleSubmit}
      >
        <div className={styles.field}>
          <label htmlFor={searchInputId} className={styles.label}>
            Tìm đội
          </label>
          <input
            id={searchInputId}
            type="search"
            className={styles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={sortSelectId} className={styles.label}>
            Sắp xếp theo
          </label>
          <select
            id={sortSelectId}
            className={styles.select}
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </form>

      <output
        role="status"
        aria-live="polite"
        className={styles.leaderboardCount}
      >
        Tìm thấy {visibleTeams.length} / {rankedTeams.length} đội
      </output>

      {/* Vùng cuộn ngang: tabIndex để người dùng bàn phím cuộn được khi bảng rộng hơn màn hình. */}
      <div
        className={styles.tableWrap}
        role="region"
        aria-labelledby={captionId}
        tabIndex={0}
      >
        <table className={styles.leaderboardTable}>
          <caption id={captionId}>Bảng xếp hạng PUBG VN Series (PVS)</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Đội</th>
              <th scope="col">WWCD</th>
              <th scope="col">Placement</th>
              <th scope="col">Kill</th>
              <th scope="col">Tổng điểm</th>
            </tr>
          </thead>
          <tbody>
            {visibleTeams.map((team) => (
              <tr key={team.id}>
                <td>{team.rank}</td>
                <td>{team.name}</td>
                <td>{team.wwcd}</td>
                <td>{team.placementPts}</td>
                <td>{team.killPts}</td>
                <td>{team.totalPts}</td>
              </tr>
            ))}
            {visibleTeams.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  Không có đội nào khớp với “{query.trim()}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PvsLeaderboard;
