const express = require("express");
const createProductServices = require("../services/products.services");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newProduct = await createProductServices.createProducts(req.body);

    if (newProduct.success === true) {
      res.status(200).json({
        message: "product was created successfull",
        success: true,
      });
    } else {
      res.status(404).json({
        message: "product creation failed",
        success: false,
      });
    }
  } catch (error) {
    throw error;
  }
});

router.get("/getAllProduct", async (req, res) => {
  try {
    const allProducts = await createProductServices.getAllProducts();

    if (allProducts.length > 0) {
      res.status(200).json({
        message: "The following products are available",
        allProducts: allProducts,
        success: true,
      });
    } else {
      res.status(404).json({
        message: "No Product is Available",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching product",
      success: false,
    });
  }
});

router.get("/totalProductsCount", async (req, res) => {
  try {
    const totalProductsCounts =
      await createProductServices.getTotalProductsCount();
    res.status(200).json({
      success: true,
      totalProductsCounts: totalProductsCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the total products count",
    });
  }
});

router.post("/updateProduct/:id", async (req, res) => {
  try {
    const product = await createProductServices.updateProducts(
      req.body,
      req.params.id
    );
    if (product === 0) {
      res
        .status(404)
        .json({ message: "No product found with this ID to update" });
    } else {
      res.status(200).json({ message: "product was updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching product",
      success: false,
    });
  }
});

router.post("/createCategory", async (req, res) => {
  try {
    const newProduct = await createProductServices.createProductCategory(
      req.body
    );

    if (newProduct.success === true) {
      res.status(200).json({
        message: "product category was created successfull",
        success: true,
      });
    } else {
      res.status(404).json({
        message: "product category creation failed",
        success: false,
      });
    }
  } catch (error) {
    throw error;
  }
});

router.get("/getcategories", async (req, res) => {
  try {
    const categories = await createProductServices.getProductCategories();

    if (categories.length > 0) {
      res.status(200).json({
        message: "The following categories are available",
        allCategories: categories,
        success: true,
      });
    } else {
      res.status(404).json({
        message: "No categories available",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching product categories",
      success: false,
    });
  }
});

router.delete("/deleteCategory/:id", async (req, res) => {
  try {
    const categories = await createProductServices.deleteCategory(
      req.params.id
    );
    if (categories === 0) {
      res
        .status(404)
        .json({ message: "No category found with this ID to delete" });
    } else {
      res.status(200).json({ message: "category were deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching product categories",
      success: false,
    });
  }
});

router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const product = await createProductServices.deleteProduct(req.params.id);
    if (product === 0) {
      res
        .status(404)
        .json({ message: "No product found with this ID to delete" });
    } else {
      res.status(200).json({ message: "product was deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching product",
      success: false,
    });
  }
});

router.post("/updateCategory/:id", async (req, res) => {
  try {
    const categories = await createProductServices.updateCategory(
      req.body,
      req.params.id
    );
    if (categories === 0) {
      res
        .status(404)
        .json({ message: "No category found with this ID to update" });
    } else {
      res.status(200).json({ message: "category was updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching product categories",
      success: false,
    });
  }
});


router.get("/categoryDetails", async (req, res) => {
  try {
    const categoriesDetails =
      await createProductServices.getCategoriesDetails();
    if (categoriesDetails === 0) {
      res.status(404).json({ message: "No category found", success: false });
    } else {
      res.status(200).json({
        success: true,
        message: "categories fetched successfully",
        categoriesDetails: categoriesDetails,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching categories categories",
      success: false,
    });
  }
});

module.exports = router;
