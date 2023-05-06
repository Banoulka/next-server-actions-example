type ValidatorFn<T> = (value: T) => boolean | string;

interface ValidationRule<T> {
	validator: ValidatorFn<T>;
	message: string;
}

// Just a small validation system to make sure that the data
// that we are getting from the client is valid
export const validate = async <T>(
	data: T,
	rules: Record<keyof T, ValidationRule<T[keyof T]>[]>
): Promise<{ data: T; errors: Record<string, string[]> | null }> => {
	const errors: Record<string, string[]> = {};

	for (const key in rules) {
		const value = data[key as keyof T];
		const validationRules = rules[key as keyof T];

		for (const rule of validationRules) {
			const result = rule.validator(value);

			if (result !== true) {
				if (!errors[key]) errors[key] = [];
				errors[key].push(rule.message);
			}
		}
	}

	// if the errors object is empty, return null
	// otherwise, return the data and errors
	// this is so that we can do if (!errors) { do something }
	// instead of if (errors) { do something }

	return {
		data,
		errors: Object.keys(errors).length > 0 ? errors : null,
	};
};

export const minLength =
	(min: number): ValidatorFn<string> =>
	(value) =>
		value.length >= min;

export const maxLength =
	(max: number): ValidatorFn<string> =>
	(value) =>
		value.length <= max;

export const required: ValidatorFn<string> = (value) => value.trim().length > 0;
