import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";

// ADD PRODUCT
const addProduct = async (req, res) => {
    const { name, category, price, stock, description } = req.body

    const product = await Product.create({
        name, vendor: req.user._id, category, price, stock, description
    })
    if (!product) return res.status(500).json(new ApiResponse(500, null, "Something went wrong"))

    return res.status(201).json(new ApiResponse(201, product, "Product added"))
}

const removeProduct = async (req, res) => {
    const {productId} = req.params
    if (!productId) return res.status(400).json(new ApiResponse(400, "", "Product Id missing"))

    await Product.findByIdAndDelete(productId)

    return res.status(200).json(new ApiResponse(200, "", "Product removed"))

}

export {
    addProduct,
    removeProduct,
}