import styles from './DeveloperCard.module.css';

function SkillBadge({ name, tier }) {
  return (
    <span className={styles.badge}>
      {name} ({tier})
    </span>
  );
}

export { SkillBadge };