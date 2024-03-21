import './GlobalStyles.scss';

// const GlobalStyles: React.FC<Props> = (props: Props): JSX.Element => {
//   const { children } = props;

//   return children;
// };

// export default GlobalStyles;

type GlobalStylesProps = {
	children?: any;
};
export const GlobalStyles = (prop: GlobalStylesProps) => {
	return prop.children;
};
