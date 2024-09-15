interface InputFieldProps {
	name: string;
	error: string | null;
	value: string;
	setValue: (newValue: string) => void;
	type?: React.HTMLInputTypeAttribute;
}

const InputField = ({ name, error, value, setValue, type }: InputFieldProps) => {
	const idName = name.replace(" ", "-");
	const inputId = `${idName}-input`;
	return (
		<div>
			<label htmlFor={inputId} className="text-center mb-1 opacity-85 block">
				{name}
			</label>
			<input
				id={inputId}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				className="bg-transparent border border-white outline-none focus:border-vscode-cyan rounded w-full p-2"
				type={type}
			/>
			{error !== null && <p className="text-red-500">{error}</p>}
		</div>
	);
};

export default InputField;
