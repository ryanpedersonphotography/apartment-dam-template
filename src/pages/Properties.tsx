import { useState } from 'react';
import PropertyCard from '../components/features/PropertyCard';

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOccupancy, setFilterOccupancy] = useState('all');

  const properties = [
    { name: 'Sunset Apartments', address: '123 Main St, City, ST', units: 48, occupancy: 92 },
    { name: 'Park View Complex', address: '456 Oak Ave, Town, ST', units: 72, occupancy: 96 },
    { name: 'Downtown Lofts', address: '789 Urban Blvd, Metro, ST', units: 36, occupancy: 89 },
    { name: 'Riverside Manor', address: '321 River Rd, Watertown, ST', units: 64, occupancy: 88 },
    { name: 'Garden Grove', address: '555 Garden Way, Suburbia, ST', units: 40, occupancy: 100 },
    { name: 'Metro Heights', address: '777 High St, Downtown, ST', units: 80, occupancy: 91 }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOccupancy = filterOccupancy === 'all' ||
      (filterOccupancy === 'high' && property.occupancy >= 90) ||
      (filterOccupancy === 'low' && property.occupancy < 90);
    
    return matchesSearch && matchesOccupancy;
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
          <p className="text-gray-600">Manage and view all your properties</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterOccupancy}
              onChange={(e) => setFilterOccupancy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Occupancy</option>
              <option value="high">High Occupancy (≥90%)</option>
              <option value="low">Low Occupancy (&lt;90%)</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Add Property
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}