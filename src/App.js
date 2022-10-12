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
    Tab,
    Typography,
    Alert,
    Skeleton,
} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import PercentIcon from '@mui/icons-material/Percent'
import PeopleIcon from '@mui/icons-material/People'
import NoAccountsIcon from '@mui/icons-material/NoAccounts'
import ErrorIcon from '@mui/icons-material/Error'
import SelectUF from './components/SelectUF'
import Result from './components/Result'
import { instanceOf } from 'prop-types'
import { withCookies, Cookies } from 'react-cookie'

const UFs = require('./json/UFs.json')
const base_url = 'https://resultados.tse.jus.br/oficial/ele2022/'

class App extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            turno: '544',
            cargo: '1',
            uf: 'br',
            isLoaded: false,
            error: false,
            data: [],
            select: false,
        }

        this.handleChangeTurno = this.handleChangeTurno.bind(this)
        this.handleChangeCargo = this.handleChangeCargo.bind(this)
        this.handleClickChangeUF = this.handleClickChangeUF.bind(this)
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
        else{
            const { cookies } = this.props
            if (cookies.get('uf') !== undefined) state.uf = cookies.get('uf')
            else state.select = true
        }

        this.setState(state)
    }

    handleClickChangeUF(){
        const {cargo, uf, select} = this.state

        if (cargo === '3' && uf !== 'br') {
            this.setState({
                select: !select,
            })
        }
    }

    load() {
        let {isLoaded, data, error, cargo, uf, turno} = this.state

        if (cargo !== '3' || uf !== 'br') {
            if (!isLoaded) {
                this.fetchData()
            }

            if (error) {
                return <Alert severity="error">Não foi possível obter os resultados da eleição!</Alert>
            } else {

                const Md = (isLoaded) ? (
                    () => {
                        if (data.md !== 'N' && data.cand[0].st === ''){
                            return (
                                <Alert severity="success" className="mb-4">
                                    Eleição matematicamente definida: {(data.md === 'S') ? 'Segundo turno' : 'Candidato eleito'}
                                </Alert>
                            )
                        }
                    }
                ) : null

                if (!isLoaded) data.cand = (turno === '544') ? [1, 2, 3, 4, 5 ] : [1, 2]

                return (
                    <Box>
                        {
                            (isLoaded) ? (
                                <>
                                    <Typography variant="h5">
                                        {data.pst}% das seções totalizadas
                                    </Typography>
                                    <LinearProgress variant="determinate" value={parseFloat(data.pst)} className="mt-2 mb-2"/>
                                </>
                            ) : (
                                <>
                                    <Skeleton width={300} height={32} />
                                    <Skeleton width="100%" height={10} />
                                </>
                            )
                        }

                        <Box className="flex justify-between flex-wrap mb-2">
                            {
                                (isLoaded) ? (
                                    <Typography variant="body1" color="text.secondary">
                                        Última atualização em {data.dg} {data.hg}
                                    </Typography>
                                ) : <Skeleton width={320} height={24} />
                            }
                        </Box>
                        <Box className="mb-3 columns-3xs mx-auto">
                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                    {
                                        (isLoaded) ? (
                                            <Avatar>
                                                <PeopleIcon/>
                                            </Avatar>
                                        ) : <Skeleton variant="circular" width={40} height={40}/>
                                    }
                                    </ListItemAvatar>
                                    {
                                        (isLoaded) ? (
                                            <ListItemText
                                                primary="Já foram contabilizados"
                                                secondary={parseInt(data.vv).toLocaleString('pt-br') + ' votos válidos'}
                                            />
                                        ) : (
                                            <Box className="flex flex-col">
                                                <Skeleton width={100} height={24}/>
                                                <Skeleton width={150} height={20}/>
                                            </Box>
                                        )
                                    }
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                    {
                                        (isLoaded) ? (
                                            <Avatar>
                                                <PercentIcon/>
                                            </Avatar>
                                        ) : <Skeleton variant="circular" width={40} height={40}/>
                                    }
                                    </ListItemAvatar>
                                    {
                                        (isLoaded) ? (
                                            <ListItemText
                                                primary="Cada 1%"
                                                secondary={'São ' + parseInt(data.vv / 100).toLocaleString('pt-br') + ' votos'}
                                            />
                                        ) : (
                                            <Box className="flex flex-col">
                                                <Skeleton width={100} height={24}/>
                                                <Skeleton width={150} height={20}/>
                                            </Box>
                                        )
                                    }
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                    {
                                        (isLoaded) ? (
                                            <Avatar>
                                                <NoAccountsIcon/>
                                            </Avatar>
                                        ) : <Skeleton variant="circular" width={40} height={40}/>
                                    }
                                    </ListItemAvatar>
                                    {
                                        (isLoaded) ? (
                                            <ListItemText
                                                primary="Os que faltaram"
                                                secondary={'Somam ' + parseInt(data.a).toLocaleString('pt-br') + ' pessoas'}
                                            />
                                        ) : (
                                            <Box className="flex flex-col">
                                                <Skeleton width={100} height={24}/>
                                                <Skeleton width={150} height={20}/>
                                            </Box>
                                        )
                                    }
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                    {
                                        (isLoaded) ? (
                                            <Avatar>
                                                <ErrorIcon/>
                                            </Avatar>
                                        ) : <Skeleton variant="circular" width={40} height={40}/>
                                    }
                                    </ListItemAvatar>
                                    {
                                        (isLoaded) ? (
                                            <ListItemText
                                                primary="Brancos e nulos"
                                                secondary={'Somam ' + (parseInt(data.tvn) + parseInt(data.vb)).toLocaleString('pt-br') + ' votos'}
                                            />
                                        ) : (
                                            <Box className="flex flex-col">
                                                <Skeleton width={100} height={24}/>
                                                <Skeleton width={150} height={20}/>
                                            </Box>
                                        )
                                    }

                                </ListItem>
                            </List>
                        </Box>
                        {
                            (isLoaded) ? <Md/> : ''
                        }
                        <Result cand={data.cand} loading={!isLoaded}/>
                    </Box>
                )
            }
        }
    }

    render() {
        const {turno, cargo, uf, select} = this.state
        const Load = this.load()
        const setUf = uf => {
            this.props.cookies.set('uf', uf, { path: '/' })
            this.setState({isLoaded: false, select: false, uf})
        }
        const governadorText = 'Governador' + ((uf !== 'br') ? ' - ' + uf.toUpperCase() : '')

        return (
            <Container component="main">
                <CssBaseline/>
                <TabContext value={turno}>
                    <Box className="border-b border-gray-300">
                        <TabList onChange={this.handleChangeTurno} aria-label="Turnos da eleição">
                            <Tab label="1º Turno" value="544"/>
                            <Tab label="2º Turno" value="545"/>
                        </TabList>
                    </Box>
                    <TabPanel value="544" sx={{padding: 1}}>
                        <TabContext value={cargo}>
                            <Box className="border-b border-gray-300">
                                <TabList onChange={this.handleChangeCargo} aria-label="Cargos da eleição">
                                    <Tab label="Presidente" value="1"/>
                                    <Tab label={governadorText} value="3" onClick={this.handleClickChangeUF}/>
                                </TabList>
                            </Box>
                            <TabPanel value="1" sx={{padding: 1}}>
                                {Load}
                            </TabPanel>
                            <TabPanel value="3" sx={{padding: 1}}>
                                <SelectUF uf={uf} setUf={setUf} turno={1} show={select}/>
                                {Load}
                            </TabPanel>
                        </TabContext>
                    </TabPanel>
                    <TabPanel value="545" sx={{padding: 1}}>
                        <TabContext value={cargo}>
                            <Box className="border-b border-gray-300">
                                <TabList onChange={this.handleChangeCargo} aria-label="Cargos da eleição">
                                    <Tab label="Presidente" value="1"/>
                                    <Tab label={governadorText} value="3"/>
                                </TabList>
                            </Box>
                            <TabPanel value="1" sx={{padding: 1}}>
                                {Load}
                            </TabPanel>
                            <TabPanel value="3" sx={{padding: 1}}>
                                <SelectUF uf={uf} setUf={setUf} turno={2} show={select}/>
                                {Load}
                            </TabPanel>
                        </TabContext>
                    </TabPanel>
                </TabContext>
            </Container>
        )
    }
}

export default withCookies(App)
