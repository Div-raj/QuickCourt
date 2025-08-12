import React, { useState, useEffect } from 'react';
import { Venue } from '../../types';
import { MOCK_VENUES } from '../../constants';
import { CheckCircleIcon, CloseIcon, EyeIcon } from '../../components/icons';

const FacilityApproval: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        // In a real app, this would fetch from an API. Here we use mocks.
        const allVenues: Venue[] = MOCK_VENUES;
        // Load from local storage if available to persist changes across sessions
        try {
            const storedVenuesRaw = localStorage.getItem('quickcourt_venues');
            if (storedVenuesRaw) {
                setVenues(JSON.parse(storedVenuesRaw));
            } else {
                localStorage.setItem('quickcourt_venues', JSON.stringify(allVenues));
                setVenues(allVenues);
            }
        } catch (error) {
            console.error("Failed to load venues from localStorage", error);
            setVenues(allVenues);
        }
    }, []);
    
    const updateVenues = (updatedVenues: Venue[]) => {
        setVenues(updatedVenues);
        localStorage.setItem('quickcourt_venues', JSON.stringify(updatedVenues));
    };

    const handleApproval = (venueId: string, newStatus: 'approved' | 'rejected') => {
        const updatedVenues = venues.map(v => 
            v.id === venueId ? { ...v, status: newStatus } : v
        );
        updateVenues(updatedVenues);
        // In a real app, you would send the rejectionReason to the facilitator.
        if (newStatus === 'rejected') {
            console.log(`Venue ${venueId} rejected with reason: ${rejectionReason}`);
        }
        setSelectedVenue(null);
        setRejectionReason('');
    };
    
    const pendingVenues = venues.filter(v => v.status === 'pending');

    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Facility Approval Queue</h1>
                <p className="text-gray-600">Review and moderate new venue submissions.</p>

                <div className="mt-6 overflow-x-auto">
                    {pendingVenues.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingVenues.map(venue => (
                                    <tr key={venue.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venue.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venue.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venue.submittedBy}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            <button onClick={() => setSelectedVenue(venue)} className="text-blue-600 hover:text-blue-900" title="Review">
                                                <EyeIcon className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => handleApproval(venue.id, 'approved')} className="text-green-600 hover:text-green-900" title="Approve">
                                                <CheckCircleIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setSelectedVenue(venue)} className="text-red-600 hover:text-red-900" title="Reject">
                                                <CloseIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="text-center py-12">
                            <p className="text-gray-500">No pending venues for approval.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {selectedVenue && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 sticky top-0 bg-white border-b z-10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">{selectedVenue.name}</h2>
                            <button onClick={() => setSelectedVenue(null)} className="p-1 rounded-full hover:bg-gray-200">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <img src={selectedVenue.images[0]} alt={selectedVenue.name} className="w-full h-64 object-cover rounded-md bg-gray-200" />
                            <p><span className="font-semibold">Location:</span> {selectedVenue.location}</p>
                            <p><span className="font-semibold">Price/hr:</span> ₹{selectedVenue.pricePerHour}</p>
                            <p><span className="font-semibold">Sports:</span> {selectedVenue.sports.join(', ')}</p>
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Rejection Reason (if applicable)</h3>
                                <textarea 
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g., Photos are unclear, address is invalid..."
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3 sticky bottom-0">
                            <button onClick={() => handleApproval(selectedVenue.id, 'rejected')} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400" disabled={!rejectionReason}>Reject</button>
                            <button onClick={() => handleApproval(selectedVenue.id, 'approved')} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">Approve</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FacilityApproval;
