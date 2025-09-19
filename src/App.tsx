import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Test simple component first
const SimpleHome = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Oficios - Inflatrack</h1>
      <h2>Plataforma de Proveedores de Oficios</h2>
      <p>Conectamos clientes con proveedores de servicios de construcción en La Plata.</p>
      <div style={{ marginTop: '20px' }}>
        <h3>Servicios Populares:</h3>
        <ul>
          <li>Plomería</li>
          <li>Electricidad</li>
          <li>Pintura</li>
          <li>Carpintería</li>
          <li>Albañilería</li>
        </ul>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <SimpleHome />,
  },
  {
    path: '/test',
    element: <div><h1>Test Page</h1><p>Página de prueba</p></div>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
