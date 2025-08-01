import * as React from 'react';
import { isNodeSelection, type Editor } from '@tiptap/react';

// --- Hooks ---
import { useTiptapEditor } from '@/hooks/useTiptapEditor';

// --- Icons ---
import { BoldIcon } from '@/components/tiptap/tiptap-icons/bold-icon';
import { Code2Icon } from '@/components/tiptap/tiptap-icons/code2-icon';
import { ItalicIcon } from '@/components/tiptap/tiptap-icons/italic-icon';
import { StrikeIcon } from '@/components/tiptap/tiptap-icons/strike-icon';
import { SubscriptIcon } from '@/components/tiptap/tiptap-icons/subscript-icon';
import { SuperscriptIcon } from '@/components/tiptap/tiptap-icons/superscript-icon';
import { UnderlineIcon } from '@/components/tiptap/tiptap-icons/underline-icon';

// --- Lib ---
import { isMarkInSchema } from '@/utils/tiptap-utils';

// --- UI Primitives ---
import { Button, ButtonProps } from '@/components/tiptap/tiptap-ui-primitive/button';

export type Mark = 'bold' | 'italic' | 'strike' | 'code' | 'underline' | 'superscript' | 'subscript';

export interface MarkButtonProps extends Omit<ButtonProps, 'type'> {
	/**
	 * The type of mark to toggle
	 */
	type: Mark;
	/**
	 * Optional editor instance. If not provided, will use editor from context
	 */
	editor?: Editor | null;
	/**
	 * Display text for the button (optional)
	 */
	text?: string;
	/**
	 * Whether this button should be hidden when the mark is not available
	 */
	hideWhenUnavailable?: boolean;
}

export const markIcons = {
	bold: BoldIcon,
	italic: ItalicIcon,
	underline: UnderlineIcon,
	strike: StrikeIcon,
	code: Code2Icon,
	superscript: SuperscriptIcon,
	subscript: SubscriptIcon
};

export const markShortcutKeys: Partial<Record<Mark, string>> = {
	bold: 'Ctrl-b',
	italic: 'Ctrl-i',
	underline: 'Ctrl-u',
	strike: 'Ctrl-Shift-s',
	code: 'Ctrl-e',
	superscript: 'Ctrl-.',
	subscript: 'Ctrl-,'
};

export function canToggleMark(editor: Editor | null, type: Mark): boolean {
	if (!editor) return false;

	try {
		return editor.can().toggleMark(type);
	} catch {
		return false;
	}
}

export function isMarkActive(editor: Editor | null, type: Mark): boolean {
	if (!editor) return false;

	return editor.isActive(type);
}

export function toggleMark(editor: Editor | null, type: Mark): void {
	if (!editor) return;

	editor.chain().focus().toggleMark(type).run();
}

export function isMarkButtonDisabled(editor: Editor | null, type: Mark, userDisabled = false): boolean {
	if (!editor) return true;

	if (userDisabled) return true;

	if (editor.isActive('codeBlock')) return true;

	if (!canToggleMark(editor, type)) return true;

	return false;
}

export function shouldShowMarkButton(params: {
	editor: Editor | null;
	type: Mark;
	hideWhenUnavailable: boolean;
	markInSchema: boolean;
}): boolean {
	const { editor, type, hideWhenUnavailable, markInSchema } = params;

	if (!markInSchema) {
		return false;
	}

	if (hideWhenUnavailable) {
		if (isNodeSelection(editor?.state.selection) || !canToggleMark(editor, type)) {
			return false;
		}
	}

	return true;
}

export function getFormattedMarkName(type: Mark): string {
	return type.charAt(0).toUpperCase() + type.slice(1);
}

export function useMarkState(editor: Editor | null, type: Mark, disabled = false) {
	const markInSchema = isMarkInSchema(type, editor);
	const isDisabled = isMarkButtonDisabled(editor, type, disabled);
	const isActive = isMarkActive(editor, type);

	const Icon = markIcons[type];
	const shortcutKey = markShortcutKeys[type];
	const formattedName = getFormattedMarkName(type);

	return {
		markInSchema,
		isDisabled,
		isActive,
		Icon,
		shortcutKey,
		formattedName
	};
}

export const MarkButton = React.forwardRef<HTMLButtonElement, MarkButtonProps>(
	(
		{
			editor: providedEditor,
			type,
			text,
			hideWhenUnavailable = false,
			className = '',
			disabled,
			onClick,
			children,
			...buttonProps
		},
		ref
	) => {
		const editor = useTiptapEditor(providedEditor);

		const { markInSchema, isDisabled, isActive, Icon, shortcutKey, formattedName } = useMarkState(
			editor,
			type,
			disabled
		);

		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(e);

				if (!e.defaultPrevented && !isDisabled && editor) {
					toggleMark(editor, type);
				}
			},
			[onClick, isDisabled, editor, type]
		);

		const show = React.useMemo(() => {
			return shouldShowMarkButton({
				editor,
				type,
				hideWhenUnavailable,
				markInSchema
			});
		}, [editor, type, hideWhenUnavailable, markInSchema]);

		if (!show || !editor || !editor.isEditable) {
			return null;
		}

		return (
			<Button
				type="button"
				className={className.trim()}
				disabled={isDisabled}
				data-style="ghost"
				data-active-state={isActive ? 'on' : 'off'}
				data-disabled={isDisabled}
				role="button"
				tabIndex={-1}
				aria-label={type}
				aria-pressed={isActive}
				tooltip={formattedName}
				shortcutKeys={shortcutKey}
				onClick={handleClick}
				{...buttonProps}
				ref={ref}
			>
				{children || (
					<>
						<Icon className="tiptap-button-icon" />
						{text && <span className="tiptap-button-text">{text}</span>}
					</>
				)}
			</Button>
		);
	}
);

MarkButton.displayName = 'MarkButton';

export default MarkButton;
