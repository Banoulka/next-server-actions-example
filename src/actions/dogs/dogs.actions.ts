'use server';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../prisma/prisma';
import { required, validate } from '@/valiations/validate';
import parseFormData from '@/utils/parseFormData';
import { createDogRules } from './dogs.validations';
import sv_getSession from '@/auth/sv_getSession';
import prismaMemoryCache from '@/auth/prismaMemoryCache';
import { redirect } from 'next/navigation';

// sv = server-side
// svact = NEW server-side action

export const sv_getDogs = async () => {
	const dogs = await prisma.dog.findMany();
	return dogs;
};

interface DogData {
	name: string;
	breed: string;
}

export const svact_createNewDog = async (formData: FormData) => {
	const session = await sv_getSession(prismaMemoryCache);

	const parsedData = parseFormData<DogData>(formData);

	// NOTE: dog data still contains a strange __next__ field
	// that is not in the interface ($ACTION_ID...) I assume so it can link
	// server side requests to server "actions"
	const { data: dogData, errors } = await validate<DogData>(
		parsedData,
		createDogRules
	);

	if (!errors) {
		await prisma.dog.create({
			data: {
				name: dogData.name,
				breed: dogData.breed,
				age: 3,
			},
		});

		// redirect to refresh page (prevent multiple submissions from refresh)
		redirect('/dogs');
	} else {
		// somehow show errors on client side?
		await session.set('errors', errors);
		await session.set('formData', parsedData);
		revalidatePath('/dogs');
	}
};

export const svact_deleteDog = async (formData: FormData) => {
	const session = await sv_getSession(prismaMemoryCache);
	const parsedData = parseFormData<{ id: string }>(formData);

	// Defensive validaton method to make sure the id
	// has not been removed or tampered with
	const { data: idData, errors } = await validate<{ id: string }>(
		parsedData,
		{ id: [{ validator: required, message: 'Something went wrong' }] }
	);

	if (!errors) {
		// delete the dog
		await prisma.dog.delete({
			where: {
				id: parseInt(idData.id),
			},
		});
		redirect('/dogs');
	} else {
		// somehow show errors on client side?
		await session.set('errors', errors);
		await session.set('formData', parsedData);
		revalidatePath('/dogs');
	}
};
