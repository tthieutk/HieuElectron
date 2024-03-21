import { Link } from "react-router-dom";

interface ButtonEditProps {
  href: string;
}

const ButtonEdit: React.FC<ButtonEditProps> = ({ href }) => {
  return <Link to={href} className="btn--icon"><img src={require('../../../../assets/icnedit.png')} alt="edit" className="fluid-image" /></Link>
}

export default ButtonEdit;
