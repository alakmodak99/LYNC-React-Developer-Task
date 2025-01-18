
import * as React from 'react'

const Breadcrumb = ({ path, fileSystem }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    {path?.map((id, index) => (
      <React.Fragment key={id}>
        {index > 0 && <span>/</span>}
        <span className="font-medium">{fileSystem?.[id]?.name || ""}</span>
      </React.Fragment>
    ))}
  </div>
);

export default Breadcrumb;