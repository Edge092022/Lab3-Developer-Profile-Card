import { useId, useRef, useState } from 'react';
import { SMART_PEOPLE } from '../data/smartPeople.js';
import styles from './ScientistDirectory.module.css';

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const nameId = useId();
  const minIqId = useId();
  const sortId = useId();
  const deleteModeRef = useRef(null);

  const search = query.trim().toLowerCase();

  const visible = people
    .filter((p) => p.name.toLowerCase().includes(search) && p.iq >= minIq)
    .toSorted((a, b) => {
      const diff = sortBy === 'iq' ? a.iq - b.iq : a.age - b.age;
      return sortOrder === 'asc' ? diff : -diff;
    });

  const deleted = SMART_PEOPLE.filter((p) => !people.some((x) => x.id === p.id));

  function handleMinIqChange(e) {
    const value = e.target.valueAsNumber;
    setMinIq(Number.isNaN(value) ? 0 : value);
  }

  function handleDelete(id) {
    setPeople((prev) => prev.filter((x) => x.id !== id));
    deleteModeRef.current.focus();
  }

  function handleRestoreOne(person) {
    setPeople((prev) => [...prev, person]);
    deleteModeRef.current.focus();
  }

  function handleRestore() {
    setPeople(SMART_PEOPLE);
    deleteModeRef.current.focus();
  }

  return (
    <section className={styles.directory} aria-label="Pioneer Directory">
      <form
        className={styles.form}
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <p className={styles.field}>
          <label htmlFor={nameId}>Name</label>
          <input
            className={styles.control}
            id={nameId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </p>

        <p className={styles.field}>
          <label htmlFor={minIqId}>Min IQ</label>
          <input
            className={styles.control}
            id={minIqId}
            type="number"
            value={minIq}
            onChange={handleMinIqChange}
          />
        </p>

        <p className={styles.field}>
          <label htmlFor={sortId}>Sort by</label>
          <select
            className={styles.control}
            id={sortId}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="iq">IQ</option>
            <option value="age">Age</option>
          </select>
        </p>

        <button
          className={styles.button}
          type="button"
          onClick={() =>
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          }
        >
          {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
        </button>
      </form>

      <p className={styles.toolbar}>
        <output className={styles.count} role="status" aria-live="polite">
          Found {visible.length} pioneers
        </output>

        <button
          className={styles.button}
          type="button"
          ref={deleteModeRef}
          aria-pressed={isDeleteMode}
          onClick={() => setIsDeleteMode((prev) => !prev)}
        >
          Delete mode
        </button>

        {deleted.length > 0 && (
          <button
            className={styles.button}
            type="button"
            onClick={handleRestore}
          >
            Restore all
          </button>
        )}
      </p>

      <ol className={styles.list}>
        {visible.map((p) => (
          <li className={styles.item} key={p.id}>
            {p.name} — IQ {p.iq}
            {isDeleteMode && (
              <button
                className={styles.button}
                type="button"
                aria-label={`Delete ${p.name}`}
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ol>

      {deleted.length > 0 && (
        <section className={styles.deleted} aria-label="Deleted pioneers">
          <h2 className={styles.deletedTitle}>Deleted</h2>
          <ul className={styles.list}>
            {deleted.map((p) => (
              <li className={styles.item} key={p.id}>
                {p.name}
                <button
                  className={styles.button}
                  type="button"
                  aria-label={`Restore ${p.name}`}
                  onClick={() => handleRestoreOne(p)}
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
