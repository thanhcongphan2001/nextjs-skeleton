'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import SimpleErrorBoundary from '../components/SimpleErrorBoundary';

// Simple theme for map embed
const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#1976d2'
		},
		secondary: {
			main: '#dc004e'
		}
	}
});

type AppProps = {
	children?: React.ReactNode;
};

/**
 * The main App component.
 */
function App(props: AppProps) {
	const { children } = props;

	return (
		<SimpleErrorBoundary>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</SimpleErrorBoundary>
	);
}

export default App;
