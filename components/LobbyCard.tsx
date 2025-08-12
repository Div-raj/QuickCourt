import React from 'react';
import { Link } from 'react-router-dom';
import { Lobby } from '../types';
import { UsersIcon } from './icons';

interface LobbyCardProps {
  lobby: Lobby;
}

const LobbyCard: React.FC<LobbyCardProps> = ({ lobby }) => {
  const lastMessage = lobby.chat[lobby.chat.length - 1];

  return (
    <Link to={`/lobbies/${lobby.id}`} className="bg-surface rounded-2xl shadow-lg-soft hover:shadow-xl-soft transition-all duration-300 flex flex-col group overflow-hidden border border-border/50 hover:border-accent/30 hover:-translate-y-1">
      <div className="relative">
        <img className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" src={lobby.avatar} alt={lobby.name} />
        <div className="absolute top-3 right-3 bg-secondary/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
          <UsersIcon className="w-4 h-4" />
          {lobby.members.length} Member{lobby.members.length !== 1 && 's'}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-secondary truncate" title={lobby.name}>{lobby.name}</h3>
        <p className="text-sm text-secondary/70 mt-1 flex-grow">{lobby.description}</p>
        
        <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-secondary/60 mb-1">Last message:</p>
            {lastMessage && (
                <div className="flex items-center gap-2">
                    <img src={lastMessage.user.avatar} alt={lastMessage.user.fullName} className="w-6 h-6 rounded-full"/>
                    <p className="text-sm text-secondary/80 truncate">
                      <span className="font-semibold">{lastMessage.user.fullName}:</span> {lastMessage.text}
                    </p>
                </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default LobbyCard;
