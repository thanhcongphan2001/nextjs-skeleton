'use client';

import { ReactNode } from 'react';

type SimpleLayoutProps = {
	children: ReactNode;
	navbar?: boolean;
	toolbar?: boolean;
	footer?: boolean;
	leftSidePanel?: boolean;
	rightSidePanel?: boolean;
};

/**
 * Simple layout component for map embed - no Fuse dependencies
 */
function SimpleLayout(props: SimpleLayoutProps) {
	const { children } = props;

	return (
		<div className="flex w-full h-screen">
			<main className="flex-1 flex flex-col">
				{children}
			</main>
		</div>
	);
}

export default SimpleLayout;
