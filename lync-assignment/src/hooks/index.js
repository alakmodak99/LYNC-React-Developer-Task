import { useState, useEffect, useCallback } from "react";
import { INITIAL_FILE_SYSTEM } from "../utils";
const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem("fileSystem");
    return saved ? JSON.parse(saved) : INITIAL_FILE_SYSTEM;
  });

  const [currentPath, setCurrentPath] = useState(["root"]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    localStorage.setItem("fileSystem", JSON.stringify(fileSystem));
  }, [fileSystem]);

  const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

  const handleError = (message) => {
    setError(message);
    const time_out_id = setTimeout(() => setError(null), 3000);
    return () => {
      clearTimeout(time_out_id);
    };
  };

  const createItem = useCallback(
    (name, type) => {
      const currentFolder = currentPath?.[currentPath?.length - 1];
      const newId = generateId();
      const timestamp = Date.now();

      const isDuplicate = Object?.values(
        fileSystem?.[currentFolder].children
      ).some((item) => item?.name?.trim()?.toLowerCase() === name?.trim()?.toLowerCase());

      if (isDuplicate) {
        handleError("An item with this name already exists");
        return false;
      }

      setFileSystem((prev) => ({
        ...prev,
        [currentFolder]: {
          ...prev[currentFolder],
          children: {
            ...prev?.[currentFolder]?.children,
            [newId]: {
              id: newId,
              name,
              type,
              parent: currentFolder,
              createdAt: timestamp,
              modifiedAt: timestamp,
            },
          },
          modifiedAt: timestamp,
        },
        ...(type === "folder"
          ? {
              [newId]: {
                id: newId,
                name,
                type: "folder",
                children: {},
                parent: currentFolder,
                createdAt: timestamp,
                modifiedAt: timestamp,
              },
            }
          : {}),
      }));
      return true;
    },
    [currentPath, fileSystem]
  );

  const deleteItem = useCallback(
    (id) => {
      const currentFolder = currentPath[currentPath.length - 1];
      const item = fileSystem[currentFolder].children[id];
      if (!item) return;

      setFileSystem((prev) => {
        const newState = { ...prev };
        delete newState[currentFolder].children[id];
        if (item.type === "folder") {
          const deleteFolder = (folderId) => {
            Object.values(newState[folderId].children).forEach((child) => {
              if (child.type === "folder") {
                deleteFolder(child.id);
              }
            });
            delete newState[folderId];
          };
          deleteFolder(id);
        }
        newState[currentFolder].modifiedAt = Date.now();
        return newState;
      });
    },
    [currentPath, fileSystem]
  );

  const renameItem = useCallback(
    (id, newName) => {
      const currentFolder = currentPath[currentPath.length - 1];

      const isDuplicate = Object.values(
        fileSystem[currentFolder].children
      ).some(
        (item) =>
          item.name.toLowerCase() === newName.toLowerCase() && item.id !== id
      );

      if (isDuplicate) {
        handleError("An item with this name already exists");
        return false;
      }

      setFileSystem((prev) => ({
        ...prev,
        [currentFolder]: {
          ...prev[currentFolder],
          children: {
            ...prev[currentFolder].children,
            [id]: {
              ...prev[currentFolder].children[id],
              name: newName,
              modifiedAt: Date.now(),
            },
          },
          modifiedAt: Date.now(),
        },
      }));
      return true;
    },
    [currentPath, fileSystem]
  );

  const navigateToFolder = useCallback((id) => {
    setCurrentPath((prev) => [...prev, id]);
    setSelectedItem(null);
  }, []);

  const navigateBack = useCallback(() => {
    if (currentPath.length > 1) {
      setCurrentPath((prev) => prev.slice(0, -1));
      setSelectedItem(null);
    }
  }, [currentPath]);

  const searchItems = useCallback(
    (term) => {
      const results = [];
      const search = (folderId, path) => {
        const folder = fileSystem[folderId];
        Object.values(folder.children).forEach((item) => {
          if (item.name.toLowerCase().includes(term.toLowerCase())) {
            results.push({ ...item, path });
          }
          if (item.type === "folder") {
            search(item.id, [...path, item.name]);
          }
        });
      };
      search("root", []);
      return results;
    },
    [fileSystem]
  );

  return {
    fileSystem,
    currentPath,
    selectedItem,
    error,
    searchTerm,
    viewMode,
    setSelectedItem,
    setSearchTerm,
    setViewMode,
    createItem,
    deleteItem,
    renameItem,
    navigateToFolder,
    navigateBack,
    searchItems,
  };
};

export default useFileSystem;
