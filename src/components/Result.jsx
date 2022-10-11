import {Avatar, Box, LinearProgress, Typography, Chip} from '@mui/material'
import * as React from 'react'

export function Result(props) {
    const cand = props.candidates

    cand.sort((a,b) => parseInt(a.seq) < parseInt(b.seq) ? -1 : parseInt(a.seq) > parseInt(b.seq) ? 1 : 0)

    return (
        cand.map(cand => {
            let cor
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

            if (typeof cand.pvap === 'string') cand.pvap = parseFloat(cand.pvap.replace(',', '.'))

            return (
                <Box className="mb-4 pb-4 shadow border-b border-gray-500" key={cand.sqcand}>
                    <Box className="flex justify-between">
                        <Box className="flex">
                            <Avatar alt={cand.nm}
                                    src={process.env.PUBLIC_URL + '/images/' + cand.sqcand + '.jpg'}
                                    sx={{ width: 56, height: 56 }}
                            />
                            <Box className="flex flex-col ml-2">
                                <span dangerouslySetInnerHTML={{__html: cand.nm}}></span>
                                <Box className="flex items-center">
                                    <Chip label={cand.n} className="mr-2" variant="outlined"/>
                                    <Typography color={cor}>{cand.st}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box className="flex items-end">
                            <Box sx={{minWidth: 35}}>
                                <Typography variant="body2" color="text.secondary">
                                    {cand.pvap.toLocaleString('pt-br', {minimumFractionDigits: 2})}%
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="w-full mt-3">
                        <Typography variant="body2" color="text.secondary">
                            {parseInt(cand.vap).toLocaleString('pt-br')} votos
                        </Typography>
                        <LinearProgress variant="determinate" value={cand.pvap}/>
                    </Box>
                </Box>
            )
    }))
}

export default Result