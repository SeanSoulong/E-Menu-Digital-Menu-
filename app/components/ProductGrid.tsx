import { Product } from "../data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onProductClick,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center p-6 text-gray-500 text-lg">
        No products found for your selection.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
}
