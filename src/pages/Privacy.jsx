import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="page-container">
      <main className="main-content">
        <div className="legal-page">
          <h1>Política de Privacidade</h1>
          <p>
            A sua privacidade é importante para nós. Esta Política de Privacidade explica
            como o IceoLab coleta, usa e protege as suas informações pessoais ao
            utilizar nossa plataforma.
          </p>
          
          <div className="highlight-box">
            <p style={{ margin: 0 }}>
              <strong>Coleta de Dados Pessoais:</strong> Coletamos informações de perfil público e permissões de publicação estritamente para o funcionamento da automação, e não vendemos dados para terceiros. O usuário pode revogar o acesso via Facebook/Instagram a qualquer momento.
            </p>
          </div>

          <h2>1. Informações que Coletamos</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
            Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
            rhoncus ut eleifend nibh porttitor.
          </p>

          <h2>2. Como Usamos as Informações</h2>
          <p>
            Curabitur vulputate, ligula lacinia scelerisque tempor, sanguis id augue 
            dictum elit, nec cursus mauris velit nec ligula. Mauris pellentesque nunc 
            neque, dapibus auctor sem malesuada eu.
          </p>
          
          <h2>3. Segurança dos Dados</h2>
          <p>
            Aenean mattis vestibulum magna, interdum tristique metus suscipit elementum. 
            Cras non orci at lacus mollis iaculis eu ullamcorper massa. Suspendisse potenti.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
