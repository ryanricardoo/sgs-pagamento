import { useEffect, useState } from 'react';
import api from '../services/api.js';

function SolicitacaoList() {

  const [solicitacoes, setSolicitacoes] = useState([]);


  const [loading, setLoading] = useState(true);


  useEffect(() => {
    carregarDados();
  }, []); //

  const carregarDados = async () => {
    try {

      const response = await api.get('/api/solicitacoes');
      setSolicitacoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      alert("Erro ao conectar com o backend Java na porta 8080");
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <h3>Carregando...</h3>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Lista de Solicitações - SGS Pagamento</h2>
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead style={{ backgroundColor: '#e2e2e2' }}>
          <tr>
            <th>ID</th>
            <th>Solicitante</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.length > 0 ? (
            solicitacoes.map((s) => (
              <tr key={s.id} style={{ textAlign: 'center' }}>
                <td>{s.id}</td>
                <td>{s.nomeSolicitante}</td>
                <td>R$ {s.valor?.toFixed(2)}</td>
                <td>
                    <span style={{ fontWeight: 'bold', color:
                    s.status === 'SOLICITADO' ? 'yellow' :
                    s.status === 'LIBERADO' ? 'blue' :
                    s.status === 'APROVADO' ? 'green' :
                    s.status === 'REJEITADO' ? 'orange' :
                    s.status === 'CANCELADO'  ? 'red'    : 'gray'
                     }}>
                        {s.status}
                    </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhuma solicitação encontrada no banco.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SolicitacaoList;