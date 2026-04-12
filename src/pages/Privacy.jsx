import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="page-container">
      <main className="main-content">
        <div className="legal-page glass-panel" style={{ marginTop: '2rem', marginBottom: '2rem', padding: '3rem' }}>
          <h1>Política de Privacidade</h1>
          <p className="last-updated">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          
          <p>
            O IceoLab é uma plataforma SaaS de produtividade para criadores de conteúdo e agências, focada na edição de vídeos próprios, organização de calendário editorial e agendamento de publicações originais. A sua privacidade e a segurança das suas contas são as nossas maiores prioridades.
          </p>
          
          <div className="highlight-box">
            <p style={{ margin: 0 }}>
              <strong>Transparência e API Oficial:</strong> Utilizamos a API oficial da Meta (Instagram Graph API) de forma totalmente transparente e aprovada. <strong>Não vendemos dados de usuários ou contas conectadas em hipótese alguma.</strong>
            </p>
          </div>

          <h2>1. Informações que Coletamos</h2>
          <p>
            O IceoLab coleta informações do seu perfil público e solicita permissões estritamente essenciais para o funcionamento da nossa ferramenta corporativa, especificamente para prover a automação do acesso (tokens de autenticação temporários) e a gestão do seu calendário editorial (permissão para postar seus conteúdos).
          </p>

          <h2>2. Controle do Usuário e Revogação</h2>
          <p>
            Você sempre terá o controle sobre as vinculações feitas pela plataforma. O usuário tem o direito soberano de revogar o acesso via configurações oficiais do Facebook ou do Instagram a qualquer momento, e a partir desse momento nossa plataforma perderá imediatamente as permissões fornecidas outrora.
          </p>
          
          <h2>3. Segurança e Armazenamento</h2>
          <p>
            Qualquer informação básica (como nome e email empresarial) e tokens de autenticação gerados pelo processo seguro (OAuth) da Meta são criptografados e mantidos em bancos de dados protegidos. Nossos protocolos visam mitigar riscos, conforme práticas mercadológicas estritas.
          </p>

          <h2>4. Solicitação de Exclusão de Dados (Data Deletion Request)</h2>
          <p>
            Garantimos o seu pleno direito ao esquecimento e à exclusão contínua das suas informações nos nossos servidores. O usuário pode excluir todos os seus dados estruturais, arquivos hospedados conosco e as associações da conta enviando um email com a solicitação para:
          </p>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #ef4444', margin: '1.5rem 0' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              Solicite a deleção de sua conta: <a href="mailto:suporte@iceolab.com.br" style={{ color: 'var(--primary-color)' }}>suporte@iceolab.com.br</a>
            </p>
          </div>
          <p>
            O seu pedido será processado em até trinta (30) dias, resultando na eliminação absoluta dos arquivos mantidos pela nossa base de dados produtiva.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
