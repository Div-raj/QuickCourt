import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lobby, ChatMessage, Match, User, PlayerStats } from '../types';
import { MOCK_LOBBIES, SPORTS } from '../constants';
import { useAuth } from '../hooks/useAuth';
import MatchResultCard from '../components/MatchResultCard';
import { CloseIcon, UsersIcon, ChevronUpIcon, ChevronDownIcon } from '../components/icons';

const ChatBubble: React.FC<{ message: ChatMessage; currentUser: User | null }> = ({ message, currentUser }) => {
    const isMe = message.user.fullName === currentUser?.fullName;
    const isSystem = message.user.fullName === 'System';

    if (isSystem) {
        return (
            <div className="text-center my-2">
                <p className="text-xs text-secondary/60 bg-primary/50 rounded-full inline-block px-3 py-1">{message.text}</p>
            </div>
        )
    }

    return (
        <div className={`flex items-end gap-2 my-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {!isMe && <img src={message.user.avatar} alt={message.user.fullName} className="w-8 h-8 rounded-full" />}
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && <p className="text-xs text-secondary/70 mb-1 ml-3">{message.user.fullName}</p>}
                <div className={`p-3 rounded-2xl max-w-xs md:max-w-md text-sm shadow-sm ${isMe ? 'bg-accent text-white rounded-br-none' : 'bg-surface text-secondary border border-border/70 rounded-bl-none'}`}>
                    <p>{message.text}</p>
                </div>
                <p className="text-xs text-secondary/60 mt-1">{message.timestamp}</p>
            </div>
            {isMe && <img src={message.user.avatar} alt={message.user.fullName} className="w-8 h-8 rounded-full" />}
        </div>
    );
};


const LobbyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [lobby, setLobby] = useState<Lobby | null>(null);
    const [lobbies, setLobbies] = useState<Lobby[]>([]);
    const [activeTab, setActiveTab] = useState('chat');
    
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Modal states
    const [isLogMatchModalOpen, setIsLogMatchModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

    // Add Member state
    const [newMemberName, setNewMemberName] = useState('');

    // Log Match state
    const [winner, setWinner] = useState('');
    const [score, setScore] = useState('');
    const [sport, setSport] = useState(SPORTS[0]?.name || 'Badminton');
    const [matchType, setMatchType] = useState<'individual' | 'team'>('individual');
    const [winningTeam, setWinningTeam] = useState<'Team A' | 'Team B' | 'Draw' | ''>('');
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    const [teamAssignments, setTeamAssignments] = useState<Record<string, 'A' | 'B'>>({});
    
    // Leaderboard state
    const [sortConfig, setSortConfig] = useState<{ key: keyof PlayerStats | 'winRate', direction: 'ascending' | 'descending' }>({ key: 'wins', direction: 'descending' });

    
    useEffect(() => {
        try {
            const storedLobbiesRaw = localStorage.getItem('quickcourt_lobbies');
            const allLobbies: Lobby[] = storedLobbiesRaw ? JSON.parse(storedLobbiesRaw) : MOCK_LOBBIES;
            setLobbies(allLobbies);
            const currentLobby = allLobbies.find(l => l.id === id) || null;
            setLobby(currentLobby);
        } catch (error) {
            console.error("Failed to load lobby details from localStorage", error);
        }
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lobby?.chat.length]);

    const updateLobbyState = (updatedLobby: Lobby) => {
        setLobby(updatedLobby);
        const updatedLobbies = lobbies.map(l => l.id === updatedLobby.id ? updatedLobby : l);
        setLobbies(updatedLobbies);
        localStorage.setItem('quickcourt_lobbies', JSON.stringify(updatedLobbies));
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !lobby) return;

        const message: ChatMessage = {
            id: `cm-${Date.now()}`,
            user: { fullName: user.fullName, avatar: user.avatar },
            text: newMessage,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        
        const updatedLobby = { ...lobby, chat: [...lobby.chat, message] };
        updateLobbyState(updatedLobby);
        setNewMessage('');
    };
    
    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberName.trim() || !lobby) return;

        const trimmedName = newMemberName.trim();
        if (lobby.members.map(m => m.toLowerCase()).includes(trimmedName.toLowerCase())) {
            alert(`${trimmedName} is already in the lobby.`);
            return;
        }

        const updatedMembers = [...lobby.members, trimmedName];
        
        const currentStats = lobby.stats || [];
        const updatedStats = [...currentStats, {
            playerName: trimmedName,
            matchesPlayed: 0, wins: 0, losses: 0, draws: 0
        }];
        
        const joinMessage: ChatMessage = {
            id: `cm-join-${Date.now()}`,
            user: { fullName: 'System', avatar: '' },
            text: `${trimmedName} has been added to the lobby.`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        
        const updatedLobby: Lobby = { 
            ...lobby, 
            members: updatedMembers,
            chat: [...lobby.chat, joinMessage],
            stats: updatedStats,
        };
        
        updateLobbyState(updatedLobby);
        
        setIsAddMemberModalOpen(false);
        setNewMemberName('');
    };
    
    const openLogMatchModal = () => {
        setMatchType('individual');
        setSport(SPORTS[0]?.name || 'Badminton');
        setSelectedParticipants([]);
        setTeamAssignments({});
        setWinner('');
        setScore('');
        setWinningTeam('');
        setIsLogMatchModalOpen(true);
    };
    
    const handleIndividualParticipantToggle = (name: string) => {
        setSelectedParticipants(prev => {
            const isSelected = prev.includes(name);
            if (isSelected && winner === name) {
                setWinner('');
            }
            return isSelected ? prev.filter(p => p !== name) : [...prev, name];
        });
    };

    const handleTeamAssignmentCycle = (name: string) => {
        setTeamAssignments(prev => {
            const currentAssignment = prev[name];
            const newAssignments = {...prev};
            if (currentAssignment === 'A') {
                newAssignments[name] = 'B';
            } else if (currentAssignment === 'B') {
                delete newAssignments[name];
            } else {
                newAssignments[name] = 'A';
            }
            return newAssignments;
        });
    };

    const handleLogMatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!lobby) return;

        let newMatch: Match;
        let allParticipants: string[] = [];

        if (matchType === 'team') {
            const teamA = Object.keys(teamAssignments).filter(member => teamAssignments[member] === 'A');
            const teamB = Object.keys(teamAssignments).filter(member => teamAssignments[member] === 'B');
            allParticipants = [...teamA, ...teamB];

            if (allParticipants.length === 0) {
                alert("Please assign players to at least one team.");
                return;
            }
            if (!winningTeam) {
                alert("Please select the winning team or 'Draw'.");
                return;
            }
            newMatch = {
                id: `match-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                sport,
                teamA,
                teamB,
                winningTeam,
                score,
            };
        } else {
            allParticipants = selectedParticipants;
            if (selectedParticipants.length < 1) {
                alert("Please select at least one participant.");
                return;
            }
            if (!winner) {
                 alert("Please select a winner from the participants.");
                return;
            }
            newMatch = {
                id: `match-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                sport,
                participants: selectedParticipants,
                winner,
                score,
            };
        }
        
        const updatedStats = JSON.parse(JSON.stringify(lobby.stats || []));
        allParticipants.forEach(playerName => {
            let playerStats = updatedStats.find((s: PlayerStats) => s.playerName === playerName);
            if (!playerStats) {
                playerStats = { playerName, matchesPlayed: 0, wins: 0, losses: 0, draws: 0 };
                updatedStats.push(playerStats);
            }
            playerStats.matchesPlayed++;
            
            if (matchType === 'team') {
                if (newMatch.winningTeam === 'Draw') {
                    playerStats.draws++;
                } else if ((newMatch.winningTeam === 'Team A' && newMatch.teamA?.includes(playerName)) || (newMatch.winningTeam === 'Team B' && newMatch.teamB?.includes(playerName))) {
                    playerStats.wins++;
                } else {
                    playerStats.losses++;
                }
            } else { // Individual
                if (newMatch.winner === playerName) {
                    playerStats.wins++;
                } else {
                    playerStats.losses++;
                }
            }
        });


        const updatedLobby = { ...lobby, matches: [newMatch, ...lobby.matches], stats: updatedStats };
        updateLobbyState(updatedLobby);
        setIsLogMatchModalOpen(false);
    };
    
    const sortedStats = useMemo(() => {
        let sortableStats = [...(lobby?.stats || [])];
        if (sortConfig !== null) {
            sortableStats.sort((a, b) => {
                let aValue: number;
                let bValue: number;
                
                if (sortConfig.key === 'winRate') {
                    aValue = a.matchesPlayed > 0 ? (a.wins / a.matchesPlayed) : -1;
                    bValue = b.matchesPlayed > 0 ? (b.wins / b.matchesPlayed) : -1;
                } else {
                    aValue = a[sortConfig.key as keyof PlayerStats] as number;
                    bValue = b[sortConfig.key as keyof PlayerStats] as number;
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableStats;
    }, [lobby?.stats, sortConfig]);

    const requestSort = (key: keyof PlayerStats | 'winRate') => {
        let direction: 'ascending' | 'descending' = 'descending';
        if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };


    if (!lobby) {
        return <div className="text-center py-20 bg-primary">Lobby not found or loading...</div>;
    }
    
    const isCurrentUserMember = user ? lobby.members.includes(user.fullName) : false;
    
    const tabs = [
        { id: 'chat', label: 'Chat' },
        { id: 'matches', label: 'Matches' },
        { id: 'leaderboard', label: 'Leaderboard' },
        { id: 'members', label: 'Members' },
    ];

    const renderIndividualSelector = () => (
        <div>
            <label className="block text-sm font-bold text-secondary mb-2">Select Participants</label>
            <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-primary/40 border border-border">
                {lobby.members.map(member => (
                    <button 
                        type="button" 
                        key={member}
                        onClick={() => handleIndividualParticipantToggle(member)}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                            selectedParticipants.includes(member) 
                            ? 'bg-accent text-white ring-2 ring-accent-dark' 
                            : 'bg-surface text-secondary hover:bg-secondary/10'
                        }`}
                    >
                        {member}
                    </button>
                ))}
            </div>
        </div>
    );
    
    const renderTeamSelector = () => (
         <div>
            <label className="block text-sm font-bold text-secondary mb-2">Assign Players to Teams</label>
            <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-primary/40 border border-border">
                {lobby.members.map(member => {
                    const assignment = teamAssignments[member];
                    const baseClass = "px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-150";
                    let teamClass = 'bg-surface text-secondary hover:bg-secondary/10'; // Unassigned
                    if (assignment === 'A') {
                        teamClass = 'bg-blue-500 text-white ring-2 ring-blue-700'; // Team A
                    } else if (assignment === 'B') {
                        teamClass = 'bg-red-500 text-white ring-2 ring-red-700'; // Team B
                    }
                    return (
                        <button 
                            type="button" 
                            key={member}
                            onClick={() => handleTeamAssignmentCycle(member)}
                            className={`${baseClass} ${teamClass}`}
                        >
                            {member}
                        </button>
                    )
                })}
            </div>
            <div className="flex justify-between mt-2 text-xs px-1">
                 <p className="flex items-center"><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span>Team A</p>
                 <p className="flex items-center"><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1.5"></span>Team B</p>
                 <p className="flex items-center"><span className="inline-block w-3 h-3 rounded-full bg-surface border border-gray-400 mr-1.5"></span>Unassigned</p>
            </div>
        </div>
    );


    return (
        <>
        <div className="bg-primary min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {/* Lobby Header */}
                <div className="bg-surface rounded-t-2xl p-6 shadow-xl-soft border-x border-t border-border flex items-center gap-6">
                    <img src={lobby.avatar} alt={lobby.name} className="w-24 h-24 rounded-2xl object-cover" />
                    <div>
                        <h1 className="text-3xl font-extrabold text-secondary">{lobby.name}</h1>
                        <p className="text-md text-secondary/80 mt-1">{lobby.description}</p>
                        <div className="flex items-center text-sm text-secondary/60 mt-2">
                            <UsersIcon className="w-4 h-4 mr-2"/>
                            <span>{lobby.members.length} member{lobby.members.length !== 1 && 's'}</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-surface shadow-xl-soft border-x border-border">
                    <div className="border-b border-border px-6">
                        <nav className="-mb-px flex space-x-6 overflow-x-auto">
                             {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap py-3 px-1 border-b-4 text-sm font-bold transition-colors ${activeTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-secondary/50 hover:text-secondary'}`}>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-surface rounded-b-2xl shadow-xl-soft border-x border-b border-border">
                    {activeTab === 'chat' && (
                        <div className="flex flex-col h-[65vh]">
                            <div className="flex-grow p-4 overflow-y-auto bg-primary/30">
                                {lobby.chat.map(msg => <ChatBubble key={msg.id} message={msg} currentUser={user} />)}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="p-4 border-t border-border">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                        disabled={!isCurrentUserMember}
                                        placeholder={isCurrentUserMember ? `Message in #${lobby.name}` : "You must be a member to chat"}
                                        className="w-full p-3 border border-border rounded-full focus:ring-2 focus:ring-accent transition bg-primary/30 text-secondary disabled:bg-secondary/10 disabled:cursor-not-allowed" />
                                    <button type="submit"
                                        disabled={!isCurrentUserMember}
                                        className="bg-accent text-white font-semibold rounded-full p-3 hover:bg-accent-dark transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.949a.75.75 0 0 0 .95.534h6.056a.75.75 0 0 1 0 1.5H4.644a.75.75 0 0 0-.95.534l-1.414 4.949a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" /></svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'matches' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-secondary">Match History</h2>
                                <button onClick={openLogMatchModal} className="bg-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-accent-dark transition">Log New Match</button>
                            </div>
                            {lobby.matches.length > 0 ? (
                                <div className="space-y-4">
                                    {[...lobby.matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(match => <MatchResultCard key={match.id} match={match} />)}
                                </div>
                            ) : (
                                <p className="text-center text-secondary/70 py-8">No matches logged yet. Play a game and log the result!</p>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'leaderboard' && (
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-secondary mb-4">Leaderboard</h2>
                             <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-secondary">
                                    <thead className="text-xs text-secondary/70 uppercase bg-primary/40">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Player</th>
                                            {Object.entries({ matchesPlayed: 'MP', wins: 'W', losses: 'L', draws: 'D', winRate: 'Win %' }).map(([key, label]) => (
                                                <th key={key} scope="col" className="px-6 py-3 text-center">
                                                    <button onClick={() => requestSort(key as any)} className="flex items-center justify-center gap-1 w-full group">
                                                        {label}
                                                        <span className="opacity-30 group-hover:opacity-100 transition-opacity">
                                                            {sortConfig.key === key ? (
                                                                sortConfig.direction === 'ascending' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                                            ) : <ChevronDownIcon />}
                                                        </span>
                                                    </button>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedStats.map((player) => (
                                            <tr key={player.playerName} className="bg-surface border-b border-border/50 hover:bg-primary/30">
                                                <th scope="row" className="px-6 py-4 font-bold text-secondary whitespace-nowrap">{player.playerName}</th>
                                                <td className="px-6 py-4 text-center">{player.matchesPlayed}</td>
                                                <td className="px-6 py-4 text-center font-semibold text-green-600">{player.wins}</td>
                                                <td className="px-6 py-4 text-center font-semibold text-red-600">{player.losses}</td>
                                                <td className="px-6 py-4 text-center font-semibold text-yellow-600">{player.draws}</td>
                                                <td className="px-6 py-4 text-center font-bold">
                                                    {player.matchesPlayed > 0 ? `${Math.round((player.wins / player.matchesPlayed) * 100)}%` : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'members' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-secondary">Lobby Members ({lobby.members.length})</h2>
                                {user?.id === lobby.adminId && (
                                    <button onClick={() => setIsAddMemberModalOpen(true)} className="bg-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-accent-dark transition">
                                        + Add Members
                                    </button>
                                )}
                            </div>
                            {lobby.members.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {lobby.members.map(member => (
                                        <div key={member} className="bg-primary/40 p-3 rounded-lg flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-border">
                                                <UsersIcon className="w-6 h-6 text-secondary/60"/>
                                            </div>
                                            <span className="font-semibold text-secondary">{member}</span>
                                            {user?.id === lobby.adminId && user.fullName === member && (
                                                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full ml-auto">Admin</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                 <p className="text-center text-secondary/70 py-8">This lobby has no members yet. Add some people to get started!</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Log Match Modal */}
        {isLogMatchModalOpen && (
             <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true">
                <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all border border-border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-secondary">Log a Match Result</h2>
                        <button onClick={() => setIsLogMatchModalOpen(false)} className="p-1 rounded-full hover:bg-secondary/10"><CloseIcon className="w-6 h-6 text-secondary/70" /></button>
                    </div>
                    <form onSubmit={handleLogMatch} className="space-y-6">
                         <div>
                            <label htmlFor="sport" className="block text-sm font-bold text-secondary mb-2">Sport</label>
                            <select id="sport" value={sport} onChange={e => setSport(e.target.value)} required 
                                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent text-secondary bg-primary/40">
                                {SPORTS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-secondary mb-2">Match Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button type="button" onClick={() => setMatchType('individual')} className={`w-full p-3 rounded-lg font-bold text-sm transition-colors ${matchType === 'individual' ? 'bg-accent text-white ring-2 ring-offset-2 ring-accent' : 'bg-primary/40 text-secondary hover:bg-secondary/10'}`}>
                                    Individual
                                </button>
                                <button type="button" onClick={() => setMatchType('team')} className={`w-full p-3 rounded-lg font-bold text-sm transition-colors ${matchType === 'team' ? 'bg-accent text-white ring-2 ring-offset-2 ring-accent' : 'bg-primary/40 text-secondary hover:bg-secondary/10'}`}>
                                    Team vs Team
                                </button>
                            </div>
                        </div>

                        {matchType === 'team' ? renderTeamSelector() : renderIndividualSelector()}
                        
                        {matchType === 'team' ? (
                            <div>
                                <label className="block text-sm font-bold text-secondary mb-2">Who Won?</label>
                                <select value={winningTeam} onChange={e => setWinningTeam(e.target.value as any)} required 
                                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent text-secondary bg-primary/40">
                                        <option value="" disabled>Select a winner...</option>
                                        <option value="Team A">Team A</option>
                                        <option value="Team B">Team B</option>
                                        <option value="Draw">Draw</option>
                                </select>
                            </div>
                        ) : (
                            selectedParticipants.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-2">Who Won?</label>
                                    <select value={winner} onChange={e => setWinner(e.target.value)} required 
                                        className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent text-secondary bg-primary/40">
                                            <option value="" disabled>Select a winner...</option>
                                        {selectedParticipants.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            )
                        )}
                        
                        <div>
                            <label htmlFor="score" className="block text-sm font-bold text-secondary mb-2">Score (Optional)</label>
                            <input id="score" type="text" value={score} onChange={e => setScore(e.target.value)} 
                                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent text-secondary bg-primary/40" placeholder="e.g., 2-1 or 21-15"/>
                        </div>
                        <div className="pt-4"><button type="submit" className="w-full bg-accent text-white font-bold py-3 rounded-lg text-lg hover:bg-accent-dark transition-colors shadow-lg-accent">Confirm & Log Match</button></div>
                    </form>
                </div>
            </div>
        )}

        {/* Add Member Modal */}
        {isAddMemberModalOpen && (
             <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true">
                <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all border border-border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-secondary">Add New Member</h2>
                        <button onClick={() => setIsAddMemberModalOpen(false)} className="p-1 rounded-full hover:bg-secondary/10"><CloseIcon className="w-6 h-6 text-secondary/70" /></button>
                    </div>
                    <form onSubmit={handleAddMember} className="space-y-4">
                        <div>
                            <label htmlFor="memberName" className="block text-sm font-bold text-secondary mb-2">Member's Name</label>
                            <input id="memberName" type="text" value={newMemberName} onChange={e => setNewMemberName(e.target.value)}
                                   placeholder="Enter the full name" required
                                   className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent text-secondary bg-primary/40" />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="w-full bg-accent text-white font-bold py-3 rounded-lg text-lg hover:bg-accent-dark transition-colors shadow-lg-accent">
                                Add Member
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
};

export default LobbyDetails;