import React from 'react';

interface EnterprisePlanProps {
  onContact?: () => void;
}

const EnterprisePlan: React.FC<EnterprisePlanProps> = ({ onContact }) => {
  return (
    <div className="rounded-2xl accent-border backdrop-blur-md glass-card bg-transparent p-8 w-full shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Enterprise Plan</h3>
        <button
          onClick={onContact}
          className="bg-[#006aff] hover:bg-[#0057d6] text-white font-semibold rounded-2xl px-10 py-3 text-base shadow-md transition"
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default EnterprisePlan;