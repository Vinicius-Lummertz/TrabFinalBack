import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Playlists from './pages/Playlists';
import UploadSong from './pages/UploadSong'
import PlaylistDetails from './pages/PlaylistDetails';
import DatabaseSchema from './pages/DatabaseSchema'; 

const Settings = () => <div className="text-center mt-10">Configurações (Em breve)</div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:id" element={<PlaylistDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/upload" element={<UploadSong />} />
            <Route path="/database" element={<DatabaseSchema />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; 