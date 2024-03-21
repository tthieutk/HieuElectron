type ButtonCenterProps = {
  children: React.ReactNode;
};

export const ButtonCenter = (props: ButtonCenterProps) => {
  return <div className="wrp-button">{props.children}</div>
};
