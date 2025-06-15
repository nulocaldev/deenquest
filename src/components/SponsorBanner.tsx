import React from 'react';

// Example sponsors data
const sponsors = [
  {
    name: 'Halal Bank',
    logoUrl: '/sponsors/halalbank.png',
    website: 'https://halalbank.com',
    message: 'Proudly supporting youth education!',
    minAge: 13,
    maxAge: 99,
    locations: ['USA', 'Canada'],
    active: true,
  },
  {
    name: 'Qibla Tech',
    logoUrl: '/sponsors/qiblatech.png',
    website: 'https://qiblatech.com',
    message: 'Innovating for the Ummah.',
    minAge: 0,
    maxAge: 18,
    locations: ['UK'],
    active: true,
  },
];

function filterSponsors({ age, country }) {
  return sponsors.filter(s =>
    s.active &&
    age >= s.minAge &&
    age <= s.maxAge &&
    (!s.locations.length || s.locations.includes(country))
  );
}

export default function SponsorBanner({ age, country }) {
  const filtered = filterSponsors({ age, country });
  if (!filtered.length) return null;
  return (
    <div className="flex flex-col gap-4 my-4">
      {filtered.map(s => (
        <a key={s.name} href={s.website} target="_blank" rel="noopener noreferrer" className="block border rounded p-4 bg-gray-50 hover:bg-gray-100">
          <div className="flex items-center gap-4">
            <img src={s.logoUrl} alt={s.name} className="h-12 w-12 object-contain" />
            <div>
              <div className="font-bold text-lg">{s.name}</div>
              <div className="text-sm text-gray-700">{s.message}</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
