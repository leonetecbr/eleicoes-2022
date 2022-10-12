import * as React from 'react'
import {
    Alert,
    Avatar,
    Box,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Typography,
    CircularProgress
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import PercentIcon from '@mui/icons-material/Percent'
import NoAccountsIcon from '@mui/icons-material/NoAccounts'
import ErrorIcon from '@mui/icons-material/Error'
import ResultCandidate from './ResultCandidate'

export function Result(props){
    const {data, loading, refreshing} = props

    const Md = (loading) ? null : (
        () => {
            if (data.md !== 'N' && data.cand[0].st === ''){
                return (
                    <Alert severity="success" className="mb-4">
                        Eleição matematicamente definida: {(data.md === 'S') ? 'Segundo turno' : 'Candidato eleito'}
                    </Alert>
                )
            }
        }
    )

    return (
        <Box>
            {
                (loading) ? (
                    <>
                        <Skeleton width={300} height={32} />
                        <Skeleton width="100%" height={10} />
                    </>
                ) : (
                    <>
                        <Typography variant="h5">
                            {data.pst}% das seções totalizadas
                        </Typography>
                        <LinearProgress variant="determinate" value={parseFloat(data.pst)} className="mt-2 mb-2"/>
                    </>
                )
            }

            <Box className="flex justify-between flex-wrap mb-2">
                {
                    (loading) ?  <Skeleton width={320} height={24} /> : (
                        <Typography variant="body1" color="text.secondary">
                            Última atualização em {data.dg} {data.hg}
                            {
                                (refreshing) ? <CircularProgress size={15} className="ml-2" thickness={6}/> : null
                            }
                        </Typography>
                    )
                }
            </Box>
            <Box className="mb-3 columns-3xs mx-auto">
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            {
                                (loading) ? <Skeleton variant="circular" width={40} height={40}/> : (
                                    <Avatar>
                                        <PeopleIcon/>
                                    </Avatar>
                                )
                            }
                        </ListItemAvatar>
                        {
                            (loading) ? (
                                <Box className="flex flex-col">
                                    <Skeleton width={100} height={24}/>
                                    <Skeleton width={150} height={20}/>
                                </Box>
                            ) : (
                                <ListItemText
                                    primary="Já foram contabilizados"
                                    secondary={parseInt(data.vv).toLocaleString('pt-br') + ' votos válidos'}
                                />
                            )
                        }
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                        {
                            (loading) ? <Skeleton variant="circular" width={40} height={40}/> : (
                                <Avatar>
                                    <PercentIcon/>
                                </Avatar>
                            )
                        }
                        </ListItemAvatar>
                        {
                            (loading) ? (
                                <Box className="flex flex-col">
                                    <Skeleton width={100} height={24}/>
                                    <Skeleton width={150} height={20}/>
                                </Box>
                            ) : (
                                <ListItemText
                                    primary="Cada 1%"
                                    secondary={'São ' + parseInt(data.vv / 100).toLocaleString('pt-br') + ' votos'}
                                />
                            )
                        }
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            {
                                (loading) ? <Skeleton variant="circular" width={40} height={40}/> : (
                                    <Avatar>
                                        <NoAccountsIcon/>
                                    </Avatar>
                                )
                            }
                        </ListItemAvatar>
                        {
                            (loading) ? (
                                <Box className="flex flex-col">
                                    <Skeleton width={100} height={24}/>
                                    <Skeleton width={150} height={20}/>
                                </Box>

                            ) : (
                                <ListItemText
                                    primary="Os que faltaram"
                                    secondary={'Somam ' + parseInt(data.a).toLocaleString('pt-br') + ' pessoas'}
                                />
                            )
                        }
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            {
                                (loading) ?
                                    <Skeleton variant="circular" width={40} height={40}/> : (
                                        <Avatar>
                                            <ErrorIcon/>
                                        </Avatar>
                                    )
                            }
                        </ListItemAvatar>
                        {
                            (loading) ? (
                                <Box className="flex flex-col">
                                    <Skeleton width={100} height={24}/>
                                    <Skeleton width={150} height={20}/>
                                </Box>
                            ) : (
                                <ListItemText
                                    primary="Brancos e nulos"
                                    secondary={'Somam ' + (parseInt(data.tvn) + parseInt(data.vb)).toLocaleString('pt-br') + ' votos'}
                                />
                            )
                        }

                    </ListItem>
                </List>
            </Box>
            {
                (loading) ? '' : <Md/>
            }
            <ResultCandidate cand={data.cand} loading={loading}/>
        </Box>
    )
}

export default Result