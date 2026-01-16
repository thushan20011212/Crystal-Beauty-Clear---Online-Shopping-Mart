

const ProductCard = ({ product }) => {
  const {
    name,
    description,
    price,
    labelledPrice,
    image,
    stock,
    isAvailabel,
  } = product;

  return (
    <Link to={"/overview/"+product.productId}
      className={`w-[280px] bg-white rounded-2xl shadow-lg overflow-hidden
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
      ${!isAvailabel ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100">
        <img
          src={image?.[0] || "/placeholder.png"}
          alt={name}
          className="w-full h-full object-cover"
        />

        {!isAvailabel && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {name}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-900">
            ₹{price}
          </span>

          {labelledPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{labelledPrice}
            </span>
          )}
        </div>

        {/* Stock */}
        <div
          className={`text-sm font-medium ${
            stock > 0 ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {stock > 0 ? `${stock} in stock` : "No stock available"}
        </div>

        {/* Button */}
        <button
          disabled={!isAvailabel || stock === 0}
          className="w-full mt-2 py-3 rounded-xl text-sm font-semibold
          bg-blue-900 text-white transition-colors
          hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
