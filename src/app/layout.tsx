import './globals.css'

export const metadata = {
	title: 'Startpage',
	description: 'A custom startpage just for you',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className="bg-primary-800">
			<body>{children}</body>
		</html>
	)
}
