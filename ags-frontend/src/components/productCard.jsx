import { Link, useNavigate } from "react-router-dom"
import { addToCart } from "../utils/cart.js"
import { toast } from "react-hot-toast"

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const {
    name,
    description,
    price,
    labelledPrice,
    image,
    stock,
    isAvailable,
  } = product

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`${name} added to cart!`)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate("/checkout", {
      state: {
        cart: [
          {
            productId: product.productId,
            name: product.name,
            image: product.image?.[0] || "/placeholder.svg",
            price: product.price,
            labelledPrice: product.labelledPrice,
            qty: 1
          }
        ]
      }
    })
  }

  return (
    <Link to={"/overview/"+product.productId} className="block w-full h-full">
      <div
        className={`w-full h-full flex flex-col bg-neutral rounded-2xl shadow-lg overflow-hidden
        transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
        ${!isAvailable ? "opacity-60 pointer-events-none" : ""}`}
      >
        {/* Image - Fixed Height */}
        <div className="relative h-52 bg-primary shrink-0">
          <img
            src={image?.[0] || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg"
            }}
          />

          {!isAvailable && (
            <span className="absolute top-3 left-3 bg-secondary text-neutral text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Content - Flex Grow */}
        <div className="flex flex-col grow p-4">
          {/* Title - Fixed Height */}
          <h3 className="text-lg font-semibold text-secondary hover:text-muted line-clamp-2 h-14 mb-2">
            {name}
          </h3>

          {/* Description - Fixed Height */}
          <p className="text-sm text-muted leading-relaxed line-clamp-3 h-18 mb-3">
            {description}
          </p>

          {/* Price - Fixed Height */}
          <div className="flex items-center gap-2 h-7 mb-2">
            <span className="text-lg font-bold text-secondary">
              ₨{price?.toFixed(2)}
            </span>

            {labelledPrice > price && (
              <span className="text-sm text-muted line-through">
                ₨{labelledPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock - Fixed Height */}
          <div
            className={`text-sm font-medium h-5 mb-3 ${
              stock > 0 ? "text-secondary" : "text-muted"
            }`}
          >
            {stock > 0 ? "In Stock" : "Out of Stock"}
          </div>

          {/* Buttons - Push to bottom */}
          <div className="flex gap-2 mt-auto">
            <button
              disabled={!isAvailable || stock === 0}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold
              bg-secondary text-neutral transition-colors
              hover:bg-muted disabled:bg-accent disabled:cursor-not-allowed"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              disabled={!isAvailable || stock === 0}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold
              bg-accent text-secondary transition-colors
              hover:bg-secondary hover:text-neutral disabled:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard