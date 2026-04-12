import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="page-container">
      <main className="main-content">
        <div className="legal-page">
          <h1>Termos de Uso</h1>
          <p>
            Bem-vindo ao IceoLab. Estes termos de uso (os "Termos") regem o seu acesso
            e uso da nossa plataforma de automação. Ao utilizar nossos serviços, você 
            concorda em cumprir e ficar vinculado a estes Termos.
          </p>
          
          <div className="highlight-box">
            <p style={{ margin: 0 }}>
              <strong>Importante:</strong> O IceoLab utiliza as APIs oficiais da Meta e do Instagram, e os usuários devem obedecer às políticas da plataforma.
            </p>
          </div>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <h2>2. Direitos de Propriedade</h2>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
            sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          
          <h2>3. Responsabilidades do Usuário</h2>
          <p>
            Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. 
            Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. 
            Fusce nec tellus sed augue semper porta. Mauris massa.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
