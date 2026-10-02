import { AppContext } from './AppContext';
import { useCallback, useState } from 'react';
import { POSITIONS, ROUNDS } from '../dictonarys';

function AppProvider({ children }) {
    const [uf, setUf] = useState('br');
    const [round, setRound] = useState(ROUNDS.FIRST);
    const [search, setSearch] = useState('');
    const [position, setPosition] = useState(POSITIONS.PRESIDENT);
    const ELECTORAL_CYCLE = import.meta.env.VITE_ELECTORAL_CYCLE || 'ele2026';
    const code = position !== POSITIONS.PRESIDENT ? (parseInt(round) + 2).toString() : round;

    const getBaseUrl = useCallback(
        () => `https://resultados.tse.jus.br/oficial/${ELECTORAL_CYCLE}/${code}`,
        [ELECTORAL_CYCLE, code]
    );

    return (
        <AppContext.Provider
            value={{
                uf,
                setUf,
                code,
                round,
                setRound,
                ROUNDS,
                position,
                setPosition,
                POSITIONS,
                search,
                setSearch,
                getBaseUrl,
                ELECTORAL_CYCLE,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;

export { AppProvider };
