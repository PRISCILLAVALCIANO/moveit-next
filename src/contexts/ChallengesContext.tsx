import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';


//tipagem
interface Challenge {
    type: 'body' | 'eye'; //Esse campo é uma string mas como só tem dois tipos vai ser passado o nome deles
    description: string;
    amount: number;
}

//tipagem
interface ChallengesContextData {
    level: number;
    currentExperience: number;
    experienceToNextLevel: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completedChallenge: () => void;
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}



export const ChallengesContext = createContext({} as ChallengesContextData); 

export function ChallengesProvider({children, ...rest} : ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelModalOpen] = useState(false);

    //Calculo usando potência, pega o level e soma-se com + 1 para subir de nível e multipla pelo fator de experiencia (4)para deixar mais dificl ou mais fácil, usando calculo na potência 2
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    function levelUp(){
        setLevel(level + 1);
        setIsLevelModalOpen(true);
    }

     function closeLevelUpModal() {
        setIsLevelModalOpen(false);
     }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex]; 

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if(Notification.permission === 'granted') {
            new Notification('Novo desafio 🎉', {
                body: `Valendo ${challenge.amount}xp!`
            });
        }  
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completedChallenge(){
        if(!activeChallenge){
            return;
        }
        const { amount } = activeChallenge;
        
        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider 
        value={{
            level, 
            currentExperience,
            experienceToNextLevel,
            challengesCompleted, 
            levelUp,
            startNewChallenge,
            activeChallenge,
            resetChallenge,
            completedChallenge,
            closeLevelUpModal,
            
        }}>
            {children }
        { isLevelUpModalOpen && <LevelUpModal />}    
        </ChallengesContext.Provider>
    )
}