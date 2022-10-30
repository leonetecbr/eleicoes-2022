import * as React from 'react'
import {SelectChangeEvent} from '@mui/material/Select'
import {FormControl, FormHelperText, InputLabel, MenuItem, Select, Collapse, Box} from '@mui/material'
const UFs = require('../json/UFs.json')

export function SelectUF(props) {
    let {setUf, uf, turno, show} = props

    if (turno === undefined) turno = 1

    const handleChange = (event: SelectChangeEvent) => {
        setUf(event.target.value)
    }

    return (
        <Collapse in={show} className="text-center">
            <Box className="mt-3 mb-2">
                <FormControl>
                    <InputLabel id="ufResultLabel">UF</InputLabel>
                    <Select
                        value={uf}
                        onChange={handleChange}
                        labelId="ufResultLabel"
                        id="ufResultInput"
                        autoWidth
                        label="UF"
                    >
                        {
                            UFs.map(({label, value, second}) => {
                                return (turno === 1 || second) ?
                                    <MenuItem value={value} key={value}>{label}</MenuItem> :
                                    ''
                            })
                        }
                    </Select>
                    <FormHelperText>
                        Selecione a UF
                    </FormHelperText>
                </FormControl>
            </Box>
        </Collapse>
    )
}

export default SelectUF