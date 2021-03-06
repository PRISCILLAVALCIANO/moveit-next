import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';

export function Profile() {
    const { level } = useContext(ChallengesContext);

    return (
        <div className={styles.profileContaner}>
            <img src="https://avatars.githubusercontent.com/u/32992440?s=400&u=916ed84399e80d304474e1712ea3565c08bf17e7&v=4" alt="Priscilla S. Valciano"/>
            <div>
                <strong>Priscilla S. Valciano</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
            </div>
        </div>
    );
} 