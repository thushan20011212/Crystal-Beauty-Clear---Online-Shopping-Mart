import { useState } from "react"
import AdminProductPage from "./adminProductPage"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"



export default function addProductPage() {

    const [productId,setProductId] = useState('') 
    const [name,setName] = useState('')
    const [altNames,setAltNames] = useState('')
    const [description,setDescription] = useState('')
    const [image,setImage] = useState([])
    const [labelledPrice,setLabelledPrice] = useState(0)
    const [price,setPrice] = useState(0)
    const [stock,setStock] = useState(0)
    const navigate = useNavigate

    async function AddProduct() {

        const token = localStorage.getItem("token")
        if(token == null){
            toast.error("Please Login First")
            return
        }

        if (images.length <=0){
            toast.error("Please Login First")
            return
        }

        const promisesArray = [];

        for (let i=0; i < images.length; i++){
            promisesArray[i] = mediaUpload(images[i]);
        }
        try{
            const imageUrls = await promise.all(promisesArray);
            console.log(imageUrls);

            const altNamesArray = altNames.split(",")

            const product = {
                productId : productId,
                name : name,
                altNames : altNamesArray,
                description : description,
                image : imageUrls,
                labelledPrice : labelledPrice,
                price : price,
                stock : stock
            }
            axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products" , product , {
                headers : {
                    "Authorization" : "Barer "+token
                }
            }).then((res) => {
                toast.success("Product Added Successfully")
                navigate("admin/products")

            }).catch((e) => {
                toast.error(e.response.data.message)
            })

        } catch(e){
            console.log(e);
        }

    return (
        <div className="w-full h-full flex-col justify-center items-center">
            <input type="text" placeholder="Product Id" className="input input-bordered w-full max-w-x" value={productId} onChange={(e)=>setProductId(e.target.value)}/>
            <input type="text" placeholder="Name" className="input input-bordered w-full max-w-x" value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder="Alt Names" className="input input-bordered w-full max-w-x" value={altNames} onChange={(e)=>setAltNames(e.target.value)}/>
            <input type="text" placeholder="Description" className="input input-bordered w-full max-w-x" value={description} onChange={(e)=>setDescription(e.target.value)}/>
            <input type="file" placeholder="Image" multiple className="input input-bordered w-full max-w-x" value={image} onChange={(e)=>setImage(e.target.files)}/>
            <input type="number" placeholder="Labelled Price" className="input input-bordered w-full max-w-x" value={labelledPrice} onChange={(e)=>setLabelledPrice(e.target.value)}/>
            <input type="number" placeholder="price" className="input input-bordered w-full max-w-x" value={price} onChange={(e)=>setPrice(e.target.value)}/>
            <input type="number" placeholder="Stock" className="input input-bordered w-full max-w-x" value={stock} onChange={(e)=>setStock(e.target.value)}/>
            <div className="w-full flex justify-center flex-row items-center mt-4">
                <Link to="/admin/products" className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4">Cancel</Link>
                <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={AddProduct}>Add Product</button>
            </div>
        </div>
    )
    }

}