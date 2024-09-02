import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";
import { isValidObjectId } from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// ADD PRODUCT
const addProduct = async (req, res) => {
    const { name, category, price } = req.body

    const productPath = req.file?.path
    if (!productPath) return res.status(404).json(new ApiResponse(404, null, "Shop image missing"))

    const productCloud = await uploadOnCloudinary(productPath)
    if (!productCloud) return res.status(404).json(new ApiResponse(404, null, "Shop image not found"))

    const product = await Product.create({
        name, category, price, image: productCloud.secure_url
    })
    if (!product) return res.status(500).json(new ApiResponse(500, null, "Something went wrong"))

    return res.status(201).json(new ApiResponse(201, product, "Product added"))
}

const removeProduct = async (req, res) => {
    const { productId } = req.params
    if (!productId) return res.status(400).json(new ApiResponse(400, "", "Product Id missing"))

    await Product.findByIdAndDelete(productId)

    return res.status(200).json(new ApiResponse(200, "", "Product removed"))
}

const updateProduct = async (req, res) => {
    const { productId } = req.params
    if (!productId || !isValidObjectId(productId)) return res.status(400).json(new ApiResponse(400, "", "Product Id missing"))

    const { price, category } = req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json(new ApiResponse(404, "", "Product doesn't exist"))

    if (price) product.price = price
    if (category) product.category = category

    const updatedProduct = await product.save({ validateBeforeSave: false })
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"))
}

export {
    addProduct,
    removeProduct,
    updateProduct,
}