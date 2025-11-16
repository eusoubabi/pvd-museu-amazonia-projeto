import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Componente para a Página de Login
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();

  console.log('Tentativa de Login:', { email, password });

  if (email.trim() === '' || password.trim() === '') {
    alert('Por favor, preencha o e-mail e a senha.');
    return;
  }

  // Marca o usuário como logado
  localStorage.setItem("isLogged", "true");

  alert('Login realizado com sucesso! Redirecionando para o Portal do Colaborador.');

  // Redireciona para o portal
  navigate('/portal-colaborador');
};


  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2>Acesso do Funcionário</h2>
        <form onSubmit={handleLogin}>
          
          <div className="input-group">
            <label htmlFor="email">E-mail ou Usuário</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn">ENTRAR</button>
          
          <div className="login-links">
            <a href="/recuperar-senha">Esqueceu sua senha?</a>
            
          </div>
        </form>
      </div>
    </div>
  );
};