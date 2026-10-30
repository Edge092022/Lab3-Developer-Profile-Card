import { Fragment, useState } from 'react'
import SkillBadge from './SkillBadge.jsx'
import styles from './DeveloperCard.module.css'

function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Senior Systems Architect • UIT S3T',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240',
  metrics = { commits: 512, vdomNodes: 0, a11yScore: 100 },
  skills = [{ id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' }],
}) {
  const [failedUrl, setFailedUrl] = useState(null)
  const initials =
    fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => Array.from(word)[0])
      .join('')
      .toUpperCase() || '?'
  const hasAvatar =
    typeof avatarUrl === 'string' &&
    avatarUrl.startsWith('https://') &&
    avatarUrl !== failedUrl

  return (
    <article className={styles.card} aria-labelledby="dev-heading">
      <header className={styles.header}>
        {hasAvatar ? (
          <img
            className={styles.avatar}
            src={avatarUrl}
            width="64"
            height="64"
            alt={`${fullName || 'Developer'} avatar`}
            onError={() => setFailedUrl(avatarUrl)}
          />
        ) : (
          <span className={styles.initials} aria-hidden="true">
            {initials}
          </span>
        )}
        <hgroup className={styles.identity}>
          <p className={styles.eyebrow}>Developer profile</p>
          <h2 className={styles.name} id="dev-heading">
            {fullName || 'Unnamed developer'}
          </h2>
          <p className={styles.role}>{role}</p>
        </hgroup>
      </header>

      <h3 className={styles.sectionTitle}>Field metrics</h3>
      <dl className={styles.metrics} aria-label="Developer metrics">
        {Object.entries(metrics).map(([key, value]) => (
          <Fragment key={key}>
            <dt className={styles.metricLabel}>{key}</dt>
            <dd className={styles.metricValue}>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <h3 className={styles.sectionTitle}>Engineered skills</h3>
      <ul className={styles.skills} aria-label="Engineered Skills">
        {skills.map((skill) => (
          <li className={styles.skillItem} key={skill.id}>
            <SkillBadge name={skill.name} tier={skill.tier} />
          </li>
        ))}
      </ul>
    </article>
  )
}

export default DeveloperCard
