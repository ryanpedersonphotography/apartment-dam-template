import DashboardStats from '../components/features/DashboardStats';
import PropertyCard from '../components/features/PropertyCard';

export default function Dashboard() {
  const stats = [
    { label: 'Total Properties', value: 12, change: 8, icon: '🏢' },
    { label: 'Total Units', value: 248, change: 12, icon: '🏠' },
    { label: 'Occupancy Rate', value: '94%', change: 2, icon: '📊' },
    { label: 'Monthly Revenue', value: '$425K', change: 15, icon: '💰' }
  ];

  const properties = [
    { name: 'Sunset Apartments', address: '123 Main St, City, ST', units: 48, occupancy: 92 },
    { name: 'Park View Complex', address: '456 Oak Ave, Town, ST', units: 72, occupancy: 96 },
    { name: 'Downtown Lofts', address: '789 Urban Blvd, Metro, ST', units: 36, occupancy: 89 }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your properties.</p>
        </div>

        <DashboardStats stats={stats} />

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Add Property
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <PropertyCard key={index} {...property} />
            ))}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-600">New tenant moved in - Unit 204</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Maintenance completed - Unit 312</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Rent payment received - Unit 105</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Media Library</h3>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded"></div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Media →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}