import toast from "react-hot-toast"
import { useEffect, useState } from "react"

export default function ProductOverviewPage() {
    const params = useParams()
    const productId = params.id
    const [status, setStatus] = useState("loading") //loading ,success, error
    const [product, setProduct] = useState(null)

    useEffect(
        () => {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId).then(
                (response) => {
                    setProduct(response.data)
                    setStatus("success")
                }
            ).catch(
                (error) => {
                    console.error(error)
                    setStatus("error")
                    toast.error("Failed to fetch product")
                }
            )
        }
    )

  return (
    <div>
      <h1>Product Overview</h1>
    </div>
  );
}
