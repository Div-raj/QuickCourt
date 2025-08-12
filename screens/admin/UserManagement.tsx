import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { MOCK_ALL_USERS } from '../../constants';
import { SearchIcon } from '../../components/icons';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_ALL_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');

    const handleStatusChange = (userId: string, newStatus: 'active' | 'banned') => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            )
        );
        // In a real app, this would be an API call.
    };
    
    const filteredUsers = useMemo(() => {
        return users
            .filter(user => {
                if (roleFilter === 'all') return true;
                return user.role === roleFilter;
            })
            .filter(user => {
                const term = searchTerm.toLowerCase();
                return user.fullName.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
            });
    }, [users, searchTerm, roleFilter]);

    const RoleBadge: React.FC<{ role: User['role'] }> = ({ role }) => {
        const roleColors = {
            admin: 'bg-red-100 text-red-800',
            facilitator: 'bg-blue-100 text-blue-800',
            user: 'bg-green-100 text-green-800',
            owner: 'bg-purple-100 text-purple-800',
        };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[role]}`}>{role}</span>;
    };
    
    const StatusIndicator: React.FC<{ status: User['status'] }> = ({ status }) => {
        const statusColors = {
            active: 'bg-green-500',
            banned: 'bg-red-500',
            pending_approval: 'bg-yellow-500'
        }
        return <span className={`inline-block h-2 w-2 rounded-full ${status ? statusColors[status] : 'bg-gray-400'}`} title={status}></span>
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">View, filter, and manage all users on the platform.</p>

            {/* Filters */}
            <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary"
                    />
                </div>
                <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary"
                >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="facilitator">Facilitator</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* User Table */}
            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.fullName} />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <StatusIndicator status={user.status} />
                                        <span>{user.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    {user.role !== 'admin' && ( // Prevent banning other admins
                                        user.status === 'active' ? (
                                            <button onClick={() => handleStatusChange(user.id, 'banned')} className="text-red-600 hover:text-red-900 font-semibold">Ban</button>
                                        ) : (
                                            <button onClick={() => handleStatusChange(user.id, 'active')} className="text-green-600 hover:text-green-900 font-semibold">Unban</button>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredUsers.length === 0 && <p className="text-center text-gray-500 py-8">No users found with the current filters.</p>}
            </div>
        </div>
    );
};

export default UserManagement;
