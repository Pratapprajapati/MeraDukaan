import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";
import { isValidObjectId } from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import Inventory from "../models/inventory.model.js";

// ADD PRODUCT
const addProduct = async (req, res) => {
    const { name, category, subCategory, price } = req.body

    const productPath = req.file?.path
    if (!productPath) return res.status(404).json(new ApiResponse(404, null, "Shop image missing"))

    const productCloud = await uploadOnCloudinary(productPath)
    if (!productCloud) return res.status(404).json(new ApiResponse(404, null, "Shop image not found"))

    const product = await Product.create({
        name, category, subCategory, price, image: productCloud.secure_url
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

    const { price, category, subCategory } = req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json(new ApiResponse(404, "", "Product doesn't exist"))

    if (price) product.price = price
    if (category) product.category = category
    if (subCategory) product.subCategory = subCategory

    const updatedProduct = await product.save({ validateBeforeSave: false })
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"))
}

const searchProduct = async (req, res) => {
    try {
        const { searchTerm } = req.query;

        // Step 1: Search for the product in the Product collection
        const products = await Product.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                { subCategory: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        if (products.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "No products found"));
        }

        // Step 2: Search for inventories that sell these products
        const productIds = products.map(p => p._id);
        const inventories = await Inventory.aggregate([
            { $match: { 'productList.product': { $in: productIds } } },
            {
                $lookup: {
                    from: 'vendors', // Assuming 'vendors' collection stores vendor details
                    localField: '_id', // inventory ID is the same as vendor ID
                    foreignField: '_id',
                    as: 'vendorDetails'
                }
            },
            { $unwind: '$vendorDetails' },
            {
                $project: {
                    _id: 0,
                    vendorName: '$vendorDetails.shopName',
                    address: '$vendorDetails.location',
                    isOpen: '$vendorDetails.isOpen',
                    'productList.product': 1,
                    'productList.price': 1,
                    'productList.stock': 1
                }
            }
        ]);

        // Step 3: Format the response
        let result = products.map(product => {
            return {
                product: {
                    id: product._id,
                    name: product.name,
                    category: product.category,
                    subCategory: product.subCategory
                },
                vendors: inventories
                    .filter(inv => inv.productList.some(p => p.product.toString() === product._id.toString()))
                    .map(inv => ({
                        vendorName: inv.vendorName,
                        address: inv.address,
                        isOpen: inv.isOpen,
                        price: inv.productList.find(p => p.product.toString() === product._id.toString()).price,
                        stock: inv.productList.find(p => p.product.toString() === product._id.toString()).stock
                    }))
            };
        });

        return res.status(200).json(new ApiResponse(200, result, "Search results"));
    } catch (error) {
        console.error("Error searching for products:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to search for products"));
    }
};

const allProducts = async(req, res) => {
    const products = await Product.find({category: "Daily Needs"}).select("name subCategory")

    return res.status(200).json(new ApiResponse(200, products, "Fetched products"));
}

export {
    addProduct,
    removeProduct,
    updateProduct,
    searchProduct,
    allProducts,
}