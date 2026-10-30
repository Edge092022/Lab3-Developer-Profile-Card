import styles from './DeveloperCard.module.css'

function SkillBadge({ name, tier }) {
  return <span className={styles.skillBadge}>{name} ({tier})</span>
}

export default SkillBadge
