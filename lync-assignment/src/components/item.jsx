import * as React from 'react'
import {
  Folder,
  File,
} from "lucide-react";
const Item = ({ item, onNavigate, onSelect, isSelected }) => {
  const formattedDate = new Date(item?.modifiedAt).toLocaleDateString();
  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex items-center p-2 rounded cursor-pointer ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
      onClick={() => onSelect(item?.id)}
      onDoubleClick={() => item?.type === "folder" && onNavigate(item?.id)}
      onKeyDown={(e) => {
        if (e?.key === "Enter") {
          item?.type === "folder" ? onNavigate(item?.id) : onSelect(item?.id);
        }
      }}
      aria-label={`${item?.type} ${item?.name}`}
    >
      {item.type === "folder" ? (
        <Folder className="w-5 h-5 text-blue-500 mr-2" />
      ) : (
        <File className="w-5 h-5 text-gray-500 mr-2" />
      )}
      <div className="flex-1">
        <div>{item?.name || ""}</div>
        <div className="text-xs text-gray-500">Modified: {formattedDate}</div>
      </div>
    </div>
  );
};

export default Item;