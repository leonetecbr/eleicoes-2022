import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
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
)