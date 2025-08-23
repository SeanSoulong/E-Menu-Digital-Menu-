import Image from "next/image";
import { Product } from "../data/types";

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
      <div className="p-2 ">
        <span className="text-[12px] font-bold text-[#3F3F3F]">
          ID : {product.id}
        </span>
        <h3 className="font-bold text-[14px] truncate">{product.name}</h3>
        <div className="mt-1 ">
          <span className="text-[12px] font-bold text-[#F05656]">
            {product.priceUsd}
          </span>
          <span className="text-[12px] font-bold text-[#F05656] ml-1">
            {product.priceKhr}
          </span>
        </div>
      </div>
    </div>
  );
}
