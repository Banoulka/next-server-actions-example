// Parse form data javascript object from "FormData"
const parseFormData = <T>(formData: FormData): T => {
	const result: any = {};

	formData.forEach((value, key) => {
		result[key] = value;
	});

	return result as T;
};

export default parseFormData;
