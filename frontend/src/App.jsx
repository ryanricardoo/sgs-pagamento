import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SolicitacaoList from './pages/SolicitacaoList';
import SolicitacaoForm from './components/SolicitacaoForm';

function App() {
  return (
    <Router>
      <nav style={{ padding: '20px', backgroundColor: '#2c3e50', color: 'white' }}>
        <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Lista</Link>
        <Link to="/novo" style={{ color: 'white', textDecoration: 'none' }}>Nova Solicitação</Link>
      </nav>

      <Routes>
        <Route path="/" element={<SolicitacaoList />} />
        <Route path="/novo" element={<SolicitacaoForm />} />
      </Routes>
    </Router>
  );
}

export default App;