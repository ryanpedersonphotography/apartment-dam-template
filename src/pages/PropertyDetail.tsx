import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePropertyDetails } from '../hooks/useData';
import { downloadLayoutAssets } from '../utils/downloadAssets';
import type { Layout } from '../types';

export default function PropertyDetail() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { property } = usePropertyDetails(propertyId || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'layouts' | 'amenities' | 'gallery'>('overview');
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAssets = async () => {
    if (!selectedLayout) return;
    
    setIsDownloading(true);
    try {
      await downloadLayoutAssets(selectedLayout);
    } catch (error) {
      console.error('Failed to download assets:', error);
      alert('Failed to download assets. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!property) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
            <Link to="/properties" className="text-blue-600 hover:text-blue-800">
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'layouts', label: 'Floor Plans', count: property.layouts?.length || 0 },
    { id: 'amenities', label: 'Amenities', count: property.commonSpaces?.length || 0 },
    { id: 'gallery', label: 'Gallery', count: property.images.length },
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/properties" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
          <p className="text-gray-600">
            {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <img 
            src={property.images[0]?.url} 
            alt={property.name}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Total Units:</dt>
                      <dd className="font-medium">{property.totalUnits}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Available Units:</dt>
                      <dd className="font-medium">{property.totalUnits - property.occupiedUnits}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Occupancy Rate:</dt>
                      <dd className="font-medium">{Math.round(property.occupancyRate)}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Property Type:</dt>
                      <dd className="font-medium capitalize">{property.type}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Building Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.buildingFeatures?.slice(0, 6).map(feature => (
                      <div key={feature.id} className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Unit Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map(amenity => (
                    <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layouts Tab */}
          {activeTab === 'layouts' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.layouts?.map(layout => (
                  <div
                    key={layout.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedLayout(layout)}
                  >
                    <img 
                      src={layout.marketingImages[0]?.url || property.images[0]?.url}
                      alt={layout.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2">{layout.name}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{layout.bedrooms} bed • {layout.bathrooms} bath • {layout.squareFeet} sq ft</p>
                        <p className="font-semibold text-gray-900">From ${layout.baseRent}/mo</p>
                        <div className="flex items-center gap-2">
                          <p className="text-green-600">{layout.availableUnits} units available</p>
                          {layout.unitAvailability && layout.unitAvailability.some(u => u.isImmediatelyAvailable) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Move-in Ready
                            </span>
                          )}
                        </div>
                      </div>
                      {layout.virtual3DTour && (
                        <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View 3D Tour →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {property.layouts?.length === 0 && (
                <p className="text-center text-gray-500 py-8">No floor plans available</p>
              )}
            </div>
          )}

          {/* Amenities Tab */}
          {activeTab === 'amenities' && (
            <div className="space-y-8">
              {/* Common Spaces */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Common Spaces</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {property.commonSpaces?.map(space => (
                    <div key={space.id} className="border rounded-lg overflow-hidden">
                      {space.images[0] && (
                        <img 
                          src={space.images[0].url}
                          alt={space.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-2">{space.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{space.description}</p>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Hours: </span>
                            <span className="font-medium">{space.hoursOfOperation}</span>
                          </div>
                          {space.requiresReservation && (
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                              Reservation Required
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {space.features.map(feature => (
                            <span key={feature} className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Building Features */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Building Features</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {property.buildingFeatures?.map(feature => (
                    <div key={feature.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{feature.name}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        feature.category === 'security' ? 'bg-red-100 text-red-800' :
                        feature.category === 'technology' ? 'bg-blue-100 text-blue-800' :
                        feature.category === 'sustainability' ? 'bg-green-100 text-green-800' :
                        feature.category === 'convenience' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {feature.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {property.images.map(image => (
                <div key={image.id} className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Layout Modal */}
        {selectedLayout && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedLayout(null)}
          >
            <div
              className="relative max-w-6xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLayout(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-2 hover:bg-white transition-colors shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Left Side - Images */}
                <div className="md:w-3/5 bg-gray-100 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Main Floor Plan */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Floor Plan</h4>
                      <img
                        src={selectedLayout.floorPlan?.url || selectedLayout.marketingImages[0]?.url}
                        alt={selectedLayout.name}
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                    
                    {/* Marketing Images Grid */}
                    {selectedLayout.marketingImages.length > 1 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Unit Photos</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedLayout.marketingImages.slice(1).map(image => (
                            <img
                              key={image.id}
                              src={image.url}
                              alt={image.title}
                              className="w-full h-32 object-cover rounded-lg shadow-sm"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Side - Details */}
                <div className="md:w-2/5 p-6 overflow-y-auto">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{selectedLayout.name}</h3>
                    <p className="text-gray-600 text-sm">{selectedLayout.description}</p>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold">{selectedLayout.bedrooms}</div>
                      <div className="text-xs text-gray-600">Bedrooms</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold">{selectedLayout.bathrooms}</div>
                      <div className="text-xs text-gray-600">Bathrooms</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold">{selectedLayout.squareFeet}</div>
                      <div className="text-xs text-gray-600">Square Feet</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">${selectedLayout.baseRent}</div>
                      <div className="text-xs text-gray-600">Starting Price</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedLayout.features.map(feature => (
                        <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Unit Availability Section */}
                  {selectedLayout.unitAvailability && selectedLayout.unitAvailability.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Available Units ({selectedLayout.unitAvailability.length})
                      </h4>
                      <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                        {selectedLayout.unitAvailability
                          .sort((a, b) => new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime())
                          .map((unit, idx) => {
                            const availDate = new Date(unit.availableDate);
                            
                            return (
                              <div key={idx} className="bg-gray-50 rounded p-2 text-xs border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-semibold text-gray-900">Unit {unit.unitNumber}</span>
                                    <span className="text-gray-500 ml-1">F{unit.floor}</span>
                                    {unit.isImmediatelyAvailable ? (
                                      <span className="text-green-600 font-medium block mt-0.5">Available Now</span>
                                    ) : (
                                      <span className="text-blue-600 block mt-0.5">
                                        {availDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold">${unit.rentAmount}</div>
                                    {unit.specialOffer && (
                                      <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                                        {unit.specialOffer.split(' ').slice(0, 2).join(' ')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2">
                        Schedule a Tour →
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {selectedLayout.virtual3DTour && (
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm">
                        View 3D Virtual Tour
                      </button>
                    )}
                    
                    <button
                      onClick={handleDownloadAssets}
                      disabled={isDownloading}
                      className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                        isDownloading 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isDownloading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          Download Assets Bundle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}