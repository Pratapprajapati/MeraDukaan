import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";
import { isValidObjectId } from "mongoose";

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
    const { productId } = req.params
    if (!productId) return res.status(400).json(new ApiResponse(400, "", "Product Id missing"))

    await Product.findByIdAndDelete(productId)

    return res.status(200).json(new ApiResponse(200, "", "Product removed"))

}

const updateProduct = async (req, res) => {
    const { productId } = req.params
    if (!productId || !isValidObjectId(productId)) return res.status(400).json(new ApiResponse(400, "", "Product Id missing"))

    const { price, stock, description } = req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json(new ApiResponse(404, "", "Product doesn't exist"))

    if ((product.vendor).toString() !== (req.user?._id).toString()) {
        return res.status(400).json(new ApiResponse(400, "", "Product doesn't belong to this vendor"))
    }

    if  (typeof stock !== 'undefined') product.stock = stock
    if (price) product.price = price
    if (description) product.description = description

    const updatedProduct = await product.save({ validateBeforeSave: false })
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"))
}

const getInventory = async (req, res) => {
    const { vendorId } = req.params
    if (!vendorId) return res.status(400).json(new ApiResponse(400, "", "Vendor Id missing"))

    const inventory = await Product.find({ vendor: vendorId })

    return res.status(200).json(new ApiResponse(200, inventory, "Inventory fetched"))
}

export {
    addProduct,
    removeProduct,
    updateProduct,
    getInventory,
}