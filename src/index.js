import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles'
import { CookiesProvider } from 'react-cookie'

const rootElement = document.getElementById('root')
const root =  ReactDOM.createRoot(rootElement)

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
        mode: 'dark',
    },
})

root.render(
  <React.StrictMode>
      <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
              <CookiesProvider>
                  <App />
              </CookiesProvider>
          </ThemeProvider>
      </StyledEngineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
