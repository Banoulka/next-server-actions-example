import React from 'react';
import Input from '@/components/form/Input';
import Button from '@/components/form/Button';
import { Dog } from '@prisma/client';
import {
	sv_getDogs,
	svact_createNewDog,
	svact_deleteDog,
} from '@/actions/dogs/dogs.actions';
import { getSession } from '@/auth/sv_getSession';
import prismaMemoryCache from '@/auth/prismaMemoryCache';
import ErrorSummary from '@/components/form/ErrorSummary';

const DogsPage = async () => {
	const dogs = await sv_getDogs();
	const session = await getSession(prismaMemoryCache);

	const errors = await session?.getOnce('errors');
	const formData = await session?.getOnce('formData');

	const Dog = ({ dog }: { dog: Dog }) => {
		return (
			<div className="bg-gray-800 rounded-lg shadow-md p-4 w-full max-w-xs mx-auto mb-6 flex flex-col my-2">
				<h2 className="text-xl font-bold text-white">{dog.name}</h2>
				<p className="text-md text-gray-300">{dog.breed}</p>
				<form action={svact_deleteDog}>
					<input type="hidden" name="id" value={dog.id} />
					<Button className="mt-4" type="submit">
						Delete
					</Button>
				</form>
			</div>
		);
	};

	const NewDogForm = () => {
		const errorFor = (key: string) =>
			errors && errors[key] && errors[key][0];

		const dataFor = (key: string) => formData && formData[key];

		return (
			<form className="mt-7" action={svact_createNewDog}>
				<h4 className="mb-4">Add New Dog:</h4>
				<Input
					name="name"
					label="Dog name"
					className="mb-3"
					error={errorFor('name')}
					defaultValue={dataFor('name')}
				/>
				<Input
					name="breed"
					label="Dog breed"
					className="mb-3"
					error={errorFor('breed')}
					defaultValue={dataFor('breed')}
				/>

				<Button className="mt-4" type="submit">
					Add
				</Button>
			</form>
		);
	};

	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<h1 className="text-4xl font-bold">Dogs</h1>
			<ErrorSummary errors={errors} />

			{dogs.map((dog) => (
				<Dog dog={dog} key={dog.id} />
			))}
			<NewDogForm />
		</main>
	);
};

export default DogsPage;
