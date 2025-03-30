export const Checkbox = ({
	children,
	checkboxClass,
	indeterminate,
	style,
	title = "",
	...props
}) => {
	return (
		<label className={checkboxClass} title={title}>
			<input
				ref={setIndeterminate(indeterminate)}
				type="checkbox"
				style={{ marginLeft: 0, ...style }}
				{...props}
			/>
			{children}
		</label>
	);
};

// Source: https://davidwalsh.name/react-indeterminate
const setIndeterminate = (indeterminate) => (element) => {
	if (element) {
		element.indeterminate = indeterminate;
	}
};
