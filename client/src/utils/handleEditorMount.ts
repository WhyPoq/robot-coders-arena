import * as monacoEditor from "monaco-editor";
import { Monaco } from "@monaco-editor/react";

function handleEditorMount(_editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco) {
	monaco.languages.register({ id: "seclang" });

	const baseKeywords = [
		"let",
		"if",
		"else",
		"while",
		"for",
		"function",
		"continue",
		"break",
		"return",
	];

	const highlightKeywords = baseKeywords.concat(["true", "false", "len"]);

	// Define tokens for syntax highlighting
	monaco.languages.setMonarchTokensProvider("seclang", {
		tokenizer: {
			root: [
				[
					/@?[a-zA-Z_][\w$]*/,
					{ cases: { "@keywords": "keyword", "@default": "identifier" } },
				],
				{ include: "@whitespace" },
				[/\d+/, "number"],
				[/"[^"]*"/, "string"],
				[/'[^']*'/, "string"],

				// Match single-line comments
				[/\/\/.*$/, "comment"],
				// Match the start of a multi-line comment and enter the 'comment' state
				[/\/\*/, "comment", "@comment"],
			],
			whitespace: [[/\s+/, "white"]],
			// State to handle multi-line comments
			comment: [
				// Match the end of the multi-line comment and return to the root state
				[/\*\//, "comment", "@pop"],

				// Match any content inside the comment (including new lines)
				[/./, "comment"],
			],
		},
		keywords: highlightKeywords,
	});

	// Set language configuration (brackets, comments, auto-closing)
	monaco.languages.setLanguageConfiguration("seclang", {
		comments: {
			lineComment: "//",
			blockComment: ["/*", "*/"],
		},
		brackets: [
			["{", "}"],
			["[", "]"],
			["(", ")"],
		],
		autoClosingPairs: [
			{ open: "{", close: "}" },
			{ open: "[", close: "]" },
			{ open: "(", close: ")" },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
		],
	});

	// Register a completion provider for keywords and existing variables
	monaco.languages.registerCompletionItemProvider("seclang", {
		provideCompletionItems: (model, position) => {
			const word = model.getWordUntilPosition(position);
			const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn,
			};

			function getWordsSuggestions(
				words: string[],
				kind: monacoEditor.languages.CompletionItemKind
			) {
				return words.map((curWord) => ({
					label: curWord,
					kind: kind,
					insertText: curWord,
					range,
				}));
			}

			const suggestKeywords = baseKeywords.concat(["true", "false"]);

			const keywordSuggestions = getWordsSuggestions(
				suggestKeywords,
				monacoEditor.languages.CompletionItemKind.Keyword
			);

			const builtinFunctionsSuggestions = getWordsSuggestions(
				["print", "sqrt", "len"],
				monacoEditor.languages.CompletionItemKind.Function
			);

			return { suggestions: [...keywordSuggestions, ...builtinFunctionsSuggestions] };
		},
	});
}

export default handleEditorMount;
