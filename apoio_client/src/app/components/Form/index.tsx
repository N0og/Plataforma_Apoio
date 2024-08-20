import { useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { AiOutlineUser, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FormFieldLogin, FormLogin } from "../../styles/FormStyle";
import { useDispatch } from "react-redux";
import { UserActions } from "../../constants";
import { useNavigate } from "react-router-dom";

export const Form = forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    handleLogin
  }));

  

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const requestData = {
      email: usuario,
      password: senha,
    };

    try {
      const response = await axios.post(`${process.env.VITE_API_URL}/api/v1/auth/login`, requestData);
      console.log('Login bem-sucedido:', response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      dispatch({
        type: UserActions.LOGIN,
        payload: {
          user: response.data.user,
          isAuthenticated: true
        }
      });

      navigate('/')
    } catch (error: any) {
      setError('Falha ao realizar login. Verifique suas credenciais.');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Previne o comportamento padrão
      handleLogin(); // Chama a função de login
    }
  };

  return (
    <FormLogin onKeyDown={handleKeyDown}>
      <FormFieldLogin>
        <input
          type="text"
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Usuário"
          required
        />
        <AiOutlineUser style={{ cursor: 'default' }} />
      </FormFieldLogin>

      <FormFieldLogin>
        <input
          type={senhaVisivel ? "text" : "password"}
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />
        {senhaVisivel ? (
          <AiOutlineEyeInvisible onClick={() => setSenhaVisivel(false)} />
        ) : (
          <AiOutlineEye onClick={() => setSenhaVisivel(true)} />
        )}
      </FormFieldLogin>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Carregando...</p>}
    </FormLogin>
  );
});
