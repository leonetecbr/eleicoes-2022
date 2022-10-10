import * as React from 'react'
import {
    Avatar,
    Box,
    Container,
    CssBaseline,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Tab,
    Typography,
    Alert
} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import PercentIcon from '@mui/icons-material/Percent'
import PeopleIcon from '@mui/icons-material/People'
import NoAccountsIcon from '@mui/icons-material/NoAccounts'
import ErrorIcon from '@mui/icons-material/Error'
import SelectUF from './components/SelectUF'
import Result from './components/Result'
const UFs = require('./json/UFs.json')

const base_url = 'https://resultados.tse.jus.br/oficial/ele2022/'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            turno: '544',
            cargo: '1',
            uf: UFs[0].value,
            isLoaded: false,
            error: false,
            data: [],
        }

        this.handleChangeTurno = this.handleChangeTurno.bind(this)
        this.handleChangeCargo = this.handleChangeCargo.bind(this)
    }

    fetchData() {
        const {turno, cargo, uf} = this.state
        const code = (cargo === '3') ? (parseInt(turno) + 2).toString() : turno

        if (cargo === '3' && uf === 'br') return true

        const url = base_url + code + '/dados-simplificados/' + uf + '/' + uf + '-c000' + cargo + '-e000' + code + '-r.json'

        fetch(url)
            .then(res => res.json())
            .then(
                result => this.setState({
                    isLoaded: true,
                    data: result,
                }), () => this.setState({
                    isLoaded: true,
                    error: true
                })
            )
    }

    handleChangeTurno(event, newValue) {
        let state = {
            isLoaded: false,
            turno: newValue,
            error: false,
        }

        const uf = this.state.uf

        if (newValue === '546') {
            for (let i = 0; i < UFs.length; i++) {
                if (UFs[i].value === uf && !UFs[i].second) {
                    state.uf = UFs[0].value
                    break
                }
            }
        }

        this.setState(state)
    }

    handleChangeCargo(event, newValue) {
        let state = {
            isLoaded: false,
            cargo: newValue,
            error: false,
        }

        if (newValue === '1') state.uf = 'br'

        this.setState(state)
    }

    load() {
        let {isLoaded, data, error, cargo, uf} = this.state

        if (cargo !== '3' || uf !== 'br') {
            if (!isLoaded) {
                console.log(data, error, cargo, uf)
                this.fetchData()

                return (
                    <Box className="mb-3">
                        <Box className="flex justify-between">
                            <Box className="flex">
                                <Skeleton variant="circular" width={40} height={40}/>
                                <Skeleton variant="text" className="ml-3" width={100}/>
                            </Box>
                            <Skeleton variant="text" width={70}/>
                        </Box>
                        <Skeleton variant="text" width={200}/>
                    </Box>
                )
            } else if (error) {
                return <Alert severity="warning">Esse resultado ainda não está disponível!</Alert>
            } else {
                return (
                    <Box>
                        <Typography variant="h5">
                            {data.pst}% das seções totalizadas
                        </Typography>
                        <LinearProgress variant="determinate" value={parseFloat(data.pst)} className="mt-2 mb-2"/>
                        <Box className="flex justify-between flex-wrap mb-2">
                            <Typography variant="body1" color="text.secondary">
                                Última atualização em {data.dt} {data.ht}
                            </Typography>
                        </Box>
                        <Box className="mb-3 columns-3xs mx-auto">
                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PeopleIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Já foram contabilizados"
                                        secondary={parseInt(data.vv).toLocaleString('pt-br') + ' votos válidos'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PercentIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Cada 1%"
                                        secondary={'São ' + parseInt(data.vv / 100).toLocaleString('pt-br') + ' votos'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <NoAccountsIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Os que faltaram"
                                        secondary={'Somam ' + parseInt(data.a).toLocaleString('pt-br') + ' pessoas'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ErrorIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Brancos e nulos"
                                        secondary={'Somam ' + (parseInt(data.tvn) + parseInt(data.vb)).toLocaleString('pt-br') + ' votos'}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                        <Result candidates={data.cand}/>
                    </Box>
                )
            }
        }
    }

    render() {
        const {turno, cargo, uf} = this.state
        const Load = this.load()
        const setUf = uf => this.setState({isLoaded: false, uf})

        return (
            <Container component="main">
                <CssBaseline/>
                <TabContext value={turno}>
                    <Box className="border-b border-gray-300">
                        <TabList onChange={this.handleChangeTurno} aria-label="Turnos da eleição">
                            <Tab label="1º Turno" value="544"/>
                            <Tab label="2º Turno" value="546"/>
                        </TabList>
                    </Box>
                    <TabPanel value="544" sx={{padding: 1}}>
                        <TabContext value={cargo}>
                            <Box className="border-b border-gray-300">
                                <TabList onChange={this.handleChangeCargo} aria-label="Turnos da eleição">
                                    <Tab label="Presidente" value="1"/>
                                    <Tab label={'Governador' + ((uf !== 'br') ? ' - ' + uf.toUpperCase() : '')} value="3"/>
                                </TabList>
                            </Box>
                            <TabPanel value="1" sx={{padding: 1}}>
                                {Load}
                            </TabPanel>
                            <TabPanel value="3" sx={{padding: 1}}>
                                <Box className="text-center mt-2 mb-1">
                                    <SelectUF uf={uf} setUf={setUf} turno={1}/>
                                </Box>
                                {Load}
                            </TabPanel>
                        </TabContext>
                    </TabPanel>
                    <TabPanel value="546" sx={{padding: 1}}>
                        <TabContext value={cargo}>
                            <Box className="border-b border-gray-300">
                                <TabList onChange={this.handleChangeCargo} aria-label="Turnos da eleição">
                                    <Tab label="Presidente" value="1"/>
                                    <Tab label="Governador" value="3"/>
                                </TabList>
                            </Box>
                            <TabPanel value="1" sx={{padding: 1}}>
                                {Load}
                            </TabPanel>
                            <TabPanel value="3" sx={{padding: 1}}>
                                <Box className="text-center mt-2 mb-1">
                                    <SelectUF uf={uf} setUf={setUf} turno={2}/>
                                </Box>
                                {Load}
                            </TabPanel>
                        </TabContext>
                    </TabPanel>
                </TabContext>
            </Container>
        )
    }
}

export default App
