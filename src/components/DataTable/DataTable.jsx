"use client";

export default function DataTable({ columns, data, loading }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle text-nowrap">
        <thead className="bg-light">
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No data
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.propertyListId || i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
