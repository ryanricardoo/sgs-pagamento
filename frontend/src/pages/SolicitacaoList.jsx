import { useEffect, useState } from 'react';
import api from '../services/api.js';

const coresStatus = {
  SOLICITADO: '#6c757d',
  LIBERADO: '#28a745',
  APROVADO: '#007bff',
  REJEITADO: '#dc3545',
  CANCELADO: '#ffc107'
};

function SolicitacaoList() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);


  useEffect(() => {
    carregarDados();

    api.get('/api/categorias')
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Erro ao carregar categorias para o filtro:", err));
  }, []);

  const gerarEstiloBotao = (statusAlvo) => ({
    backgroundColor: coresStatus[statusAlvo] || '#6c757d',
    color: statusAlvo === 'CANCELADO' ? 'black' : 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px'
  });

  const carregarDados = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (categoriaId) params.append('categoriaId', categoriaId);
      if (dataInicio) params.append('inicio', `${dataInicio}T00:00:00`);
      if (dataFim) params.append('fim', `${dataFim}T23:59:59`);

      const response = await api.get(`/api/solicitacoes?${params.toString()}`);
      setSolicitacoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
    } finally {
      setLoading(false);
    }
  };

  const limparFiltros = () => {
    setStatus('');
    setCategoriaId('');
    setDataInicio('');
    setDataFim('');

    setTimeout(() => {
      api.get('/api/solicitacoes')
        .then(res => setSolicitacoes(res.data))
        .catch(err => console.error(err));
    }, 50);
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/api/solicitacoes/${id}/status`, { novoStatus });
      alert('Status updated successfully!');
      carregarDados();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar: ' + (error.response?.data?.message || 'Erro interno'));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Lista de Solicitações - SGS Pagamento</h2>


      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        alignItems: 'flex-end',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Status:</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '6px', borderRadius: '4px' }}>
            <option value="">Todos os Status</option>
            <option value="SOLICITADO">Solicitado</option>
            <option value="LIBERADO">Liberado</option>
            <option value="APROVADO">Aprovado</option>
            <option value="REJEITADO">Rejeitado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Categoria:</label>
          <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} style={{ padding: '6px', borderRadius: '4px' }}>
            <option value="">Todas as Categorias</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Início Período:</label>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} style={{ padding: '5px', borderRadius: '4px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Fim Período:</label>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} style={{ padding: '5px', borderRadius: '4px' }} />
        </div>

        <button onClick={carregarDados} style={{
          backgroundColor: '#007bff', color: 'white', padding: '7px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          Buscar
        </button>

        <button onClick={limparFiltros} style={{
          backgroundColor: '#6c757d', color: 'white', padding: '7px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          Limpar
        </button>
      </div>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#e2e2e2' }}>
          <tr>
            <th>ID</th>
            <th>Solicitante</th>
            <th>CPF/CNPJ</th>
            <th>Categoria</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7">Carregando...</td></tr>
          ) : solicitacoes.length > 0 ? (
            solicitacoes.map((s) => (
              <tr key={s.id} style={{ textAlign: 'center' }}>
                <td>{s.id}</td>
                <td>{s.nomeSolicitante}</td>
                <td>{s.documento}</td>
                <td>{s.nomeCategoria}</td>
                <td>R$ {s.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>

                <td>
                  <span style={{
                    fontWeight: 'bold',
                    color: coresStatus[s.status] || 'black'
                  }}>
                    {s.status}
                  </span>
                </td>

                <td>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    {s.status === 'SOLICITADO' && (
                      <>
                        <button onClick={() => atualizarStatus(s.id, 'LIBERADO')} style={gerarEstiloBotao('LIBERADO')}>Liberar</button>
                        <button onClick={() => atualizarStatus(s.id, 'REJEITADO')} style={gerarEstiloBotao('REJEITADO')}>Rejeitar</button>
                      </>
                    )}

                    {s.status === 'LIBERADO' && (
                      <>
                        <button onClick={() => atualizarStatus(s.id, 'APROVADO')} style={gerarEstiloBotao('APROVADO')}>Aprovar</button>
                        <button onClick={() => atualizarStatus(s.id, 'REJEITADO')} style={gerarEstiloBotao('REJEITADO')}>Rejeitar</button>
                      </>
                    )}

                    {s.status === 'APROVADO' && (
                      <button onClick={() => atualizarStatus(s.id, 'CANCELADO')} style={gerarEstiloBotao('CANCELADO')}>Cancelar</button>
                    )}

                    {(s.status === 'REJEITADO' || s.status === 'CANCELADO') && (
                      <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold' }}>FINALIZADO</span>
                    )}

                    <button
                      onClick={() => setSolicitacaoSelecionada(s)}
                      style={{ padding: '3px 8px', cursor: 'pointer' }}
                    >
                      Ver
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7">Nenhuma solicitação encontrada.</td></tr>
          )}
        </tbody>
      </table>

      {solicitacaoSelecionada && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          borderRadius: '4px'
        }}>
           <h3>Detalhes da Solicitação #{solicitacaoSelecionada.id}</h3>
           <p><strong>Descrição:</strong> {solicitacaoSelecionada.descricao}</p>
           <p>
             <strong>Data:</strong> {
               new Date(solicitacaoSelecionada.dataSolicitacao).toLocaleString('pt-BR', {
                 day: '2-digit',
                 month: '2-digit',
                 year: 'numeric',
                 hour: '2-digit',
                 minute: '2-digit'
               })
             }
           </p>
           <button onClick={() => setSolicitacaoSelecionada(null)} style={{ padding: '5px 10px', cursor: 'pointer' }}>Fechar</button>
        </div>
      )}
    </div>
  );
}

export default SolicitacaoList;