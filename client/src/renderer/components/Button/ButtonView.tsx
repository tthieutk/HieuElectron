import { Button } from ".";

interface ButtonViewProps {
  onButtonClick?: () => void;
}

const ButtonView: React.FC<ButtonViewProps> = ({ onButtonClick }) => {
  return <Button onButtonClick={onButtonClick}>Xem Thẻ Giờ</Button>
}

export default ButtonView;
