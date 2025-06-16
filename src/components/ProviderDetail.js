import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProviderDetail = () => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulate API call to fetch single provider
  const fetchProvider = (providerId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch('/data.json')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch provider');
            }
            return response.json();
          })
          .then(data => {
            const foundProvider = data.find(p => p.id === providerId);
            if (foundProvider) {
              resolve(foundProvider);
            } else {
              reject(new Error('Provider not found'));
            }
          })
          .catch(error => reject(error));
      }, 600); // Simulate network delay
    });
  };

  useEffect(() => {
    fetchProvider(id)
      .then(data => {
        setProvider(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching provider:", error);
        setError(error.message || 'Provider not found');
        setProvider(null);
        setLoading(false);
      });
  }, [id]);

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

  if (error || (!loading && !provider)) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
          <h3 className="mt-3">Provider Not Found</h3>
          <p className="text-muted">{error || 'The requested provider could not be found.'}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/providers')}
          >
            Back to Providers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Back Button */}
      <div className="mb-4">
        <button 
          className="btn btn-outline-primary"
          onClick={() => navigate('/providers')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to List
        </button>
      </div>

      {/* Provider Details Card */}
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Header Section */}
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-person-circle display-4 text-primary"></i>
                </div>
                <h1 className="card-title text-primary mb-2">{provider.name}</h1>
                <h4 className="text-muted mb-3">{provider.specialization}</h4>
                
                {/* Rating */}
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div className="me-2">
                    {renderStars(provider.rating)}
                  </div>
                  <span className="badge bg-warning text-dark px-3 py-2">
                    {provider.rating} / 5.0
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="row mb-4">
                <div className="col-md-6 mx-auto text-center">
                  <div className="d-flex align-items-center justify-content-center text-muted">
                    <i className="bi bi-geo-alt fs-5 me-2"></i>
                    <span className="fs-5">{provider.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="text-primary mb-3">About</h5>
                <p className="text-muted lh-lg">{provider.longDescription}</p>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                <h5 className="text-primary mb-3">Contact Information</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '45px', height: '45px'}}>
                        <i className="bi bi-envelope text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Email</h6>
                        <a href={`mailto:${provider.contactEmail}`} className="text-primary text-decoration-none">
                          {provider.contactEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '45px', height: '45px'}}>
                        <i className="bi bi-telephone text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Phone</h6>
                        <a href={`tel:${provider.phoneNumber}`} className="text-primary text-decoration-none">
                          {provider.phoneNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <a 
                      href={`mailto:${provider.contactEmail}`}
                      className="btn btn-primary btn-lg w-100"
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Send Email
                    </a>
                  </div>
                  <div className="col-md-6 mb-2">
                    <a 
                      href={`tel:${provider.phoneNumber}`}
                      className="btn btn-outline-primary btn-lg w-100"
                    >
                      <i className="bi bi-telephone me-2"></i>
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;