type CTableHeadProps = {
  heads: string[];
};

export const CTableHead = (props: CTableHeadProps) => {
  return (
    <thead>
      <tr>
        {props.heads.map((value, index) => (
          <th key={index}>{value}</th>
        ))}
      </tr>
    </thead>
  )
}
