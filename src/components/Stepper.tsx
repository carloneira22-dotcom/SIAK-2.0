import React from 'react';
import { STEPS_INFO } from '../constants';

interface StepperProps {
    currentStep: number;
}

export function Stepper({ currentStep }: StepperProps) {
    return (
        <div className="bg-gray-900 rounded-xl p-4 mb-6 shadow-md flex justify-between overflow-x-auto gap-2 md:gap-4 no-print">
            {STEPS_INFO.map((s, i) => (
                <div key={i} className="flex flex-col items-center min-w-[70px] flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                        currentStep === i ? 'bg-blue-500 text-white ring-4 ring-blue-500/30' :
                        currentStep > i ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-500'
                    }`}>
                        {currentStep > i ? '✓' : s.emoji}
                    </div>
                    <span className={`text-[10px] mt-2 font-black uppercase tracking-tighter text-center ${currentStep === i ? 'text-blue-400' : 'text-gray-500'}`}>
                        {s.title}
                    </span>
                </div>
            ))}
        </div>
    );
}
