import MonacoEditor from "@monaco-editor/react";
import { EditorProps } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { editor } from "monaco-editor";
import { addDefaultsFields } from "../utils/addDefaultFields";

interface WrappedEditorProps extends EditorProps {
	className?: string;
	setLineCount?: (newLineCount: number) => void;
	startFromLineNumber?: number;
	value?: string;
}

const WrappedEditor = ({
	className = "",
	setLineCount,
	startFromLineNumber,
	value,
	...editorProps
}: WrappedEditorProps) => {
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const [isEditorSet, setIsEditorSet] = useState(false);

	useEffect(() => {
		if (value) editorRef.current?.setValue(value);
	}, [value, isEditorSet]);

	addDefaultsFields(editorProps, {
		defaultLanguage: "javascript",
		defaultValue: "",
		theme: "vs-dark",
	});

	if (!editorProps.options) editorProps.options = {};

	addDefaultsFields(editorProps.options, {
		minimap: {
			enabled: false,
		},
		contextmenu: false,
		fontSize: 16,
		padding: {
			top: 10,
		},
	});

	if (startFromLineNumber && !editorProps.options.lineNumbers) {
		editorProps.options.lineNumbers = (lineNumber) => {
			return (startFromLineNumber + lineNumber).toString();
		};
	}

	return (
		<div className="relative h-full">
			<div className={["absolute top-0 bottom-0 right-0 left-0", className].join(" ")}>
				<MonacoEditor
					onChange={(value, ev) => {
						const model = editorRef.current?.getModel();
						if (model && setLineCount) {
							setLineCount(model.getLineCount());
						}

						if (editorProps.onChange) editorProps.onChange(value, ev);
					}}
					onMount={(editor, monaco) => {
						const model = editor.getModel();
						if (model !== null && setLineCount) {
							setLineCount(model.getLineCount());
						}
						editorRef.current = editor;
						setIsEditorSet(true);

						if (editorProps.onMount) editorProps.onMount(editor, monaco);
					}}
					{...editorProps}
				/>
			</div>
		</div>
	);
};

export default WrappedEditor;
