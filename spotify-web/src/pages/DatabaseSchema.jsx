import { Database, Key, Link, Table, ArrowDown, ArrowRight } from 'lucide-react';

const DatabaseSchema = () => {
    
    // Componente para renderizar uma linha da tabela
    const Column = ({ name, type, isPk, isFk, fkRef }) => (
        <div className={`flex items-center justify-between p-2 border-b border-coffee-100 last:border-0 hover:bg-coffee-50 transition ${isPk ? 'bg-yellow-50/50' : ''} ${isFk ? 'bg-blue-50/50' : ''}`}>
            <div className="flex items-center gap-3">
                <div className="w-6 flex justify-center">
                    {isPk && <Key size={14} className="text-yellow-600" title="Primary Key" />}
                    {isFk && <Link size={14} className="text-blue-500" title="Foreign Key" />}
                </div>
                <span className={`font-mono text-sm ${isPk ? 'font-bold text-coffee-900' : 'text-coffee-700'}`}>
                    {name}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-mono">{type}</span>
                {fkRef && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                        → {fkRef}
                    </span>
                )}
            </div>
        </div>
    );

    // Componente do Card da Tabela
    const TableCard = ({ title, color, children }) => (
        <div className="bg-white rounded-xl shadow-lg border-2 border-coffee-200 overflow-hidden w-full max-w-sm relative z-10">
            <div className={`p-3 border-b border-coffee-200 flex items-center gap-2 ${color}`}>
                <Table size={16} className="text-coffee-900 opacity-70" />
                <h3 className="font-bold text-coffee-900 font-mono">{title}</h3>
            </div>
            <div className="bg-white">
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-coffee-100 p-8 overflow-auto">
            {/* Cabeçalho Técnico */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-coffee-200 mb-4">
                    <Database className="text-coffee-600" />
                    <h1 className="text-xl font-bold text-coffee-800 tracking-wide uppercase">Modelo Relacional (DER) - JavaFy</h1>
                </div>
                <p className="text-coffee-500 text-sm font-mono">PostgreSQL Database Structure • 5 Tables</p>
            </div>

            {/* Layout do Diagrama */}
            <div className="max-w-6xl mx-auto relative">
                
                {/* LINHA 1: USUÁRIOS (Central) */}
                <div className="flex justify-center mb-16 relative">
                    <TableCard title="tb_users" color="bg-orange-100">
                        <Column name="id" type="BIGINT" isPk />
                        <Column name="name" type="VARCHAR(255)" />
                        <Column name="email" type="VARCHAR(255)" />
                        <Column name="password" type="VARCHAR(255)" />
                        <Column name="is_artist" type="BOOLEAN" />
                    </TableCard>

                    {/* Linhas de conexão (Decorativas) */}
                    <div className="absolute top-full left-1/2 w-px h-16 bg-coffee-300 -translate-x-1/2"></div>
                    <div className="absolute top-full left-1/4 w-px h-16 bg-coffee-300"></div>
                    <div className="absolute top-full right-1/4 w-px h-16 bg-coffee-300"></div>
                    
                    {/* Conector Horizontal */}
                    <div className="absolute top-[100%] mt-16 left-1/4 right-1/4 h-px bg-coffee-300"></div>
                </div>

                {/* LINHA 2: PLAYLISTS e ÁLBUNS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-16 relative">
                    
                    {/* Lado Esquerdo: Playlists */}
                    <div className="flex flex-col items-center">
                        <div className="text-xs text-coffee-400 bg-white font-mono mb-2 flex items-center gap-1">
                            <ArrowDown size={12} /> 1:N (Um usuário cria N Playlists)
                        </div>
                        <TableCard title="tb_playlists" color="bg-green-100">
                            <Column name="id" type="BIGINT" isPk />
                            <Column name="name" type="VARCHAR(255)" />
                            <Column name="description" type="VARCHAR(255)" />
                            <Column name="is_public" type="BOOLEAN" />
                            <Column name="user_id" type="BIGINT" isFk fkRef="tb_users.id" />
                        </TableCard>
                    </div>

                    {/* Lado Direito: Álbuns */}
                    <div className="flex flex-col items-center">
                        <div className="text-xs text-coffee-400 font-mono mb-2 flex bg-white items-center gap-1">
                            1:N (Um artista cria N Álbuns) <ArrowDown size={12} />
                        </div>
                        <TableCard title="tb_albums" color="bg-purple-100">
                            <Column name="id" type="BIGINT" isPk />
                            <Column name="title" type="VARCHAR(255)" />
                            <Column name="release_date" type="DATE" />
                            <Column name="artist_id" type="BIGINT" isFk fkRef="tb_users.id" />
                        </TableCard>
                    </div>
                </div>

                {/* LINHA 3: PIVÔ e MÚSICAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative">
                    
                    {/* Lado Esquerdo: Tabela Pivô */}
                    <div className="flex flex-col items-center relative">
                        <div className="absolute -top-10 h-10 w-px bg-coffee-300"></div>
                        <div className="text-xs text-coffee-400 font-mono mb-2 mt-4 bg-white px-2 rounded border border-coffee-200 z-20">
                            N:N (Relacionamento Muitos-para-Muitos)
                        </div>
                        <TableCard title="tb_playlist_songs" color="bg-gray-100">
                            <Column name="playlist_id" type="BIGINT" isFk fkRef="tb_playlists.id" />
                            <Column name="song_id" type="BIGINT" isFk fkRef="tb_songs.id" />
                        </TableCard>
                        
                        {/* Conector para a música (lado direito) */}
                        <div className="hidden md:block absolute top-1/2 right-0 w-20 h-px bg-coffee-300 translate-x-10 translate-y-8 z-0"></div>
                    </div>

                    {/* Lado Direito: Músicas */}
                    <div className="flex flex-col items-center relative">
                        <div className="absolute -top-10 h-10 w-px bg-coffee-300"></div>
                        <div className="text-xs bg-white text-coffee-400 font-mono mb-2 mt-4">
                            1:N (Um álbum tem N Músicas)
                        </div>
                        <TableCard title="tb_songs" color="bg-red-100">
                            <Column name="id" type="BIGINT" isPk />
                            <Column name="title" type="VARCHAR(255)" />
                            <Column name="duration" type="INT" />
                            <Column name="url" type="VARCHAR(255)" />
                            <Column name="album_id" type="BIGINT" isFk fkRef="tb_albums.id" />
                        </TableCard>
                    </div>
                </div>

            </div>

            {/* Legenda */}
            <div className="fixed bottom-8  right-8 bg-white p-4 rounded-xl shadow-lg border border-coffee-200">
                <h4 className="font-bold text-coffee-800 text-sm mb-2">Legenda</h4>
                <div className="flex flex-col gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <Key size={12} className="text-yellow-600" /> 
                        <span>PK (Primary Key)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link size={12} className="text-blue-500" /> 
                        <span>FK (Foreign Key)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatabaseSchema;