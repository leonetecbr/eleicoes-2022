import * as React from 'react'
import {SelectChangeEvent} from '@mui/material/Select'
import {FormControl, FormHelperText, InputLabel, MenuItem, Select, Collapse} from '@mui/material'
const UFs = require('../json/UFs.json')

export function SelectUF(props) {
    const {setUf, uf, turno}= props

    const handleChange = (event: SelectChangeEvent) => {
        setUf(event.target.value)
    }

    return (
        <Collapse in={(uf === 'br')}>
            <FormControl className="min-w-min m-1">
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
        </Collapse>
    )
}

export default SelectUF