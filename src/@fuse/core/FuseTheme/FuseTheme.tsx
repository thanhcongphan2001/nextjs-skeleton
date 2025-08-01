import { ThemeProvider, Theme } from '@mui/material/styles';
import { memo, ReactNode, useEffect, useLayoutEffect } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Box } from '@mui/material';

/**
 * The useEnhancedEffect function is used to conditionally use the useLayoutEffect hook if the window object is defined.
 * Otherwise, it uses the useEffect hook.
 */
const useEnhancedEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type FuseThemeProps = {
	children: ReactNode;
	theme: Theme;
	root?: boolean;
};

/**
 * The FuseTheme component is responsible for rendering the MUI ThemeProvider component with the specified theme and direction.
 * It also sets the direction of the document body and adds a class to the body based on the current theme mode.
 * The component is memoized to prevent unnecessary re-renders.
 */
function FuseTheme(props: FuseThemeProps) {
	const { theme, children, root = false } = props;
	const { mode } = theme.palette;
	const langDirection = theme.direction;

	useEnhancedEffect(() => {
		if (root) {
			document.documentElement.dir = langDirection;
		}
	}, [langDirection]);

	useEffect(() => {
		if (root) {
			document.body.classList.add(mode === 'light' ? 'light' : 'dark');
			document.body.classList.remove(mode === 'light' ? 'dark' : 'light');
		}
	}, [mode, root]);

	const baseStyles = {
		'& .MuiOutlinedInput-root': {
			backgroundColor: theme.vars.palette.common.background
		},
		'& .border-divider ': {
			borderColor: `${theme.vars.palette.divider}!important`
		},
		'table.simple tbody tr th': {
			borderColor: theme.vars.palette.divider
		},
		'table.simple thead tr th': {
			borderColor: theme.vars.palette.divider
		},
		// 'a:not([role=button]):not(.MuiButtonBase-root)': {
		// 	color: theme.vars.palette.secondary.main,
		// 	textDecoration: 'underline',
		// 	'&:hover': {}
		// },
		'a.link, a:not([role=button])[target=_blank]': {
			backgroundColor: `rgba(${theme.vars.palette.secondary.mainChannel} / 0.2)`,
			color: 'inherit',
			borderBottom: `1px solid ${theme.vars.palette.divider}`,
			textDecoration: 'none',
			'&:hover': {
				backgroundColor: `rgba(${theme.vars.palette.secondary.mainChannel} / 0.3)`,
				textDecoration: 'none'
			}
		},
		'[class^="border"]': {
			borderColor: theme.vars.palette.divider
		},
		'[class*="border"]': {
			borderColor: theme.vars.palette.divider
		},
		'[class*="divide-"] > :not([hidden])': {
			borderColor: theme.vars.palette.divider
		},
		hr: {
			borderColor: theme.vars.palette.divider
		},
		'::-webkit-scrollbar-thumb': {
			boxShadow: `inset 0 0 0 20px ${
				theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
			}`
		},
		'::-webkit-scrollbar-thumb:active': {
			boxShadow: `inset 0 0 0 20px ${
				theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
			}`
		}
	};
	// console.warn('FuseTheme:: rendered',mainTheme);
	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					...(root
						? {
								display: 'flex',
								flexDirection: 'column',
								width: '100%',
								minHeight: '100vh'
							}
						: baseStyles)
				}}
			>
				{children}
			</Box>
			{root && (
				<GlobalStyles
					styles={(theme) => ({
						html: {
							backgroundColor: `${theme.vars.palette.background.default}`,
							color: `${theme.vars.palette.text.primary}`
						},
						body: {
							backgroundColor: theme.vars.palette.background.default,
							color: theme.vars.palette.text.primary,

							'& #spinner > div': {
								backgroundColor: theme.vars.palette.secondary.main + '!important'
							}
						},
						...baseStyles
					})}
				/>
			)}
		</ThemeProvider>
	);
}

export default memo(FuseTheme);
