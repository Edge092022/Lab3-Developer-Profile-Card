import { Fragment, useState } from 'react';
import { SkillBadge } from './SkillBadge.jsx';
import styles from './DeveloperCard.module.css';

function getInitials(name) {
  const trimmedName = name.trim();

  const initials = trimmedName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return initials || '?';
}

export function DeveloperCard({
  fullName = 'Mori Calliope',
  role = "hololive English -Myth- • Grim Reaper's First Apprentice",
  avatarUrl = '/calliope.jpg',
  metrics = {
    birthday: 'April 4',
    debut: 'September 12, 2020',
    height: '167 cm',
  },
  skills = [
    { id: 'sk-1', name: 'Rap', tier: 'Core' },
    { id: 'sk-2', name: 'Singing', tier: 'Core' },
    { id: 'sk-3', name: 'Music Production', tier: 'Advanced' },
  ],
}) {
  const [failedUrl, setFailedUrl] = useState('');

  const showFallback = !avatarUrl || failedUrl === avatarUrl;

  return (
    <article className={styles.card} aria-labelledby="dev-heading">
      <header className={styles.header}>
        {showFallback ? (
          <span className={styles.initials} aria-hidden="true">
            {getInitials(fullName)}
          </span>
        ) : (
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt={fullName}
            width={64}
            height={64}
            onError={() => setFailedUrl(avatarUrl)}
          />
        )}

        <hgroup className={styles.titles}>
          <h2 className={styles.heading} id="dev-heading">{fullName}</h2>
          <p className={styles.role}>{role}</p>
        </hgroup>
      </header>

      <dl className={styles.metrics}>
        {Object.entries(metrics).map(([key, value]) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <ul className={styles.skills} aria-label="Engineered Skills">
        {skills.map((skill) => (
          <li key={skill.id}>
            <SkillBadge name={skill.name} tier={skill.tier} />
          </li>
        ))}
      </ul>
    </article>
  );
}