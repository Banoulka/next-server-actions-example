# Next Server Actions Example

Small example of mutations and server-side next actions integrated with prisma and session based
data sharing on next server components and actions.

Works progressively out of the box with next updating/refreshing the UI while javascript is disabled
and updates without refresh for js enabled.

[Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)

[Progressive Enhancement](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#progressive-enhancement)

> Requires postgres service running with prisma to work.

## Example showing app working with/without javascript.

[Video Link](https://gyazo.com/43190ac6eab9fd7d875ba6a25a47e6ff)

## Code Snippet of server action

```ts
export const svact_createNewDog = async (formData: FormData) => {
	const session = await sv_getSession(prismaMemoryCache);

	const parsedData = parseFormData < DogData > formData;

	// NOTE: dog data still contains a strange __next__ field
	// that is not in the interface ($ACTION_ID...) I assume so it can link
	// server side requests to server "actions"
	const { data: dogData, errors } = (await validate)<DogData>(
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
```

## Code Snippet of Dogs page

```tsx
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
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
