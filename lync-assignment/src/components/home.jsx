import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Edit2,
  Search,
  Grid,
  List,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import useFileSystem from "../hooks";
import Item from "./item";
import Breadcrumb from "./breadCrumb";
import SearchResults from "./searchResults";

const OnlineDrive = () => {
  const {
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
  } = useFileSystem();
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState("file");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const currentFolder = useMemo(
    () => fileSystem[currentPath[currentPath?.length - 1]],
    [fileSystem, currentPath]
  );

  const items = Object.values(currentFolder?.children);

  const searchResults = useMemo(
    () => (searchTerm ? searchItems(searchTerm) : []),
    [searchTerm, searchItems]
  );

  const handleCreateItem = () => {
    if (newItemName?.trim() && createItem(newItemName?.trim(), newItemType)) {
      setNewItemName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleRenameItem = () => {
    if (
      newItemName?.trim() &&
      selectedItem &&
      renameItem(selectedItem, newItemName?.trim())
    ) {
      setNewItemName("");
      setIsRenameDialogOpen(false);
      setSelectedItem(null);
    }
  };
  return (
    <div className="h-screen flex">
      <div className="w-64 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Files</h2>
        <div className="space-y-2">
          {Object.values(fileSystem?.root?.children)?.map((item) => (
            <Item
              key={item?.id}
              item={item}
              onNavigate={navigateToFolder}
              onSelect={setSelectedItem}
              isSelected={selectedItem === item?.id}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 p-4">
        {error && (
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="outline"
            onClick={navigateBack}
            disabled={currentPath?.length === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Breadcrumb path={currentPath} fileSystem={fileSystem} />

          <div className="flex-1" />
          <Input
            className="max-w-xs"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <Button
            variant="outline"
            onClick={() =>
              setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
            }
          >
            {viewMode === "grid" ? (
              <List className="w-4 h-4" />
            ) : (
              <Grid className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex space-x-2 mb-4">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button
                    variant={newItemType === "file" ? "default" : "outline"}
                    onClick={() => setNewItemType("file")}
                  >
                    File
                  </Button>
                  <Button
                    variant={newItemType === "folder" ? "default" : "outline"}
                    onClick={() => setNewItemType("folder")}
                  >
                    Folder
                  </Button>
                </div>
                <Button onClick={handleCreateItem}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => selectedItem && setIsRenameDialogOpen(true)}
            disabled={!selectedItem}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Rename
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              if (selectedItem) {
                deleteItem(selectedItem);
                setSelectedItem(null);
              }
            }}
            disabled={!selectedItem}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        {searchTerm ? (
          <SearchResults
            results={searchResults}
            onNavigate={navigateToFolder}
            onSelect={setSelectedItem}
            selectedItem={selectedItem}
          />
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-4 gap-4" : "space-y-2"
            }
          >
            {items?.map((item) => (
              <Item
                key={item.id}
                item={item}
                onNavigate={navigateToFolder}
                onSelect={setSelectedItem}
                isSelected={selectedItem === item.id}
              />
            ))}
          </div>
        )}

        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter new name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <Button onClick={handleRenameItem}>Rename</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OnlineDrive;
