/** @type {import('tailwindcss').Config} */

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"vscode-editor-background": "#1e1e1e",
				"vscode-cyan": "#3dc9b0",
				"vscode-blue": "#569cd6",
				"vscode-light-green": "#b5cea8",
			},
			fontFamily: {
				"roboto-mono": ['"Roboto Mono"', "monospace"],
			},
		},
	},
	plugins: [],
};
