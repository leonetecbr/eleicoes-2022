import * as React from 'react'
import {Alert, Box, Container, CssBaseline, Link, Tab} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {instanceOf} from 'prop-types'
import {Cookies, withCookies} from 'react-cookie'
import GitHubIcon from '@mui/icons-material/GitHub'
import SelectUF from './components/SelectUF'
import Result from './components/Result'

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
            refreshing: false,
        }

        this.handleChangeTurno = this.handleChangeTurno.bind(this)
        this.handleChangeCargo = this.handleChangeCargo.bind(this)
        this.handleClickChangeUF = this.handleClickChangeUF.bind(this)
    }

    componentDidMount() {
        this.intervalID = setInterval(() => {
            this.setState({refreshing: true})
            this.fetchData()
        }, 60000)
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    fetchData() {
        const {turno, cargo, uf} = this.state
        const code = (cargo === '3') ? (parseInt(turno) + 2).toString() : turno

        if (cargo === '3' && uf === 'br') return true

        const url = base_url + code + '/dados-simplificados/' + uf + '/' + uf + '-c000' + cargo + '-e000' + code + '-r.json'

        fetch(url)
            .then(res => res.json())
            .then(
                result => {
                    this.setState({
                        isLoaded: true,
                        data: result,
                    })

                    if (parseFloat(result.pst.replace(',', '.')) === 100){
                        clearInterval(this.intervalID)
                        this.intervalID = null
                    } else if (this.intervalID === null) this.componentDidMount()

                    setTimeout(() => {
                        if (this.state.refreshing) this.setState({refreshing: false})
                    }, 1000)
                }, () => this.setState({
                    isLoaded: true,
                    error: true,
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
        let {isLoaded, data, error, cargo, uf, turno, refreshing} = this.state

        if (cargo !== '3' || uf !== 'br') {
            if (!isLoaded) {
                this.fetchData()
            }

            if (error) {
                return <Alert severity="error">Não foi possível obter os resultados da eleição!</Alert>
            } else {
                if (!isLoaded) data.cand = (turno === '544') ? [1, 2, 3, 4, 5 ] : [1, 2]

                return <Result data={data} loading={!isLoaded} refreshing={refreshing}/>
            }
        }
    }

    render() {
        const {turno, cargo, uf, select, isLoaded} = this.state
        const Load = this.load()
        const setUf = uf => {
            this.props.cookies.set('uf', uf, { path: '/' })
            this.setState({isLoaded: false, select: false, uf})
        }
        const governadorText = 'Governador' + ((uf !== 'br') ? ' - ' + uf.toUpperCase() : '')

        return (
            <>
                <Container component="main">
                    <CssBaseline/>
                    <TabContext value={turno}>
                        <Box className="border-b border-gray-300">
                            <TabList onChange={this.handleChangeTurno} aria-label="Turnos da eleição">
                                <Tab label="1º Turno" value="544"/>
                                <Tab label="2º Turno" value="545"/>
                            </TabList>
                        </Box>
                        <TabPanel value="544" className="p-1">
                            <TabContext value={cargo}>
                                <Box className="border-b border-gray-300">
                                    <TabList onChange={this.handleChangeCargo} aria-label="Cargos da eleição">
                                        <Tab label="Presidente" value="1"/>
                                        <Tab label={governadorText} value="3" onClick={this.handleClickChangeUF}/>
                                    </TabList>
                                </Box>
                                <TabPanel value="1" className="p-0 pt-2">
                                    {Load}
                                </TabPanel>
                                <TabPanel value="3" className="p-0 pt-2">
                                    <SelectUF uf={uf} setUf={setUf} turno={1} show={select}/>
                                    {Load}
                                </TabPanel>
                            </TabContext>
                        </TabPanel>
                        <TabPanel value="545" className="p-1">
                            <TabContext value={cargo}>
                                <Box className="border-b border-gray-300">
                                    <TabList onChange={this.handleChangeCargo} aria-label="Cargos da eleição">
                                        <Tab label="Presidente" value="1"/>
                                        <Tab label={governadorText} value="3"/>
                                    </TabList>
                                </Box>
                                <TabPanel value="1" className="p-0 pt-2">
                                    {Load}
                                </TabPanel>
                                <TabPanel value="3" className="p-0 pt-2">
                                    <SelectUF uf={uf} setUf={setUf} turno={2} show={select}/>
                                    {Load}
                                </TabPanel>
                            </TabContext>
                        </TabPanel>
                    </TabContext>
                </Container>
                {
                    (isLoaded) ? (
                        <Box component="footer" className="text-center p-2">
                            <Link href="https://github.com/leonetecbr/eleicoes-2022" color="inherit">
                                <GitHubIcon/>
                            </Link>
                        </Box>
                    ) : null
                }
            </>
        )
    }
}

export default withCookies(App)
