// next session stuff
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export type SessionData = {
	get: (key: string) => Promise<any>;
	getOnce: (key: string) => Promise<any>;
	set: (key: string, value: any) => Promise<void>;
};

export interface IMemoryCache {
	get: (key: string) => Promise<any>;
	set: (key: string, value: any, maxAge?: number) => Promise<void>;
}

// Maximum session age in seconds
const maxAge = 86400; // 1 day in seconds

// Function to get or set a session
const sv_getSession = async (memoryCache: any): Promise<SessionData> => {
	// Get the cookies from the headers
	const cookie: ResponseCookies = cookies() as unknown as ResponseCookies;

	// Attempt to get the existing sessionId from the cookies
	let sessionId: string | undefined = cookie.get('sessionId')?.value;

	// if there is no session id cookie, create one and store it
	if (!sessionId) {
		const newSessionId = crypto.randomBytes(32).toString('hex');

		await memoryCache.set(newSessionId, {});

		// Assign the newly created session ID
		sessionId = newSessionId;

		// Set the session ID cookie
		// @ts-ignore
		cookie.set({
			name: 'sessionId',
			value: sessionId,
			httpOnly: true,
			path: '/',
			secure: true,
			maxAge: maxAge,
		});
	}

	// If there is a session, grab the data and get it from the cache
	const data = await memoryCache.get(sessionId);

	// Return session methods for getting and setting data
	return {
		get: async (key: string) => {
			return data[key];
		},
		getOnce: async (key: string) => {},
		set: async (key: string, value: any) => {
			data[key] = value;
			await memoryCache.set(sessionId, data);
		},
	};
};

// Function to get session data only if a session exists and from
// the client-side, readonly request cookies exist
export const getSession = async (memoryCache: IMemoryCache) => {
	// Get the cookies from the headers
	const cookie: ReadonlyRequestCookies =
		cookies() as unknown as ReadonlyRequestCookies;

	// Attempt to get the existing sessionId from the cookies
	let sessionId: string | undefined = cookie.get('sessionId')?.value;

	// If no session ID is found, return null
	if (!sessionId) {
		return null;
	}

	// Retrieve session data from the cache
	const data = await memoryCache.get(sessionId);

	// Return session methods for getting data and getting data once
	return {
		getAll: () => {
			return data;
		},
		get: async (key: string) => {
			return data[key];
		},
		getOnce: async (key: string) => {
			const value = data[key];
			delete data[key];
			await memoryCache.set(sessionId!, data);
			return value;
		},
	};
};

export default sv_getSession;
