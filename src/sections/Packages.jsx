import React from 'react';
import './Packages.css';

function PlanCard({ title, price, children }) {
  return (
    <div className="plan-card">
      <div className="plan-head">
        <h3 className="plan-title">{title}</h3>
        {price && <div className="plan-price">{price}</div>}
      </div>
      <div className="plan-body">{children}</div>
    </div>
  );
}

export default function Packages() {
  return (
    <div className="packages-container">
      <h2 className="section-title">Packages</h2>

      <div className="plans-grid">
        <PlanCard title="Solo" price="₱500">
          <ul className="plan-list">
            <li>1 pax</li>
            <li>30 mins studio session</li>
            <li>2 photo prints</li>
          </ul>
        </PlanCard>

        <PlanCard title="Family" price="₱1000">
          <ul className="plan-list">
            <li>2 - 5 pax</li>
            <li>45 mins studio session</li>
            <li>2 photo prints</li>
          </ul>
        </PlanCard>

        <PlanCard title="Custom">
          <ul className="plan-list">
            <li>Flexible group size</li>
            <li>Custom duration</li>
            <li>Multiple print options</li>
          </ul>
        </PlanCard>
      </div>
    </div>
  );
}
