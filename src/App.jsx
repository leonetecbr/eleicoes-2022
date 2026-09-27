import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Container, CssBaseline, Link, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import GitHubIcon from '@mui/icons-material/GitHub';
import SelectUF from './components/SelectUF';
import Result from './components/Result';
import UFs from './data/UFs.json';

const CICLO_ELEITORAL = import.meta.env.VITE_CICLO_ELEITORAL || 'ele2022';
const base_url = `https://resultados.tse.jus.br/oficial/${CICLO_ELEITORAL}/`;

const TURNO = {
    PRIMEIRO: '544',
    SEGUNDO: '545',
};

const POSITION = {
    PRESIDENT: '1',
    GOVERNOR: '3',
    SENATOR: '5',
};

function App() {
    const [turno, setTurno] = useState(TURNO.SEGUNDO);
    const [cargo, setCargo] = useState(POSITION.PRESIDENT);
    const [uf, setUf] = useState('br');
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const intervalID = useRef(null);
    const refreshingTimeoutID = useRef(null);
    const abortControllerRef = useRef(null);

    const createInterval = useCallback(() => {
        // TODO: Hoje desnecessário porque não há atualizações
        // intervalID.current = setInterval(() => {
        //     setRefreshing(true)
        //     fetchData()
        // }, 60000)
    }, []);

    const fetchData = useCallback(() => {
        const code = cargo !== POSITION.PRESIDENT ? (parseInt(turno) + 2).toString() : turno;

        if (cargo !== POSITION.PRESIDENT && uf === 'br') return true;

        const url =
            base_url +
            code +
            '/dados-simplificados/' +
            uf +
            '/' +
            uf +
            '-c000' +
            cargo +
            '-e000' +
            code +
            '-r.json';

        if (abortControllerRef.current) abortControllerRef.current.abort();

        const controller = new AbortController();

        abortControllerRef.current = controller;

        fetch(url, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`Erro ${res.status} ao buscar ${url}`);
                return res.json();
            })
            .then(
                result => {
                    setIsLoaded(true);
                    setError(false);
                    setData(result);

                    if (parseFloat(result.pst.replace(',', '.')) === 100) {
                        if (intervalID.current) {
                            clearInterval(intervalID.current);
                            intervalID.current = null;
                        }
                    } else if (intervalID.current === null) createInterval();

                    if (refreshingTimeoutID.current) clearTimeout(refreshingTimeoutID.current);
                    refreshingTimeoutID.current = setTimeout(() => {
                        setRefreshing(prevRefreshing => (prevRefreshing ? false : prevRefreshing));
                    }, 1000);
                },
                err => {
                    // Requisição cancelada por uma mais nova: não é um erro real, ignora
                    if (err.name === 'AbortError') return;

                    setIsLoaded(true);
                    setError(true);
                }
            );
    }, [turno, cargo, uf, createInterval]);

    // Dispara a busca de dados quando os critérios relevantes mudam, em vez de
    // fazer isso como efeito colateral dentro do render (via load())
    useEffect(() => {
        if (cargo === POSITION.PRESIDENT || uf !== 'br') {
            if (!isLoaded) fetchData();
        }
    }, [cargo, uf, isLoaded, fetchData]);

    // Equivalente a componentDidMount / componentWillUnmount
    useEffect(() => {
        createInterval();

        return () => {
            if (intervalID.current) clearInterval(intervalID.current);
            if (refreshingTimeoutID.current) clearTimeout(refreshingTimeoutID.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [createInterval]);

    function handleChangeTurno(event, newValue) {
        setIsLoaded(false);
        setTurno(newValue);
        setError(false);

        // Se for mudado para o segundo turno
        if (newValue === TURNO.SEGUNDO) {
            // Se estiver no cargo de senador
            if (cargo === POSITION.SENATOR) {
                setCargo(POSITION.PRESIDENT);
                setUf('br');
            } else {
                // Verifica se a UF selecionada tem segundo turno, se não tiver, seta a UF para Brasil e mostra o select de UF
                for (let i = 0; i < UFs.length; i++) {
                    if (UFs[i].value === uf && !UFs[i].second) {
                        setUf('br');
                        setSelect(true);
                        break;
                    }
                }
            }
        }
        // Se for mudado para o primeiro turno, já houver uma UF salva no local storage e o cargo não for o de presidente, seta a UF para o valor salvo e esconde o select
        else if (localStorage.getItem('uf') && cargo !== POSITION.PRESIDENT) {
            setUf(localStorage.getItem('uf'));
            if (select) setSelect(false);
        }
    }

    function handleChangeCargo(event, newValue) {
        setIsLoaded(false);
        setCargo(newValue);
        setError(false);

        if (select) setSelect(false);

        // Se o cargo foi alterado para presidente, a UF é definida para Brasil
        if (newValue === POSITION.PRESIDENT) setUf('br');
        else {
            let newUf;

            // Se já existir uma UF salva no local storage
            if (localStorage.getItem('uf')) {
                // Se for o primeiro turno é setado a uf do local storage
                if (turno === TURNO.PRIMEIRO) newUf = localStorage.getItem('uf');
                // Se for o segundo turno é setado a uf do local storage se ela tiver segundo turno
                else {
                    for (let i = 0; i < UFs.length; i++) {
                        if (UFs[i].value === localStorage.getItem('uf') && UFs[i].second) {
                            newUf = localStorage.getItem('uf');
                            break;
                        }
                    }
                }

                // Se a UF não tiver segundo turno, é setado a UF para Brasil e o select de UF é ativado
                if (newUf === undefined) {
                    newUf = 'br';
                    setSelect(true);
                }
            }
            // Se não existir uma UF salva no local storage, o select de UF é ativado
            else setSelect(true);

            if (newUf !== undefined) setUf(newUf);
        }
    }

    // Mantido exatamente como estava (funcionando em produção) - não alterado
    function handleClickChangeUF(event) {
        const newValue = event.target.id.slice(-1);

        if (newValue === cargo) setSelect(prevSelect => !prevSelect);
    }

    function load() {
        if (cargo === POSITION.PRESIDENT || uf !== 'br') {
            if (error) {
                return (
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={fetchData}>
                                Tentar novamente
                            </Button>
                        }
                    >
                        Não foi possível obter os resultados da eleição!
                    </Alert>
                );
            }

            // enquanto os dados reais não chegam, monta um objeto auxiliar só para exibição
            const resultData = !isLoaded
                ? { ...data, cand: turno === TURNO.PRIMEIRO ? [1, 2, 3, 4, 5] : [1, 2] }
                : data;

            return <Result data={resultData} loading={!isLoaded} refreshing={refreshing} />;
        }
    }

    const Load = load();

    const changeUf = newUf => {
        if (newUf !== 'br') localStorage.setItem('uf', newUf);
        setIsLoaded(false);
        setSelect(false);
        setUf(newUf);
    };

    const presidenteText =
        'Presidente' + (uf !== 'br' && cargo === POSITION.PRESIDENT ? ' - ' + uf.toUpperCase() : '');
    const governadorText =
        'Governador' + (uf !== 'br' && cargo === POSITION.GOVERNOR ? ' - ' + uf.toUpperCase() : '');
    const senadorText = 'Senador' + (uf !== 'br' && cargo === POSITION.SENATOR ? ' - ' + uf.toUpperCase() : '');

    return (
        <>
            <Container component="main">
                <CssBaseline />
                <TabContext value={turno}>
                    <Box className="border-b border-gray-300">
                        <TabList onChange={handleChangeTurno} aria-label="Turnos da eleição">
                            <Tab label="1º Turno" value={TURNO.PRIMEIRO} />
                            <Tab label="2º Turno" value={TURNO.SEGUNDO} />
                        </TabList>
                    </Box>
                    <TabPanel value={TURNO.PRIMEIRO} className="p-1">
                        <TabContext value={cargo}>
                            <Box className="border-b border-gray-300">
                                <TabList onChange={handleChangeCargo} aria-label="Cargos da eleição">
                                    <Tab
                                        label={presidenteText}
                                        value={POSITION.PRESIDENT}
                                        onClick={handleClickChangeUF}
                                    />
                                    <Tab
                                        label={governadorText}
                                        value={POSITION.GOVERNOR}
                                        onClick={handleClickChangeUF}
                                    />
                                    <Tab label={senadorText} value={POSITION.SENATOR} onClick={handleClickChangeUF} />
                                </TabList>
                            </Box>
                            <TabPanel value={POSITION.PRESIDENT} className="p-0 pt-2">
                                <SelectUF uf={uf} setUf={changeUf} show={select} />
                                {Load}
                            </TabPanel>
                            <TabPanel value={POSITION.GOVERNOR} className="p-0 pt-2">
                                <SelectUF uf={uf} setUf={changeUf} show={select} />
                                {Load}
                            </TabPanel>
                            <TabPanel value={POSITION.SENATOR} className="p-0 pt-2">
                                <SelectUF uf={uf} setUf={changeUf} show={select} />
                                {Load}
                            </TabPanel>
                        </TabContext>
                    </TabPanel>
                    <TabPanel value={TURNO.SEGUNDO} className="p-1">
                        <TabContext value={cargo}>
                            <Box className="border-b border-gray-300">
                                <TabList onChange={handleChangeCargo} aria-label="Cargos da eleição">
                                    <Tab
                                        label={presidenteText}
                                        value={POSITION.PRESIDENT}
                                        onClick={handleClickChangeUF}
                                    />
                                    <Tab
                                        label={governadorText}
                                        value={POSITION.GOVERNOR}
                                        onClick={handleClickChangeUF}
                                    />
                                </TabList>
                            </Box>
                            <TabPanel value={POSITION.PRESIDENT} className="p-0 pt-2">
                                <SelectUF uf={uf} setUf={changeUf} show={select} />
                                {Load}
                            </TabPanel>
                            <TabPanel value={POSITION.GOVERNOR} className="p-0 pt-2">
                                <SelectUF uf={uf} setUf={changeUf} turno={2} show={select} />
                                {Load}
                            </TabPanel>
                        </TabContext>
                    </TabPanel>
                </TabContext>
            </Container>
            {
                isLoaded && (
                    <Box component="footer" className="p-2 text-center">
                        <Link href="https://github.com/leonetecbr/eleicoes-2022" color="inherit">
                            <GitHubIcon />
                        </Link>
                    </Box>
                )
            }
        </>
    );
}

export default App;
