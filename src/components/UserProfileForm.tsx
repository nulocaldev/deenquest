import React, { useState } from 'react';

interface Profile {
  birthdate: string;
  location: string;
}

interface UserProfileFormProps {
  onProfileSaved?: (data: { age: number; country: string }) => void;
}

interface SubmitProfileResult {
  success: boolean;
}

// Mock API call
const submitProfile = async (profile: Profile): Promise<SubmitProfileResult> => {
  // Replace with real API call
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
};

export default function UserProfileForm({ onProfileSaved }: UserProfileFormProps) {
  const [birthdate, setBirthdate] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Geolocation handler
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Use a geocoding API here to get city/country from lat/lng
        // For demo, just set as 'Detected Location'
        setLocation('Detected Location');
        setCity('');
        setCountry('');
      },
      () => setError('Unable to retrieve your location.')
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    if (!birthdate) {
      setError('Birthdate is required.');
      setLoading(false);
      return;
    }
    if (!location && (!city || !country)) {
      setError('Location is required.');
      setLoading(false);
      return;
    }
    // Privacy: show warning for under-13
    const age = getAge(birthdate);
    if (age < 13) {
      setError('You must be at least 13 years old to register.');
      setLoading(false);
      return;
    }
    // Submit
    const profile = { birthdate, location: location || `${city}, ${country}` };
    const res = await submitProfile(profile);
    if (res.success) {
      setSuccess(true);
      // Call onProfileSaved with age and country for downstream use
      if (onProfileSaved) {
        const extractedCountry = country || (location ? location.split(', ').pop() || '' : '');
        onProfileSaved({ age, country: extractedCountry });
      }
    }
    setLoading(false);
  };

  function getAge(birthdate: string) {
    const today = new Date();
    const dob = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      <label className="block mb-2">Birthdate *</label>
      <input
        type="date"
        value={birthdate}
        onChange={e => setBirthdate(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <label className="block mb-2">Location *</label>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={e => { setCity(e.target.value); setLocation(''); }}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={e => { setCountry(e.target.value); setLocation(''); }}
        className="w-full mb-2 p-2 border rounded"
      />
      <button type="button" onClick={handleGeolocate} className="mb-4 px-3 py-1 bg-blue-500 text-white rounded">Use My Location</button>
      {location && <div className="mb-2 text-green-700">Location: {location}</div>}
      <div className="text-xs text-gray-500 mb-4">
        We collect your birthdate and location to personalize your experience and comply with privacy laws. See our Privacy Policy for details.
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Profile saved!</div>}
      <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
