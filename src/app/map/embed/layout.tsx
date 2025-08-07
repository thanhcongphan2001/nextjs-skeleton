import SimpleLayout from '../../../components/SimpleLayout';

interface EmbedLayoutProps {
	children: React.ReactNode;
}

// Disable static generation for this route
export const dynamic = 'force-dynamic';

export default function EmbedLayout({ children }: EmbedLayoutProps) {
	return (
		<SimpleLayout
			navbar={false}
			toolbar={false}
			leftSidePanel={false}
			rightSidePanel={false}
			footer={false}
		>
			{children}
		</SimpleLayout>
	);
}
