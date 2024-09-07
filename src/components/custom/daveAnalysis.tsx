// DaveAnalysis.tsx
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";

interface DaveAnalysisProps {
    analysisText: string;
}

const DaveAnalysis: React.FC<DaveAnalysisProps> = ({ analysisText }) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <span className="cursor-pointer flex items-center">
                    <i className="fas fa-info-circle text-blue-500 hover:text-blue-600"></i>
                    <span className="ml-2 text-xs font-medium">Dave Analysis</span>
                </span>
            </HoverCardTrigger>
            <HoverCardContent asChild>
                <div className="bg-white p-3 shadow-lg rounded text-sm text-gray-600">
                    {analysisText}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default DaveAnalysis;
