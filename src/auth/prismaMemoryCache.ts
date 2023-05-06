import { prisma } from '../../prisma/prisma';
import { IMemoryCache } from './sv_getSession';

const prismaMemoryCache: IMemoryCache = {
	get: async function (key: string): Promise<any> {
		const session = await prisma.session.findUniqueOrThrow({
			where: {
				id: key,
			},
		});

		return session.data;
	},
	set: async function (
		key: string,
		value: any,
		maxAge?: number | undefined
	): Promise<void> {
		await prisma.session.upsert({
			where: {
				id: key,
			},
			create: {
				id: key,
				data: value,
			},
			update: {
				data: value,
			},
		});
	},
};

export default prismaMemoryCache;
