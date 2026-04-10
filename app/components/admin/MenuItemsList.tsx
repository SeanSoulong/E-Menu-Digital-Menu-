import { MenuItem, Category } from "../../data/types";
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";
import MobileMenuItemCard from "./MobileMenuItemCard";
import DesktopMenuItemTable from "./DesktopMenuItemTable";
import EmptyState from "./EmptyState";
import { useLanguage } from "../../context/LanguageContext";

interface MenuItemsListProps {
  menuItems: MenuItem[];
  categories: Category[];
  editingItem: MenuItem | null;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  statusFilter: "all" | "available" | "unavailable";
  setStatusFilter: (value: "all" | "available" | "unavailable") => void;
  sortBy: "name" | "price" | "date";
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  screenSize: "mobile" | "tablet" | "desktop";
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (item: MenuItem) => void;
  onSort: (field: "name" | "price" | "date") => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  onOpenImagePreview: (
    imageUrl: string,
    allImages: string[],
    index: number
  ) => void;
}

export default function MenuItemsList({
  menuItems,
  categories,
  editingItem,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  sortBy,
  sortOrder,
  currentPage,
  itemsPerPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  screenSize,
  onEdit,
  onDelete,
  onToggleAvailability,
  onSort,
  onClearFilters,
  onPageChange,
  onItemsPerPageChange,
  onOpenImagePreview,
}: MenuItemsListProps) {
  const { language } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
        onClearFilters={onClearFilters}
        categories={categories}
        totalItems={totalItems}
        menuItemsCount={menuItems.length}
        editingItem={editingItem}
        onCancelEdit={() => {}}
      />

      <div id="items-container">
        {screenSize === "desktop" ? (
          <DesktopMenuItemTable
            menuItems={menuItems}
            editingItem={editingItem}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleAvailability={onToggleAvailability}
            onOpenImagePreview={onOpenImagePreview}
          />
        ) : (
          <MobileMenuItemCard
            menuItems={menuItems}
            editingItem={editingItem}
            screenSize={screenSize}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleAvailability={onToggleAvailability}
            onOpenImagePreview={onOpenImagePreview}
          />
        )}
      </div>

      {menuItems.length === 0 && <EmptyState onClearFilters={onClearFilters} />}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}
    </div>
  );
}
