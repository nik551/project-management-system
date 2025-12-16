import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { client } from './api/client';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;