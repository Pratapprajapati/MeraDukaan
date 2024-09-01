import ApiResponse from "../utils/ApiResponse.js";
import Inventory from "../models/inventory.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import Product from "../models/product.model.js";

const createInventory = async (req, res) => {

    const { productList } = req.body
    if (!productList) return res.status(404).json(new ApiResponse(404, null, "Product list missing"))
    console.log(productList);
    

    const inventory = await Inventory.create({
        _id: req.user._id,
        productList
    })
    if (!inventory) return res.status(500).json(new ApiResponse(500, null, "Something went wrong"))

    return res.status(201).json(new ApiResponse(201, inventory, "Inventory created"))
}

const addProduct = async (req, res) => {

    const { product, price, stock, description } = req.body
    if (!product || !isValidObjectId(product)) return res.status(404).json(new ApiResponse(404, null, "Product Id missing or invalid"))

    const productExists = await Product.findById(product)
    if (!productExists) return res.status(404).json(new ApiResponse(404, null, "Product not found"))

    const inventory = await Inventory.findById(req.user._id)

    const duplicate = inventory.productList.find(prod => prod.product._id.toString() === product);
    if (duplicate) return res.status(400).json(new ApiResponse(400, null, "Product exists"))

    let newProduct = {
        product,
        stock,
    }
    if (price) newProduct[price] = price
    if (description) newProduct[description] = description

    inventory.productList.push(newProduct)

    const updatedList = await inventory.save({ validateBeforeSave: false })
    if (!product) return res.status(500).json(new ApiResponse(500, null, "Something went wrong"))

    return res.status(200).json(new ApiResponse(200, updatedList, "Added"))
}

const updateProduct = async (req, res) => {
    const { productId } = req.params
    if (!productId || !isValidObjectId(productId)) return res.status(400).json(new ApiResponse(400, "", "Product Id missing"))

    const { price, description, stock } = req.body

    const inventory = await Inventory.findById(req.user?._id)
    
    const product = inventory.productList.find(prod => prod.product._id.toString() === productId);
    if (!product) {
        return res.status(404).json(new ApiResponse(404, "", "Product not found in inventory"));
    }

    if (typeof stock !== 'undefined') product.stock = stock
    if (price) product.price = price
    if (description) product.description = description

    const updatedProduct = await inventory.save({ validateBeforeSave: false })
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"))
}

const removeProduct = async (req, res) => {
    const { productId } = req.params
    if (!productId || !isValidObjectId(productId)) return res.status(400).json(new ApiResponse(400, "", "Product Id missing"))

    const inventory = await Inventory.findById(req.user?._id)

    const initialLength = inventory.productList.length;

    inventory.productList = inventory.productList.filter(prod => prod.product._id.toString() !== productId);

    if (inventory.productList.length === initialLength) {
        return res.status(404).json(new ApiResponse(404, null, "Product not found in inventory"));
    }
    const updatedProduct = await inventory.save({ validateBeforeSave: false })
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"))
}

const getInventory = async (req, res) => {
    const { vendorId } = req.params
    if (!vendorId || !isValidObjectId(vendorId)) return res.status(400).json(new ApiResponse(400, "", "Vendor Id missing"))

    const inventory = await Inventory.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(vendorId)
            }
        },
        {
            $unwind: "$productList"  // Deconstruct the productList array
        },
        {
            $lookup: {
                from: "products",
                localField: "productList.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"  // Deconstruct the productDetails array
        },
                    {
                $project: {
                    "productDetails.createdAt": 0,  // Exclude createdAt
                    "productDetails.updatedAt": 0,  // Exclude updatedAt
                }
            },

        {
            $addFields: {
                "productList.product": "$productDetails"  // Replace the product field in productList with the full product details
            }
        },
        {
            $group: {
                _id: "$_id",
                productList: { $push: "$productList" },  // Reconstruct the productList array
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, inventory, "Inventory fetched"))
}

export {
    createInventory,
    addProduct,
    updateProduct,
    removeProduct,
    getInventory,
}