import './TextGroup.scss';
type attr = {
    text: string;
}
export const TextGroup = () => {
    return (
        <span className="titlegroup">Nhóm: Web</span>
    );
};
export const TextLead = (props : attr) => {
    let text_title = props.text;
    return (
        <p className="txt-lead"><span>{text_title}</span></p>
    );
};
export const TextRight = (props : attr) => {
    let text_title = props.text;
    return (
        <p className="txt-right"><span>{text_title}</span></p>
    );
};