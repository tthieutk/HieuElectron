import { Button } from ".";

interface ButtonAddProps {
  onButtonClick?: () => void;
  path_add: string;
}

const ButtonAdd: React.FC<ButtonAddProps> = ({ onButtonClick, path_add }) => {
  return <Button to={path_add} onButtonClick={onButtonClick}>Thêm mới</Button>
}

export default ButtonAdd;
