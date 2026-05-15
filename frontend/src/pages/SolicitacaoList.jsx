import { useEffect, useState } from 'react';
import api from '../services/api.js';

// 1. Defina as cores fora do componente para organização
const coresStatus = {
  SOLICITADO: '#6c757d', // Cinza
  LIBERADO: '#28a745',   // Verde
  APROVADO: '#007bff',   // Azul
  REJEITADO: '#dc3545',  // Vermelho
  CANCELADO: '#ffc107'   // Amarelo
};

function SolicitacaoList() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  // 2. Função de estilo padronizada
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

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/api/solicitacoes/${id}/status`, { novoStatus });
      alert('Status atualizado com sucesso!');
      carregarDados();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar: ' + (error.response?.data?.message || 'Erro interno'));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Lista de Solicitações - SGS Pagamento</h2>

      {/* ... Filtros permanecem iguais ... */}

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
                    color: coresStatus[s.status] || 'black' // AQUI USA A COR PADRONIZADA NO TEXTO
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
        <div className="modal-detalhes">
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
           <button onClick={() => setSolicitacaoSelecionada(null)}>Fechar</button>
        </div>
      )}
    </div>
  );
}

export default SolicitacaoList;