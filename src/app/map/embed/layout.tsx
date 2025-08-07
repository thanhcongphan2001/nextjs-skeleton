import SimpleLayout from '../../../components/SimpleLayout';

interface EmbedLayoutProps {
	children: React.ReactNode;
}
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
