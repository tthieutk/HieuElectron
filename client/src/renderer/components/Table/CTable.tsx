type CTableProps = {
  children: React.ReactNode
}

export const CTable = (props: CTableProps) => {
  return (
    <div className='table-container'>
      <table className="table table__custom">
        {props.children}
      </table>
    </div>
  )
}
