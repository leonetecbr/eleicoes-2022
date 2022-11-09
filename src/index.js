import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles'
import { CookiesProvider } from 'react-cookie'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const rootElement = document.getElementById('root')
const root =  ReactDOM.createRoot(rootElement)
const mode = (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'

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

serviceWorkerRegistration.register()