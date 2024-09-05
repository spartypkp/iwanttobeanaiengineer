"use client";
import React, { useState } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/toolTip";



const WarningTooltip: React.FC<{ message: string; }> = ({ message }) => {

	return (

		<TooltipProvider>
			<Tooltip>

				<TooltipTrigger className="bg-gray-200 flex items-center justify-center">
					⚠️
					<span className="ml-1">WARNING</span>
				</TooltipTrigger>

				<TooltipContent>
					<p>{message}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>

	);
};

export default WarningTooltip;