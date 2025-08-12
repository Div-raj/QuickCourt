import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lobby, PlayerStats } from '../types';
import { MOCK_LOBBIES } from '../constants';
import LobbyCard from '../components/LobbyCard';
import { useAuth } from '../hooks/useAuth';
import { CloseIcon } from '../components/icons';

const Lobbies: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [lobbies, setLobbies] = useState<Lobby[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newLobbyName, setNewLobbyName] = useState('');
    const [newLobbyDesc, setNewLobbyDesc] = useState('');

    useEffect(() => {
        try {
            const storedLobbiesRaw = localStorage.getItem('quickcourt_lobbies');
            if (storedLobbiesRaw) {
                setLobbies(JSON.parse(storedLobbiesRaw));
            } else {
                localStorage.setItem('quickcourt_lobbies', JSON.stringify(MOCK_LOBBIES));
                setLobbies(MOCK_LOBBIES);
            }
        } catch (error) {
            console.error("Failed to load lobbies from localStorage", error);
            setLobbies(MOCK_LOBBIES);
        }
    }, []);
    
    const handleCreateLobby = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLobbyName.trim() || !user) return;

        const creatorName = user.fullName;
        const newLobby: Lobby = {
            id: `lobby-${Date.now()}`,
            name: newLobbyName,
            description: newLobbyDesc,
            avatar: `https://source.unsplash.com/400x400/?sports,${newLobbyName}`,
            adminId: user.id,
            members: [creatorName], // Automatically add creator as the first member
            chat: [{
                id: `chat-${Date.now()}`,
                user: { fullName: 'System', avatar: '' },
                text: `Lobby created by ${creatorName}.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }],
            matches: [],
            stats: [{
                playerName: creatorName,
                matchesPlayed: 0,
                wins: 0,
                losses: 0,
                draws: 0,
            }],
        };
        
        setLobbies(prevLobbies => {
            const updatedLobbies = [...prevLobbies, newLobby];
            localStorage.setItem('quickcourt_lobbies', JSON.stringify(updatedLobbies));
            return updatedLobbies;
        });
        
        setIsCreateModalOpen(false);
        setNewLobbyName('');
        setNewLobbyDesc('');
        navigate(`/lobbies/${newLobby.id}`);
    };

    return (
        <>
            <div className="bg-primary min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-secondary">My Lobbies</h1>
                            <p className="text-lg text-secondary/70 mt-1">Your private groups for chat and match tracking.</p>
                        </div>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-all transform hover:scale-105 duration-300 shadow-lg-accent">
                            + Create Lobby
                        </button>
                    </div>
                    
                    {lobbies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {lobbies.map(lobby => (
                                <LobbyCard key={lobby.id} lobby={lobby} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 px-4 bg-surface rounded-lg shadow-lg-soft border border-border">
                            <h2 className="text-2xl font-bold text-secondary">No Lobbies Yet</h2>
                            <p className="text-secondary/70 mt-2">Create your first lobby to start connecting with your friends!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Lobby Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
                    <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all border border-border">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-secondary">Create a New Lobby</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-full hover:bg-secondary/10">
                                <CloseIcon className="w-6 h-6 text-secondary/70" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateLobby} className="space-y-4">
                            <div>
                                <label htmlFor="lobbyName" className="block text-sm font-bold text-secondary mb-2">Lobby Name</label>
                                <input id="lobbyName" type="text" value={newLobbyName} onChange={e => setNewLobbyName(e.target.value)} required 
                                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent text-secondary bg-primary/40"
                                    placeholder="e.g., Weekend Warriors"
                                />
                            </div>
                             <div>
                                <label htmlFor="lobbyDesc" className="block text-sm font-bold text-secondary mb-2">Description</label>
                                <textarea id="lobbyDesc" value={newLobbyDesc} onChange={e => setNewLobbyDesc(e.target.value)}
                                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent text-secondary bg-primary/40"
                                    rows={3}
                                    placeholder="e.g., Casual football games every Sunday."
                                ></textarea>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-accent text-white font-bold py-3 rounded-lg text-lg hover:bg-accent-dark transition-colors shadow-lg-accent">
                                    Create Lobby
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Lobbies;