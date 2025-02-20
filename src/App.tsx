import { Layout } from './components/layout'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from './components/themeprovider'
import WeatherDashboard from './pages/weather-dashboard'
import CityPage from './pages/city-page'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  }
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path='/' element={<WeatherDashboard />} />
              <Route path='/city/:cityName' element={<CityPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>


  )
}

export default App
