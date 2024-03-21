import { Button } from ".";

interface ButtonExportProps {
  onButtonClick?: () => void;
}

const ButtonExport: React.FC<ButtonExportProps> = ({ onButtonClick }) => {
  return <Button onButtonClick={onButtonClick} color="green">Xuất Thẻ Giờ</Button>
}

export default ButtonExport;
