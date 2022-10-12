import {Avatar, Box, Chip, Divider, LinearProgress, Skeleton, Typography} from '@mui/material'
import * as React from 'react'

export function ResultCandidate(props) {
    const {cand, loading} = props

    if (!loading) cand.sort((a, b) => parseInt(a.seq) < parseInt(b.seq) ? -1 : parseInt(a.seq) > parseInt(b.seq) ? 1 : 0)

    return (
        cand.map((cand, index) => {
            let cor

            if (!loading) {
                switch (cand.st) {
                    case 'Não eleito':
                        cor = 'red'
                        break

                    case 'Eleito':
                        cor = 'green'
                        break

                    case '2º turno':
                        cor = 'yellow'
                        break

                    default:
                        cor = 'secondary'
                }
            }

            if (typeof cand.pvap === 'string') cand.pvap = parseFloat(cand.pvap.replace(',', '.'))

            return (
                <Box key={(loading) ? index : cand.sqcand}>
                    <Box className="flex justify-between">
                        <Box className="flex">
                            {
                                loading ? <Skeleton variant="circular" width={56} height={56}/>
                                    : (
                                        <Avatar alt={cand.nm}
                                                src={process.env.PUBLIC_URL + '/images/' + cand.sqcand + '.jpg'}
                                                className="w-14 h-14"
                                        />
                                    )
                            }
                            <Box className="flex flex-col ml-2">
                                {
                                    loading ?
                                        <Skeleton width={135} height={24}/> :
                                        <span dangerouslySetInnerHTML={{__html: cand.nm}}></span>
                                }
                                <Box className="flex items-center">
                                    {
                                        loading ? (
                                            <>
                                                <Skeleton width={39} height={32} className="mr-2"/>
                                                <Skeleton width={59} height={24} className="mr-2"/>
                                            </>
                                        ) : (
                                            <>
                                                <Chip label={cand.n} variant="outlined" className="mr-2"/>
                                                <Typography color={cor}>{cand.st}</Typography>
                                            </>
                                        )
                                    }
                                </Box>
                            </Box>
                        </Box>
                        <Box className="flex items-end">
                            <Box sx={{minWidth: 35}}>
                                {
                                    loading ? <Skeleton width={46} height={20}/> : (
                                        <Typography variant="body2" color="text.secondary">
                                            {cand.pvap.toLocaleString('pt-br', {minimumFractionDigits: 2})}%
                                        </Typography>
                                    )
                                }
                            </Box>
                        </Box>
                    </Box>
                    <Box className="w-full mt-3">
                        {
                            loading ? (
                                <>
                                    <Skeleton width={110} height={10}/>
                                    <Skeleton width="100%" height={10}/>
                                </>
                            ) : (
                                <>
                                    <Typography variant="body2" color="text.secondary">
                                        {parseInt(cand.vap).toLocaleString('pt-br')} votos
                                    </Typography>
                                    <LinearProgress variant="determinate" value={cand.pvap}/>
                                </>
                            )
                        }
                    </Box>
                    <Divider className="my-4"/>
                </Box>
            )
        }))
}

export default ResultCandidate