import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="page-container">
      <main className="main-content">
        <div className="legal-page glass-panel" style={{ marginTop: '2rem', marginBottom: '2rem', padding: '3rem' }}>
          <h1>Termos de Uso</h1>
          <p className="last-updated">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          
          <p>
            Bem-vindo ao IceoLab. Estes termos de uso (os "Termos") regem o seu acesso
            e uso da nossa plataforma. O IceoLab é uma plataforma SaaS de produtividade para criadores de conteúdo e agências, focada na edição de vídeos próprios, organização de calendário editorial e agendamento de publicações originais.
          </p>
          
          <div className="highlight-box">
            <p style={{ margin: 0 }}>
              <strong>Importante:</strong> Ao utilizar o IceoLab, o usuário declara e concorda expressamente em obedecer integralmente aos Termos de Serviço do Instagram e da Meta Plataforms, Inc.
            </p>
          </div>

          <h2>1. Aceitação e Escopo do Serviço</h2>
          <p>
            Ao criar uma conta e utilizar o IceoLab, você concorda com estes Termos. A nossa ferramenta foi desenvolvida estritamente para otimizar o seu fluxo de trabalho como criador de conteúdo, auxiliando na produtividade por meio do agendamento de postagens e gestão de calendário editorial do seu próprio material criativo.
          </p>

          <h2>2. Políticas de Conteúdo e Violações</h2>
          <p>
            O IceoLab preza pela originalidade e pelo respeito aos direitos intelectuais. É <strong>rigorosamente proibido</strong> o uso da nossa ferramenta para a prática de spam, discurso de ódio, publicação de conteúdo ilícito, ou qualquer atividade que viole as diretrizes da comunidade das redes sociais conectadas.
          </p>
          <p>
            Além disso, é expressamente proibido o agendamento ou publicação de conteúdo sob o qual o usuário não possua os devidos direitos autorais ou licenças de uso corporativo aplicáveis. A constatação de violação de direitos autorais resultará no encerramento imediato da conta.
          </p>
          
          <h2>3. Vinculação com APIs de Terceiros</h2>
          <p>
            O IceoLab utiliza as APIs oficiais da Meta (Instagram Graph API) para fornecer suas funcionalidades de agendamento e publicação. Nós não possuímos afiliação comercial direta com a Meta, mas operamos sujeitos e respeitando integralmente suas políticas para desenvolvedores. O uso indevido das APIs através de nossa plataforma constitui uma quebra de contrato.
          </p>

          <h2>4. Modificações do Serviço</h2>
          <p>
            Reservamo-nos o direito de modificar, suspender ou descontinuar o serviço a qualquer momento, visando adequações técnicas, legais ou de compliance com ecossistemas de parceiros (como o Facebook/Instagram).
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
