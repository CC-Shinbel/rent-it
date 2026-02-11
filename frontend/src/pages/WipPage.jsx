import React from 'react';
import MainLayout from '../layouts/MainLayout';

function WipPage() {
  return (
    <MainLayout>
      <section className="wip-section">
        <div className="wip-content">
          <div className="wip-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <h1 className="wip-title">
            Work in <span className="accent">Progress</span>
          </h1>

          <p className="wip-description">
            We're working hard to bring you this feature! Our team is crafting something special
            that will make your videoke rental experience even better.
          </p>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="progress-label">Estimated completion: 35%</p>

          <div className="wip-actions">
            <a href="/rent-it/" className="btn btn-primary">
              Back to Home
            </a>
            <a href="http://localhost:5173/contact" className="btn btn-outline">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default WipPage;
