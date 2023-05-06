import React from 'react';

interface ErrorMessages {
	[key: string]: string[];
}

interface ErrorSummaryProps {
	errors: ErrorMessages;
}

const ErrorSummary: React.FC<ErrorSummaryProps> = ({ errors }) => {
	if (!errors) return <></>;

	const errorKeys = Object.keys(errors);

	return (
		<div className="bg-red-800 text-white py-4 rounded-md shadow-md my-6 px-8">
			<h2 className="text-lg font-bold mb-2">Error Summary</h2>
			<ul className="list-disc list-inside">
				{errorKeys.map((key, index) => (
					<li key={index}>{errors[key][0]}</li>
				))}
			</ul>
		</div>
	);
};

export default ErrorSummary;
