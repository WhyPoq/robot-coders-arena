import WrappedEditor from "./WrappedEditor";
import { useRef, useCallback } from "react";
import { constrainedEditor } from "constrained-editor-plugin";
import { editor } from "monaco-editor";
import { Monaco } from "@monaco-editor/react";

interface CodeEditorProps {
	code: string;
	setCode: (newVal: string) => void;
}

interface IRestriction {
	range: number[];
	allowMultiline: boolean;
}

function getWholeCode(innerCode: string) {
	return `\
const ATTACK = 1;
const BLOCK = 2;
const UPGRADE = 3;

function move(shortMemory, enemyPrevMove, stats, enemyStats, longMemory) {
${innerCode}
}\
`;
}

const CodeEditor = ({ code, setCode }: CodeEditorProps) => {
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	let restrictions: IRestriction[] = [];

	const handleEditorDidMount = useCallback(
		(editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
			editorRef.current = editor;
			const constrainedInstance = constrainedEditor(monaco);
			const model = editor.getModel();
			constrainedInstance.initializeIn(editor);

			editor.setValue(getWholeCode(code));
			const startingCodeLines = code.split("\n");
			restrictions.push({
				range: [
					6,
					1,
					6 + startingCodeLines.length - 1,
					startingCodeLines[startingCodeLines.length - 1].length + 1,
				],
				allowMultiline: true,
			});
			constrainedInstance.addRestrictionsTo(model, restrictions);

			(model as any).onDidChangeContentInEditableRange(
				(currentlyChangedContent: { [key: string]: string }) => {
					setCode(Object.values(currentlyChangedContent)[0]);
				}
			);

			(model as any).toggleHighlightOfEditableAreas({});
		},
		[setCode, code]
	);

	return (
		<div className="h-full flex flex-col">
			<WrappedEditor onMount={handleEditorDidMount} />
		</div>
	);
};

export default CodeEditor;
