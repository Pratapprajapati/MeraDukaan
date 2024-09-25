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
        name, category, subCategory, price, image: productCloud.secure_url, addedBy: req.user._id
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


const allProducts = async (req, res) => {
    const products = await Product.find({ category: "Daily Needs" }).select("name subCategory")

    return res.status(200).json(new ApiResponse(200, products, "Fetched products"));
}

// Function to retrieve vendor IDs for given product IDs
const getVendorsForProducts = async (productIds) => {
    try {
        const inventories = await Inventory.aggregate([
            { $match: { 'productList.product': { $in: productIds } } },
            {
                $group: {
                    _id: null,
                    vendorIds: { $addToSet: '$_id' } // Collecting unique vendor IDs
                }
            }
        ]);
        return inventories.length > 0 ? inventories[0].vendorIds : [];
    } catch (error) {
        console.error("Error fetching vendor IDs:", error);
        throw new Error("Failed to fetch vendor information");
    }
};

// Function to search for products based on a search term
const searchProduct = async (req, res) => {
    try {
        const { searchTerm } = req.query;
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

        const productIds = products.map(p => p._id);
        const vendors = await getVendorsForProducts(productIds);

        const result = products.map(product => ({
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
                category: product.category,
                subCategory: product.subCategory,
                image: product.image,
                vendors: vendors
            },
        }));

        return res.status(200).json(new ApiResponse(200, result, "Search results"));
    } catch (error) {
        console.error("Error searching for products:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to search for products"));
    }
};

// Function to fetch specific products based on subcategory and page number
const specificProducts = async (req, res) => {
    const { subCategory, page } = req.params;
    const pageNumber = parseInt(page, 10) || 1;

    if (!subCategory || pageNumber < 1) {
        return res.status(400).json({ 
            status: 400, 
            message: 'Invalid subCategory or page number' 
        });
    }

    try {
        const totalProducts = await Product.countDocuments({ subCategory });
        if (totalProducts === 0) 
            return res.status(200).json(new ApiResponse(200, null, "No products in this subcategory"));

        const products = await Product.find({ subCategory })
            .select("name price image subCategory")
            .limit(32).skip(32 * (pageNumber - 1))
            .sort({ createdAt: -1 });

        const productIds = products.map(p => p._id);
        const vendors = await getVendorsForProducts(productIds);

        const result = products.map(({ _id, name, price, subCategory, image }) => ({
            id: _id,
            name,
            price,
            subCategory,
            image,
            vendors,
        }));

        return res.status(200).json(new ApiResponse(200, { totalProducts, products: result }, "Fetched products"));
    } catch (error) {
        console.error("Error fetching specific products:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch specific products"));
    }
};

// Function to get a sample of products from each category
const getSampleProductsFromEachCategory = async (req, res) => {
    try {
        const sampleProducts = await Product.aggregate([
            {
                $group: {
                    _id: {
                        category: "$category",
                        subCategory: "$subCategory"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "products",
                    let: { category: "$_id.category", subCategory: "$_id.subCategory" },
                    pipeline: [
                        { 
                            $match: { 
                                $expr: { 
                                    $and: [
                                        { $eq: ["$category", "$$category"] },
                                        { $eq: ["$subCategory", "$$subCategory"] }
                                    ]
                                }
                            }
                        },
                        { $sample: { size: 6 } },
                        { $project: { _id: 1, name: 1, price: 1, image: 1, subCategory: 1, category: 1 } }
                    ],
                    as: "products"
                }
            },
            { $unwind: "$products" },
            { $sort: { "products.category": 1, "products.subCategory": 1 } },
            {
                $project: {
                    _id: 0,
                    count: 0,
                }
            }
        ]);

        const productIds = sampleProducts.map(p => p.products._id);
        const vendors = await getVendorsForProducts(productIds);

        const result = sampleProducts.map(item => ({
            products: {
                id: item.products._id,
                name: item.products.name,
                price: item.products.price,
                category: item.products.category,
                subCategory: item.products.subCategory,
                image: item.products.image,
                vendors: vendors
            },
        }));

        res.status(200).json(new ApiResponse(200, result, "Fetched sample products from each subcategory with vendor information"));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, "An error occurred while fetching sample products"));
    }
};


export {
    addProduct,
    removeProduct,
    updateProduct,
    searchProduct,
    allProducts,
    specificProducts,
    getSampleProductsFromEachCategory,
}