'use client';

import React from 'react';
import ComparisonTable from './components/ComparisonTable';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a1116] text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
        <ComparisonTable />
      </div>
    </div>
  );
};

export default PricingPage;
