import styles from '../styles/components/CompletedChallenges.module.css';

export function CompletedChallenges() {
    return(
        <div className={styles.completedChallengesContainer}>
            <strong>Desafios completos</strong>
            <span>5</span>
        </div>
    );
}