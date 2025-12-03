import { Link, useNavigate } from 'react-router-dom';
import { Home, User, ListMusic, Settings, LogOut, Music, UploadCloud, Disc } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Função para proteger rotas no clique
    const handleNavigation = (path) => {
        if (!user) {
            alert("Você precisa criar uma conta para acessar essa área!");
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Drawer / Sidebar */}
            <aside className="w-64 bg-coffee-100 border-r border-coffee-200 fixed h-full p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-10 text-coffee-800 font-bold text-2xl">
                        <Music className="w-8 h-8" />
                        <span>JavaFy</span>
                    </div>

                    <nav className="space-y-4">
                        <Link to="/" className="flex items-center gap-3 text-coffee-700 hover:text-coffee-500 font-medium transition">
                            <Home className="w-5 h-5" /> Início
                        </Link>
                        
                        <button onClick={() => handleNavigation('/profile')} className="flex items-center gap-3 text-coffee-700 hover:text-coffee-500 font-medium transition w-full text-left">
                            <User className="w-5 h-5" /> Meu Perfil
                        </button>
                        
                        <button onClick={() => handleNavigation('/playlists')} className="flex items-center gap-3 text-coffee-700 hover:text-coffee-500 font-medium transition w-full text-left">
                            <ListMusic className="w-5 h-5" /> Playlists
                        </button>

                        <button onClick={() => handleNavigation('/upload')} className="flex items-center gap-3 text-coffee-700 hover:text-coffee-500 font-medium transition w-full text-left">
                            <UploadCloud className="w-5 h-5" /> Postar Música
                        </button>
                        {user && user.isArtist && (
                            <button 
                                onClick={() => handleNavigation('/my-albums')} 
                                className="flex items-center gap-3 text-coffee-700 hover:text-coffee-500 font-medium transition w-full text-left mt-2"
                            >
                                <Disc className="w-5 h-5" /> Meus Álbuns
                            </button>
                        )}
                    </nav>
                </div>

                <div className="space-y-4 border-t border-coffee-300 pt-6">
                    {user ? (
                        <>
                            <div className="text-sm text-coffee-600 mb-2">Olá, {user.name} (ID: {user.id})</div>
                            <button onClick={() => handleNavigation('/settings')} className="flex items-center gap-3 text-coffee-700 hover:text-coffee-500 text-sm transition w-full">
                                <Settings className="w-4 h-4" /> Configurações
                            </button>
                            <button onClick={logout} className="flex items-center gap-3 text-red-400 hover:text-red-500 text-sm transition w-full">
                                <LogOut className="w-4 h-4" /> Sair
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="block w-full text-center bg-coffee-500 text-white py-2 rounded-lg hover:bg-coffee-600 transition">
                            Criar Conta / Entrar
                        </Link>
                    )}
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <main className="ml-64 flex-1 p-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;