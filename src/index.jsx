import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
const mode = window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const theme = createTheme({
    components: {
        MuiPopover: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiPopper: {
            defaultProps: {
                container: rootElement,
            },
        },
    },
    palette: {
        mode,
    },
});

root.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>
);
