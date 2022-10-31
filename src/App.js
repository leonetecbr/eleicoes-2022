import * as React from 'react'
import {Alert, Box, Container, CssBaseline, Link, Tab} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {instanceOf} from 'prop-types'
import {Cookies, withCookies} from 'react-cookie'
import GitHubIcon from '@mui/icons-material/GitHub'
import SelectUF from './components/SelectUF'
import Result from './components/Result'

const UFs = require('./json/UFs.json')
const base_url = 'https://fierce-meadow-73752.herokuapp.com/https://resultados.tse.jus.br/oficial/ele2022/'

class App extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            turno: '545',
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
        this.createInterval()
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    createInterval() {
        this.intervalID = setInterval(() => {
            this.setState({refreshing: true})
            this.fetchData()
        }, 60000)
    }

    fetchData() {
        const {turno, cargo, uf} = this.state
        const code = (cargo !== '1') ? (parseInt(turno) + 2).toString() : turno

        if (cargo !== '1' && uf === 'br') return true

        const url = base_url + code + '/dados-simplificados/' + uf + '/' + uf + '-c000' + cargo + '-e000' + code + '-r.json'

        fetch(url)
            .then(res => res.json())
            .then(
                result => {
                    this.setState({
                        isLoaded: true,
                        data: result,
                    })

                    if (parseFloat(result.pst.replace(',', '.')) === 100) {
                        clearInterval(this.intervalID)
                        this.intervalID = null
                    } else if (this.intervalID === null) this.createInterval()

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

        const {uf, select, cargo} = this.state
        const {cookies} = this.props

        // Se for mudado para o segundo turno
        if (newValue === '545') {
            // Se estiver no cargo de senador
            if (cargo === '5') {
                state.cargo = '1'
                state.uf = 'br'
            } else {
                // Verifica se a UF selecionada tem segundo turno, se não tiver, seta a UF para Brasil e mostra o select de UF
                for (let i = 0; i < UFs.length; i++) {
                    if (UFs[i].value === uf && !UFs[i].second) {
                        state.uf = 'br'
                        state.select = true
                        break
                    }
                }
            }
        }
        // Se for mudado para o primeiro turno, já houver uma UF salva nos cookies e o cargo não for o de presidente, seta a UF para o valor salvo e esconde o select
        else if (cookies.get('uf') && cargo !== '1') {
            state.uf = cookies.get('uf')
            if (select) state.select = false
        }

        this.setState(state)
    }

    handleChangeCargo(event, newValue) {
        let state = {
            isLoaded: false,
            cargo: newValue,
            error: false,
        }

        const {turno, select} = this.state

        if (select) state.select = false

        // Se o cargo foi alterado para presidente, a UF é definida para Brasil
        if (newValue === '1') state.uf = 'br'
        else{
            const {cookies} = this.props

            // Se já existir uma UF salva nos cookies
            if (cookies.get('uf')){
                // Se for o primeiro turno é setado a uf do cookie
                if (turno === '544') state.uf = cookies.get('uf')
                // Se for o segundo turno é setado a uf do cookie se ela tiver segundo turno
                else{
                    for (let i = 0; i < UFs.length; i++) {
                        if (UFs[i].value === cookies.get('uf') && UFs[i].second) {
                            state.uf = cookies.get('uf')
                            break
                        }
                    }
                }

                // Se a UF não tiver segundo turno, é setado a UF para Brasil e o select de UF é ativado
                if (state.uf === undefined){
                    state.uf = 'br'
                    state.select = true
                }
            }
            // Se não existir uma UF salva nos cookies, o select de UF é ativado
            else state.select = true
        }

        this.setState(state)
    }

    handleClickChangeUF(event){
        const {cargo, select} = this.state
        const newValue = event.target.id.slice(-1)

        if (newValue === cargo) this.setState({select: !select,})
    }

    load() {
        let {isLoaded, data, error, cargo, uf, turno, refreshing} = this.state

        if (cargo === '1' || uf !== 'br') {
            if (!isLoaded) this.fetchData()

            if (error) return <Alert severity="error">Não foi possível obter os resultados da eleição!</Alert>
            else {
                if (!isLoaded) data.cand = (turno === '544') ? [1, 2, 3, 4, 5] : [1, 2]

                return <Result data={data} loading={!isLoaded} refreshing={refreshing}/>
            }
        }
    }

    render() {
        const {turno, cargo, uf, select, isLoaded} = this.state
        const Load = this.load()
        const setUf = uf => {
            if (uf !== 'br') this.props.cookies.set('uf', uf, {path: '/'})
            this.setState({isLoaded: false, select: false, uf})
        }

        const presidenteText = 'Presidente' + ((uf !== 'br' && cargo === '1') ? ' - ' + uf.toUpperCase() : '')
        const governadorText = 'Governador' + ((uf !== 'br' && cargo === '3') ? ' - ' + uf.toUpperCase() : '')
        const senadorText = 'Senador' + ((uf !== 'br' && cargo === '5') ? ' - ' + uf.toUpperCase() : '')

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
                                        <Tab label={presidenteText} value="1" onClick={this.handleClickChangeUF}/>
                                        <Tab label={governadorText} value="3" onClick={this.handleClickChangeUF}/>
                                        <Tab label={senadorText} value="5" onClick={this.handleClickChangeUF}/>
                                    </TabList>
                                </Box>
                                <TabPanel value="1" className="p-0 pt-2">
                                    <SelectUF uf={uf} setUf={setUf} show={select}/>
                                    {Load}
                                </TabPanel>
                                <TabPanel value="3" className="p-0 pt-2">
                                    <SelectUF uf={uf} setUf={setUf} show={select}/>
                                    {Load}
                                </TabPanel>
                                <TabPanel value="5" className="p-0 pt-2">
                                    <SelectUF uf={uf} setUf={setUf} show={select}/>
                                    {Load}
                                </TabPanel>
                            </TabContext>
                        </TabPanel>
                        <TabPanel value="545" className="p-1">
                            <TabContext value={cargo}>
                                <Box className="border-b border-gray-300">
                                    <TabList onChange={this.handleChangeCargo} aria-label="Cargos da eleição">
                                        <Tab label={presidenteText} value="1" onClick={this.handleClickChangeUF}/>
                                        <Tab label={governadorText} value="3" onClick={this.handleClickChangeUF}/>
                                    </TabList>
                                </Box>
                                <TabPanel value="1" className="p-0 pt-2">
                                    <SelectUF uf={uf} setUf={setUf} show={select}/>
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
