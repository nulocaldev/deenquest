import React, { useState } from 'react';
import UserProfileForm from './UserProfileForm';
import SponsorBanner from './SponsorBanner';

export default function ProfileWithSponsors() {
  const [profile, setProfile] = useState(null);

  // This would be set after profile form submission in a real app
  const handleProfileSaved = (data) => {
    setProfile(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <UserProfileForm onProfileSaved={handleProfileSaved} />
      {profile && (
        <SponsorBanner age={profile.age} country={profile.country} />
      )}
    </div>
  );
}
