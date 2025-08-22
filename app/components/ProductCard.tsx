import Image from "next/image";
import { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
    >
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 ">
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.category}</p>
        <div className="mt-2 ">
          <span className="text-lg font-bold text-gray-800">
            {product.priceUsd}
          </span>
          <span className="text-sm text-gray-500 ml-2">{product.priceKhr}</span>
        </div>
      </div>
    </div>
  );
}
