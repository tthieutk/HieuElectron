import { Button } from ".";

interface ButtonSaveProps {
  onButtonClick?: () => void;
}

const ButtonSave: React.FC<ButtonSaveProps> = ({ onButtonClick }) => {
  return <Button onButtonClick={onButtonClick}><img src={require('../../../../assets/icnedit.png')} alt="save" className="fluid-image"/></Button>
}

export default ButtonSave;
