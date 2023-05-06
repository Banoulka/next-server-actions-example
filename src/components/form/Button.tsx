import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	type = 'button',
	loading = false,
	disabled = false,
	className,
	...rest
}) => {
	return (
		<button
			onClick={onClick}
			type={type}
			disabled={disabled || loading}
			className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out ${className}`}
			{...rest}
		>
			{loading ? (
				<span className="animate-spin inline-block h-5 w-5 border-t-2 border-white rounded-full"></span>
			) : (
				children
			)}
		</button>
	);
};

export default Button;
