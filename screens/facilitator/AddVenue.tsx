
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPORTS, AMENITIES } from '../../constants';
import { CloseIcon } from '../../components/icons';

const AddVenue: React.FC = () => {
    const navigate = useNavigate();
    const [selectedSports, setSelectedSports] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [venueImages, setVenueImages] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleSportToggle = (sportName: string) => {
        setSelectedSports(prev => 
            prev.includes(sportName) ? prev.filter(s => s !== sportName) : [...prev, sportName]
        );
    };

    const handleAmenityToggle = (amenityName: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenityName) ? prev.filter(a => a !== amenityName) : [...prev, amenityName]
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setVenueImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setVenueImages(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
            e.dataTransfer.clearData();
        }
    };
    
    const removeImage = (index: number) => {
        setVenueImages(prev => prev.filter((_, i) => i !== index));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit the form data (including venueImages) to the backend
        alert("Venue submitted for approval! You will be notified once it's reviewed.");
        navigate('/facilitator/dashboard');
    };
    
    const commonInputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary";
    const commonLabelClass = "block text-sm font-bold text-gray-700 mb-1";


    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Add a New Venue</h1>
                <p className="text-lg text-gray-600 mb-8">Fill out the details below to list your sports facility on QuickCourt.</p>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="venueName" className={commonLabelClass}>Venue Name</label>
                            <input type="text" id="venueName" required className={commonInputClass} />
                        </div>
                         <div>
                            <label htmlFor="venueAddress" className={commonLabelClass}>Full Address</label>
                            <input type="text" id="venueAddress" required className={commonInputClass} placeholder="e.g., 123 Sports Lane, Hyderabad"/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className={commonLabelClass}>Description</label>
                        <textarea id="description" rows={4} className={commonInputClass} placeholder="Tell players what makes your venue special..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="hours" className={commonLabelClass}>Operating Hours</label>
                            <input type="text" id="hours" className={commonInputClass} placeholder="e.g., 7:00 AM - 10:00 PM"/>
                        </div>
                        <div>
                            <label htmlFor="price" className={commonLabelClass}>Starting Price (per hour)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                                <input type="number" id="price" className={`${commonInputClass} pl-7`} placeholder="e.g., 500"/>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className={commonLabelClass}>Sports Supported</h3>
                        <p className="text-xs text-gray-500 mb-2">Select all that apply.</p>
                        <div className="flex flex-wrap gap-2">
                           {SPORTS.map(sport => (
                               <button type="button" key={sport.name} onClick={() => handleSportToggle(sport.name)}
                                className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors ${selectedSports.includes(sport.name) ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                   {sport.name}
                               </button>
                           ))}
                        </div>
                    </div>
                    
                     <div>
                        <h3 className={commonLabelClass}>Amenities Offered</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                           {AMENITIES.map(amenity => (
                               <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                   <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                                   <span className="text-sm text-gray-600">{amenity}</span>
                               </label>
                           ))}
                        </div>
                    </div>

                    <div>
                        <label className={commonLabelClass}>Venue Photos</label>
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-primary bg-primary-light' : 'border-gray-300'}`}
                        >
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                    <span>Upload files</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/png, image/jpeg" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                        </div>
                         {venueImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {venueImages.map((file, index) => (
                                    <div key={index} className="relative group border rounded-lg p-2 bg-gray-50">
                                        <p className="text-sm text-gray-800 font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            aria-label={`Remove ${file.name}`}
                                        >
                                           <CloseIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="pt-5">
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={() => navigate('/facilitator/dashboard')} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                                Submit for Approval
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVenue;
