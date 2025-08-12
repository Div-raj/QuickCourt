import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { EyeIcon, EyeOffIcon } from '../../components/icons';

const AdminProfile: React.FC = () => {
    const { user } = useAuth();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    if (!user) {
        return <div>Loading...</div>;
    }
    
    const commonInputClass = "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent";
    const commonLabelClass = "block text-sm font-bold text-gray-700 mb-1";
    
    return (
         <div className="space-y-10">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">Admin Profile</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className={commonLabelClass}>Full Name</label>
                        <input id="fullName" type="text" defaultValue={user.fullName} className={commonInputClass} />
                    </div>
                    <div>
                        <label htmlFor="email" className={commonLabelClass}>Email Address</label>
                        <input id="email" type="email" defaultValue={user.email} className={`${commonInputClass} bg-gray-100 cursor-not-allowed`} readOnly />
                    </div>
                    <div>
                        <label htmlFor="avatar" className={commonLabelClass}>Avatar URL</label>
                        <input id="avatar" type="text" defaultValue={user.avatar} className={commonInputClass} />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="bg-secondary text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">Save Changes</button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                 <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">Change Password</h2>
                <form className="space-y-4">
                    <div className="relative">
                        <label htmlFor="oldPassword" className={commonLabelClass}>Old Password</label>
                        <input id="oldPassword" type={showOldPassword ? "text" : "password"} className={commonInputClass} />
                        <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute inset-y-0 right-0 top-6 pr-4 flex items-center">
                            {showOldPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>
                    <div className="relative">
                        <label htmlFor="newPassword" className={commonLabelClass}>New Password</label>
                        <input id="newPassword" type={showNewPassword ? "text" : "password"} className={commonInputClass} />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 top-6 pr-4 flex items-center">
                            {showNewPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="bg-secondary text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">Update Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
