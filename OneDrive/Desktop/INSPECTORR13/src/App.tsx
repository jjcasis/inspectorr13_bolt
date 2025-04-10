import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import SelectorModuloNivel from './components/SelectorModuloNivel';
import AmbientesActivos from './components/AmbientesActivos';
import PanelConfiguracion from './components/PanelConfiguracion';
import InspeccionPorElementos from './components/editor/InspeccionPorElementos';
import ListaInspeccionElementos from './components/editor/ListaInspeccionElementos';
import ListaInspeccionAmbientes from './components/editor/ListaInspeccionAmbientes';
import CapturaRapida from './components/editor/CapturaRapida';
import ListaInformesCaptura from './components/editor/ListaInformesCaptura';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/config" element={<PanelConfiguracion />} />
            <Route path="/elementos" element={<ListaInspeccionElementos />} />
            <Route path="/elementos/editor" element={<InspeccionPorElementos />} />
            <Route path="/excepciones" element={<ListaInformesCaptura />} />
            <Route path="/excepciones/editor" element={<CapturaRapida />} />
            <Route path="/" element={<ListaInspeccionAmbientes />} />
            <Route path="/ambientes/editor" element={
              <div className="container">
                <SelectorModuloNivel />
                <AmbientesActivos />
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
