import UFs from '../data/UFs.json';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Collapse, Box } from '@mui/material';

export function SelectUF(props) {
    let { setUf, uf, turno, show } = props;

    if (turno === undefined) turno = 1;

    const handleChange = event => {
        setUf(event.target.value);
    };

    return (
        <Collapse in={show} className="text-center">
            <Box className="mb-2 mt-3">
                <FormControl>
                    <InputLabel id="ufResultLabel">UF</InputLabel>
                    <Select
                        autoWidth
                        value={uf}
                        label="UF"
                        variant="standard"
                        onChange={handleChange}
                        labelId="ufResultLabel"
                    >
                        {UFs.map(({ label, value, second }) => {
                            return turno === 1 || second ? (
                                <MenuItem value={value} key={value}>
                                    {label}
                                </MenuItem>
                            ) : (
                                ''
                            );
                        })}
                    </Select>
                    <FormHelperText>Selecione a UF</FormHelperText>
                </FormControl>
            </Box>
        </Collapse>
    );
}

export default SelectUF;
