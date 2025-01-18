import * as React from 'react';
import Item from './item';

const SearchResults = ({ results, onNavigate, onSelect, selectedItem }) => (
  <div className="space-y-2">
    <h3 className="font-medium">Search Results</h3>
    {results.map((item) => (
      <div key={item.id} className="ml-2">
        <Item
          item={item}
          onNavigate={onNavigate}
          onSelect={onSelect}
          isSelected={selectedItem === item.id}
        />
        <div className="text-xs text-gray-500 ml-7">
          Path: /{item.path.join("/")}
        </div>
      </div>
    ))}
  </div>
);

export default SearchResults;