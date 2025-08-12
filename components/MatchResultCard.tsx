import React from 'react';
import { Match } from '../types';
import { MedalIcon } from './icons';

interface MatchResultCardProps {
    match: Match;
}

const MatchResultCard: React.FC<MatchResultCardProps> = ({ match }) => {
    const isTeamMatch = match.teamA || match.teamB;

    const renderPlayerTag = (player: string) => (
        <div key={player} className="bg-surface text-secondary text-sm font-semibold px-3 py-1 rounded-full border border-border">
            {player}
        </div>
    );

    return (
        <div className="bg-primary/40 p-4 rounded-xl border border-border/60">
            <div className="flex justify-between items-center mb-3 border-b border-border/50 pb-2">
                <h4 className="font-bold text-secondary capitalize">{match.sport}</h4>
                <p className="text-xs text-secondary/70 font-medium">
                    {new Date(match.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
            
            {isTeamMatch ? (
                // Team Match View
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-center">
                        <div className="flex-1 w-full">
                            <h5 className="font-bold text-secondary mb-2">Team A</h5>
                            <div className="flex flex-wrap gap-2 justify-center min-h-[34px]">
                                {match.teamA?.map(renderPlayerTag)}
                                {match.teamA?.length === 0 && <p className="text-xs text-secondary/60 self-center">No players</p>}
                            </div>
                        </div>
                        <div className="font-bold text-2xl text-secondary/50">VS</div>
                         <div className="flex-1 w-full">
                            <h5 className="font-bold text-secondary mb-2">Team B</h5>
                            <div className="flex flex-wrap gap-2 justify-center min-h-[34px]">
                                {match.teamB?.map(renderPlayerTag)}
                                {match.teamB?.length === 0 && <p className="text-xs text-secondary/60 self-center">No players</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-border/50 gap-2">
                        {match.score ? (
                            <p className="font-bold text-2xl text-secondary order-2 sm:order-1">{match.score}</p>
                        ) : <div className="order-2 sm:order-1"></div>}
                        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full order-1 sm:order-2">
                            <MedalIcon className="w-5 h-5 text-yellow-500" />
                            <span className="font-bold text-sm">Winner: {match.winningTeam}</span>
                        </div>
                    </div>
                </div>
            ) : (
                // Individual Match View
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div>
                        <h5 className="text-xs font-bold text-secondary/70 mb-2">Participants</h5>
                        <div className="flex items-center gap-2 flex-wrap">
                            {match.participants?.map(renderPlayerTag)}
                        </div>
                    </div>
                    {match.score && <p className="font-bold text-2xl text-secondary mt-2 sm:mt-0">{match.score}</p>}
                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full mt-2 sm:mt-0 self-center mx-auto sm:mx-0 sm:self-auto shrink-0">
                        <MedalIcon className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold text-sm">Winner: {match.winner}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchResultCard;