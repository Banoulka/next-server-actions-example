import Link from 'next/link';

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			hello world!
			<Link href="/dogs">Go To Dogs:</Link>
		</main>
	);
}
