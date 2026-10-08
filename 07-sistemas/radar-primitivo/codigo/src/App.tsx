/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import DemoShell from './demo/DemoShell'
import MeuDia from './pages/demo/MeuDia'
import FichaEmpresa from './pages/demo/FichaEmpresa'
import Perfis from './pages/demo/Perfis'

// ONLY IMPORT AND RENDER WORKING PAGES, NEVER ADD PLACEHOLDER COMPONENTS OR PAGES IN THIS FILE
// AVOID REMOVING ANY CONTEXT PROVIDERS FROM THIS FILE (e.g. TooltipProvider, Toaster, Sonner)

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES MUST BE ADDED HERE */}
          <Route path="/demo" element={<DemoShell />}>
            <Route index element={<MeuDia />} />
            <Route path="empresa/:id" element={<FichaEmpresa />} />
            <Route path="perfis" element={<Perfis />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
