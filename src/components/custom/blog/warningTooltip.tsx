"use client";
// // inlineActions.tsx
// // inlineActions.tsx
// import React from 'react';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from "@/components/ui/toolTip";
// import { InformationCircleIcon, QuestionMarkCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
// // Common interface for all inline actions
// interface InlineActionProps {
//     message: string;
// }

// interface HighlightProps extends InlineActionProps {
//     children: React.ReactNode;
// }

// // Warning Component
// const Warning: React.FC<InlineActionProps> = ({ message }) => (
//     <TooltipProvider>
//         <Tooltip>
//             <TooltipTrigger asChild>
                
//                     <ExclamationCircleIcon className="h-8 w-8" />
                
//             </TooltipTrigger>
//             <TooltipContent>
//                 <p>{message}</p>
//             </TooltipContent>
//         </Tooltip>
//     </TooltipProvider>
// );

// // Informative Component
// const Informative: React.FC<InlineActionProps> = ({ message }) => (
//     <TooltipProvider>
//         <Tooltip>
//             <TooltipTrigger asChild>
                
//                 <InformationCircleIcon className="h-8 w-8" />
//             </TooltipTrigger>
//             <TooltipContent>
//                 <p>{message}</p>
//             </TooltipContent>
//         </Tooltip>
//     </TooltipProvider>
// );

// // Question Component
// const Question: React.FC<InlineActionProps> = ({ message }) => (
//     <TooltipProvider>
//         <Tooltip>
//             <TooltipTrigger asChild>
//                 <QuestionMarkCircleIcon className="h-8 w-8" />
//             </TooltipTrigger>
//             <TooltipContent>
//                 <p>{message}</p>
//             </TooltipContent>
//         </Tooltip>
//     </TooltipProvider>
// );

// // Highlight Component
// const Highlight: React.FC<HighlightProps> = ({ children, message }) => (
//     <TooltipProvider>
//         <Tooltip>
//             <TooltipTrigger asChild>
//                 <span className="bg-yellow-200 cursor-pointer">
//                     {children}
//                 </span>
//             </TooltipTrigger>
//             <TooltipContent>
//                 <p>{message}</p>
//             </TooltipContent>
//         </Tooltip>
//     </TooltipProvider>
// );

// export { Warning, Informative, Question, Highlight };


// inlineActions.tsx
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/toolTip";

// Common interface for all inline actions
interface InlineActionProps {
  preface?: string;
  message: string;
}

interface HighlightProps extends InlineActionProps {
  children: React.ReactNode;
}

// Warning Component (⚠️)
const Warning: React.FC<InlineActionProps> = ({ preface, message }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-pointer text-yellow-500 text-xl">[{preface}⚠️]</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Informative Component (ℹ️)
const Informative: React.FC<InlineActionProps> = ({ preface, message }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-pointer text-blue-500 text-xl">[{preface}ℹ️]</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Question Component (❓)
const Question: React.FC<InlineActionProps> = ({ preface, message }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-pointer text-green-500 text-xl">[{preface}❓]</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Highlight Component
const Highlight: React.FC<HighlightProps> = ({ children, message }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="bg-yellow-200 cursor-pointer">{children}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export { Warning, Informative, Question, Highlight };
