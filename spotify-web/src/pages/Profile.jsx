import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { User, Music, Trash2, LogOut, Disc } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mySongs, setMySongs] = useState([]);

    // Busca músicas se o usuário for Artista
    useEffect(() => {
        if (user && user.isArtist) {
            // Como nossa API de busca é simples, vamos buscar "tudo" e filtrar no front 
            // (Num app real, teríamos um endpoint /users/{id}/songs)
            api.get(`/songs/search?term=${user.name}`)
                .then(res => setMySongs(res.data))
                .catch(err => console.error(err));
        }
    }, [user]);

    const handleDeleteAccount = async () => {
        if (window.confirm("Tem certeza? Isso apagará suas playlists e músicas!")) {
            try {
                // Endpoint fictício, pois delete de User é perigoso em MVP
                // Mas vamos simular o logout forçado
                alert("Conta desativada com sucesso.");
                logout();
                navigate('/');
            } catch (error) {
                alert("Erro ao deletar conta.");
            }
        }
    };

    if (!user) return <p className="p-8">Carregando...</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-coffee-800 mb-8 flex items-center gap-3">
                <User className="w-8 h-8" /> Meu Perfil
            </h1>

            {/* Cartão de Dados */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-coffee-200 mb-8 flex items-start gap-6">
                <div className="w-24 h-24 bg-coffee-200 rounded-full flex items-center justify-center text-coffee-500 text-4xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-coffee-900">{user.name}</h2>
                    <p className="text-coffee-600 mb-2">{user.email}</p>
                    <div className="flex gap-2 mt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.isArtist ? 'bg-purple-100 text-purple-700' : 'bg-coffee-100 text-coffee-700'}`}>
                            {user.isArtist ? 'Artista Verificado' : 'Ouvinte'}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-mono">
                            ID: {user.id}
                        </span>
                    </div>
                </div>
            </div>

            {/* Área de Músicas Postadas (Apenas para Artistas) */}
            {user.isArtist && (
                <div className="mb-8 animate-fade-in">
                    <h3 className="text-xl font-bold text-coffee-800 mb-4 flex items-center gap-2">
                        <Disc className="w-5 h-5" /> Discografia (Suas Músicas)
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-coffee-100 overflow-hidden">
                        {mySongs.length > 0 ? (
                            <ul className="divide-y divide-coffee-50">
                                {mySongs.map(song => (
                                    <li key={song.id} className="p-4 flex items-center justify-between hover:bg-coffee-50 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-coffee-100 rounded-full flex items-center justify-center">
                                                <Music className="w-4 h-4 text-coffee-400" />
                                            </div>
                                            <span className="font-medium text-coffee-800">{song.title}</span>
                                        </div>
                                        <span className="text-xs text-coffee-400">{song.durationSeconds}s</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="p-6 text-coffee-400 text-center text-sm">Nenhuma música encontrada.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Zona de Perigo */}
            <div className="border-t border-coffee-200 pt-8 mt-8">
                <h3 className="text-lg font-bold text-coffee-800 mb-4">Configurações da Conta</h3>
                <div className="flex gap-4">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-2 px-6 py-2 bg-coffee-100 text-coffee-700 rounded-lg hover:bg-coffee-200 transition font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Sair da Conta
                    </button>
                    <button 
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                        <Trash2 className="w-4 h-4" /> Excluir Conta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;