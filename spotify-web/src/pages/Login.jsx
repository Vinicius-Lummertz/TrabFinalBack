import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { User, Mail, Lock, ArrowRight, Music } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(false); // Começa na tela de CADASTRO (opcional)
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let userData;

            if (isLogin) {
                // --- LÓGICA DE LOGIN (Agora segura) ---
                const payload = {
                    email: formData.email,
                    password: formData.password
                };
                // Chama o novo endpoint POST /users/login
                const response = await api.post('/users/login', payload);
                userData = response.data;

            } else {
                // --- LÓGICA DE CADASTRO ---
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                };
                // Chama POST /users
                const response = await api.post('/users', payload);
                userData = response.data;
            }

            // Deu certo? Salva e entra.
            login(userData);
            navigate('/'); 

        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 400) {
                 setError("Dados inválidos. Verifique os campos.");
            } else {
                 // A mensagem "Email ou senha inválidos" vem do backend agora
                 setError(isLogin ? "Email ou senha incorretos." : "Erro ao cadastrar. Este email já existe?");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-coffee-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-coffee-200">
                
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-coffee-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                        <Music className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-coffee-800 mb-2">
                        {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
                    </h2>
                    <p className="text-coffee-500 text-sm">
                        {isLogin ? 'Use seu email e senha' : 'Entre para a comunidade musical'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-coffee-50 rounded-lg p-1 mb-6">
                    <button 
                        onClick={() => { setIsLogin(false); setError(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition ${!isLogin ? 'bg-white text-coffee-800 shadow-sm' : 'text-coffee-500 hover:text-coffee-700'}`}
                    >
                        Cadastrar
                    </button>
                    <button 
                        onClick={() => { setIsLogin(true); setError(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition ${isLogin ? 'bg-white text-coffee-800 shadow-sm' : 'text-coffee-500 hover:text-coffee-700'}`}
                    >
                        Entrar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 text-center font-medium">
                            {error}
                        </div>
                    )}

                    {/* Campo Nome (Só aparece no cadastro) */}
                    {!isLogin && (
                        <div className="relative animate-fade-in">
                            <User className="absolute left-3 top-3.5 h-5 w-5 text-coffee-400" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Seu nome artístico"
                                className="w-full pl-10 pr-4 py-3 bg-coffee-50 border border-coffee-200 rounded-lg focus:outline-none focus:border-coffee-500 text-coffee-900 placeholder-coffee-400"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    {/* Campo Email (Sempre aparece) */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-coffee-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="seu@email.com"
                            className="w-full pl-10 pr-4 py-3 bg-coffee-50 border border-coffee-200 rounded-lg focus:outline-none focus:border-coffee-500 text-coffee-900 placeholder-coffee-400"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Campo Senha (Sempre aparece) */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-coffee-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Sua senha secreta"
                            className="w-full pl-10 pr-4 py-3 bg-coffee-50 border border-coffee-200 rounded-lg focus:outline-none focus:border-coffee-500 text-coffee-900 placeholder-coffee-400"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-coffee-500 hover:bg-coffee-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                    >
                        {isLogin ? 'Entrar' : 'Começar Agora'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;