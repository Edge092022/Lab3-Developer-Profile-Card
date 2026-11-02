import { useId, useState } from 'react';
import { SMART_PEOPLE } from '../data/smartPeople.js';

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const [people] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq');
  const [sortOrder, setSortOrder] = useState('desc');

  const nameId = useId();
  const minIqId = useId();
  const sortId = useId();

  const search = query.trim().toLowerCase();

  const visible = people
    .filter((p) => p.name.toLowerCase().includes(search) && p.iq >= minIq)
    .toSorted((a, b) => {
      const diff = sortBy === 'iq' ? a.iq - b.iq : a.age - b.age;
      return sortOrder === 'asc' ? diff : -diff;
    });

  function handleMinIqChange(e) {
    const value = e.target.valueAsNumber;
    setMinIq(Number.isNaN(value) ? 0 : value);
  }

  return (
    <section aria-label="Pioneer Directory">
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={nameId}>Name</label>
        <input
          id={nameId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <label htmlFor={minIqId}>Min IQ</label>
        <input
          id={minIqId}
          type="number"
          value={minIq}
          onChange={handleMinIqChange}
        />

        <label htmlFor={sortId}>Sort by</label>
        <select
          id={sortId}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="iq">IQ</option>
          <option value="age">Age</option>
        </select>

        <button
          type="button"
          onClick={() =>
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          }
        >
          {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
        </button>
      </form>

      <ol>
        {visible.map((p) => (
          <li key={p.id}>
            {p.name} — IQ {p.iq}
          </li>
        ))}
      </ol>
    </section>
  );
}
