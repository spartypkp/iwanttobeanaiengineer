"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import React from 'react';

interface MatrixButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'terminal' | 'ghost';
	size?: 'default' | 'sm' | 'lg' | 'icon';
	glowIntensity?: 'low' | 'medium' | 'high';
	children: React.ReactNode;
	className?: string;
	asChild?: boolean;
}

const MatrixButton: React.FC<MatrixButtonProps> = ({
	variant = 'default',
	size = 'default',
	glowIntensity = 'medium',
	children,
	className,
	asChild = false,
	...props
}) => {
	// Dynamic glow colors that use CSS variables for theming
	const glowClasses = {
		low: 'hover:shadow-[0_0_10px_hsl(var(--primary)/30%)]',
		medium: 'hover:shadow-[0_0_15px_hsl(var(--primary)/50%)]',
		high: 'hover:shadow-[0_0_20px_hsl(var(--primary)/70%)]',
	};

	// Custom variant styles that use theme colors
	const variantClasses = {
		default: '',
		terminal: 'font-mono border-2 border-primary hover:bg-primary/10 text-primary',
		ghost: 'bg-transparent hover:bg-primary/10 text-primary',
	};

	return (
		<Button
			variant={variant !== 'terminal' && variant !== 'ghost' ? variant : 'outline'}
			size={size}
			className={cn(
				'transition-all duration-300',
				variantClasses[variant],
				glowClasses[glowIntensity],
				variant === 'terminal' && 'relative overflow-hidden',
				className
			)}
			asChild={asChild}
			{...props}
		>
			<>
				{variant === 'terminal' && (
					<span className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
				)}
				{children}
			</>
		</Button>
	);
};

export default MatrixButton; 