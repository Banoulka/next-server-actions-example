import { required, minLength, maxLength } from '@/valiations/validate';

export const createDogRules = {
	name: [
		{ validator: required, message: 'Name is required' },
		{
			validator: minLength(2),
			message: 'Name must be at least 2 characters long',
		},
		{
			validator: maxLength(50),
			message: 'Name must be no more than 50 characters long',
		},
	],
	breed: [
		{ validator: required, message: 'Breed is required' },
		{
			validator: minLength(2),
			message: 'Breed must be at least 2 characters long',
		},
		{
			validator: maxLength(50),
			message: 'Breed must be no more than 50 characters long',
		},
	],
};
