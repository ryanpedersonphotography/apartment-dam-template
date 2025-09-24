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
              className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLayout(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div>
                  <img
                    src={selectedLayout.floorPlan?.url || selectedLayout.marketingImages[0]?.url}
                    alt={selectedLayout.name}
                    className="w-full rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{selectedLayout.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedLayout.description}</p>
                  
                  <dl className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Bedrooms:</dt>
                      <dd className="font-medium">{selectedLayout.bedrooms}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Bathrooms:</dt>
                      <dd className="font-medium">{selectedLayout.bathrooms}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Square Feet:</dt>
                      <dd className="font-medium">{selectedLayout.squareFeet}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Starting at:</dt>
                      <dd className="font-bold text-lg">${selectedLayout.baseRent}/mo</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Available:</dt>
                      <dd className="font-medium text-green-600">{selectedLayout.availableUnits} units</dd>
                    </div>
                  </dl>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLayout.features.map(feature => (
                        <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Unit Availability Section */}
                  {selectedLayout.unitAvailability && selectedLayout.unitAvailability.length > 0 && (
                    <div className="mb-6 border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Available Units ({selectedLayout.unitAvailability.length})
                      </h4>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {selectedLayout.unitAvailability
                          .sort((a, b) => new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime())
                          .map((unit, idx) => {
                            const availDate = new Date(unit.availableDate);
                            const today = new Date();
                            const daysUntilAvailable = Math.ceil((availDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                            
                            return (
                              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-900">Unit {unit.unitNumber}</span>
                                      <span className="text-xs text-gray-500">Floor {unit.floor}</span>
                                    </div>
                                    <div className="text-sm mt-1">
                                      {unit.isImmediatelyAvailable ? (
                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                          </svg>
                                          Available Now
                                        </span>
                                      ) : (
                                        <span className="text-blue-600">
                                          Available {availDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                          <span className="text-gray-500 text-xs ml-1">({daysUntilAvailable} days)</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-lg">${unit.rentAmount}/mo</div>
                                    <div className="text-xs text-gray-500">Deposit: ${unit.depositAmount}</div>
                                  </div>
                                </div>
                                {unit.specialOffer && (
                                  <div className="mt-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                                      </svg>
                                      {unit.specialOffer}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                      <div className="mt-3 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Schedule a Tour →
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {selectedLayout.virtual3DTour && (
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                        View 3D Virtual Tour
                      </button>
                    )}
                    
                    <button
                      onClick={handleDownloadAssets}
                      disabled={isDownloading}
                      className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        isDownloading 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isDownloading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Downloading Assets...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          Download Layout Assets Bundle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Marketing Images */}
              {selectedLayout.marketingImages.length > 1 && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedLayout.marketingImages.map(image => (
                      <img
                        key={image.id}
                        src={image.thumbnailUrl || image.url}
                        alt={image.title}
                        className="h-20 w-20 object-cover rounded flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}