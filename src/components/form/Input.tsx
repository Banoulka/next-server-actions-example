import React from 'react';

interface InputProps {
	name: string;
	label: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	type?: string;
	placeholder?: string;
	className?: string;
	error?: string;
	defaultValue?: string;
}

const Input: React.FC<InputProps> = ({
	name,
	label,
	onChange,
	onBlur,
	onFocus,
	type = 'text',
	placeholder,
	className,
	defaultValue,
	error,
}) => {
	return (
		<div className={`flex flex-col space-y-1 ${className}`}>
			<label className="text-sm font-semibold text-gray-300">
				{label}
			</label>
			<input
				name={name}
				type={type}
				onChange={onChange}
				onBlur={onBlur}
				onFocus={onFocus}
				defaultValue={defaultValue}
				placeholder={placeholder}
				className={`px-3 py-2 bg-gray-800 border ${
					error ? 'border-red-500' : 'border-gray-600'
				} text-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out`}
			/>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};

export default Input;
