import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Listings = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate API call with Promise and setTimeout
  const fetchProviders = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch('/data.json')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch providers');
            }
            return response.json();
          })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }, 800); // Simulate network delay
    });
  };

  useEffect(() => {
    fetchProviders()
      .then(data => {
        setProviders(data);
        setFilteredProviders(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching providers:", error);
        setLoading(false);
      });
  }, []);

  const filterProviders = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredProviders(providers);
      return;
    }

    const filtered = providers.filter(provider => 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredProviders(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterProviders(term);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredProviders(providers);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Learning Support Provider</h1>
        <p className="lead text-muted">Find the perfect learning support specialist for your needs</p>
      </div>

      {/* Search Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={handleClearSearch}
                    type="button"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="mb-3">
        <p className="text-muted">
          {searchTerm ? `Found ${filteredProviders.length} provider(s) matching "${searchTerm}"` : `Showing all ${filteredProviders.length} providers`}
        </p>
      </div>

      {/* Providers Grid */}
      <div className="row">
        {filteredProviders.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <h3 className="mt-3 text-muted">No providers found</h3>
              <p className="text-muted">Try adjusting your search terms</p>
            </div>
          </div>
        ) : (
          filteredProviders.map(provider => (
            <div key={provider.id} className="col-lg-4 col-md-6 mb-4">
              <div 
                className="card h-100 shadow-sm border-0 provider-card" 
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease-in-out' }}
                onClick={() => navigate(`/providers/${provider.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title text-primary mb-0">{provider.name}</h5>
                    <div className="d-flex align-items-center">
                      <div className="me-1">
                        {renderStars(provider.rating)}
                      </div>
                      <small className="text-muted">({provider.rating})</small>
                    </div>
                  </div>
                  
                  <h6 className="card-subtitle mb-3">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                      {provider.specialization}
                    </span>
                  </h6>
                  
                  <p className="card-text text-muted flex-grow-1">{provider.shortDescription}</p>
                  
                  <div className="mt-auto">
                    <div className="d-flex align-items-center text-muted mb-3">
                      <i className="bi bi-geo-alt me-2"></i>
                      <small>{provider.location}</small>
                    </div>
                    
                    <button className="btn btn-primary w-100">
                      View Details
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Listings;