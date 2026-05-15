import { useState, useEffect } from 'react';
import api from '../services/api.js';

function SolicitacaoForm() {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    solicitanteId: '',
    categoriaId: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [solicitantes, setSolicitantes] = useState([])

  useEffect(() => {

    api.get('/api/categorias')
    .then(res => setCategorias(res.data))
    .catch(err => console.error(err));

    api.get('/api/solicitantes')
    .then(res => setSolicitantes(res.data))
    .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/solicitacoes', formData);
      alert('Solicitação cadastrada com sucesso!');
      setFormData({ descricao: '', valor: '', solicitanteId: '', categoriaId: '' });
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar: ' + (error.response?.data?.message || 'Erro interno'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2>Nova Solicitação</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <label>Descrição:
          <input type="text" required value={formData.descricao} style={{ width: '100%', padding: '8px' }}
            onChange={e => setFormData({...formData, descricao: e.target.value})} />
        </label>

        <label>Valor:
          <input type="number" step="0.01" required value={formData.valor} style={{ width: '100%', padding: '8px' }}
            onChange={e => setFormData({...formData, valor: e.target.value})} />
        </label>

        <label>Solicitante:
          <select required value ={formData.solicitanteId} style={{width: '100%', padding: "8px"}}
            onChange={e => setFormData({...formData, solicitanteId: e.target.value})}>
            <option value="">Selecione um solicitante</option>
            {solicitantes.map(sol => (
            <option key = {sol.id} value={sol.id}>{sol.nome}</option>
            ))}
            </select>
        </label>

        <label>Categoria:
          <select required value={formData.categoriaId} style={{ width: '100%', padding: '8px' }}
            onChange={e => setFormData({...formData, categoriaId: e.target.value})}>
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={loading} style={{
          backgroundColor: '#28a745', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer'
        }}>
          {loading ? 'Salvando...' : 'Cadastrar Solicitação'}
        </button>
      </form>
    </div>
  );
}

export default SolicitacaoForm;