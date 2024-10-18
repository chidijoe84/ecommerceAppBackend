const db = require("../db");

const generateAlphanumericId = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports.createProducts = async (productInfo) => {
  const {
    ProductName,
    ProductPrice,
    ProductShortDesc,
    ProductLongDesc,
    ProductImage,
    ProductCategoryID,
    ProductQuantity,
    ProductLocation,
    CreatedBy,
  } = productInfo;

  const productID = generateAlphanumericId(15);
  const ProductSKU = generateAlphanumericId(10);

  try {
    const insertProduct = await db.query(
      "INSERT INTO products(productID, ProductSKU, ProductName, ProductPrice, ProductShortDesc, ProductLongDesc, ProductImage, ProductCategoryID, ProductQuantity, ProductLocation, CreatedBy ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        productID,
        ProductSKU,
        ProductName,
        ProductPrice,
        ProductShortDesc,
        ProductLongDesc,
        ProductImage,
        ProductCategoryID,
        ProductQuantity,
        ProductLocation,
        CreatedBy,
      ]
    );

    // console.log("insertProduct", insertProduct)

    if (insertProduct[0].affectedRows > 0) {
      // Return an object with success and productID
      return { success: true, productID: productID };
    } else {
      return { success: false, message: "Product insertion failed." };
    }
  } catch (error) {
    // Return an object with success and error message
    return { success: false, message: error.message };
  }
};

module.exports.getAllProducts = async () => {
  try {
    const [allproducts] = await db.query(
      `SELECT p.*, pc.*, u.UserLastName, u.UserFirstName FROM products p 
      JOIN productcategories pc ON p.ProductCategoryID = pc.CategoryID 
      JOIN users u ON u.UserID = p.CreatedBy ORDER BY p.createdDate DESC`
    );
    return allproducts;
  } catch (error) {
    throw error;
  }
};

module.exports.getTotalProductsCount = async () => {
  try {
    const [allProductCount] = await db.query(
      `SELECT COUNT(*) AS TotalProducts FROM products`
    );
    return allProductCount[0].TotalProducts;
  } catch (error) {
    throw error;
  }
};

module.exports.updateProducts = async (productInfo, ProductID) => {
  const {
    ProductName,
    ProductPrice,
    ProductShortDesc,
    ProductLongDesc,
    ProductImage,
    ProductCategoryID,
    ProductQuantity,
    ProductLocation,
  } = productInfo;

  try {
    const updateProduct = await db.query(
      `UPDATE products SET ProductName = ?, ProductPrice = ?, ProductShortDesc = ?, ProductLongDesc = ?, ProductImage = ?, ProductCategoryID = ?, ProductQuantity = ?, ProductLocation = ?   WHERE ProductID = ?`,
      [
        ProductName,
        ProductPrice,
        ProductShortDesc,
        ProductLongDesc,
        ProductImage,
        ProductCategoryID,
        ProductQuantity,
        ProductLocation,
        ProductID,
      ]
    );

    if (updateProduct.affectedRows > 0) {
      return {
        success: true,
        message: "product was updated successfully",
        ProductID: ProductID,
      };
    } else {
      return { success: false, message: "Category was not updated" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports.createProductCategory = async (categoryInfo) => {
  const { UserID, CategoryName } = categoryInfo;

  const CategoryID = generateAlphanumericId(10);

  try {
    const insertCategory = await db.query(
      "INSERT INTO productcategories(CreatedBy, CategoryID, CategoryName) VALUES (?, ?, ?)",
      [UserID, CategoryID, CategoryName]
    );

    if (insertCategory[0].affectedRows > 0) {
      return {
        success: true,
        message: "category was created successfully",
        CategoryID: CategoryID,
      };
    } else {
      return { success: false, message: "category creation failed" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports.deleteCategory = async (CategoryID) => {
  console.log("categoryId", CategoryID);

  try {
    const deleteCategory = await db.query(
      "DELETE FROM productcategories WHERE CategoryID = ?",
      [CategoryID]
    );
    if (deleteCategory[0].affectedRows > 0) {
      return {
        success: true,
        message: "Category was deleted successfully",
        CategoryID: CategoryID,
      };
    } else {
      return { success: false, message: "Category was not deleted" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports.deleteProduct = async (ProductID) => {
  try {
    const deleteProduct = await db.query(
      "DELETE FROM products WHERE ProductID = ?",
      [ProductID]
    );
    if (deleteProduct[0].affectedRows > 0) {
      return {
        success: true,
        message: "product was deleted successfully",
        ProductID: ProductID,
      };
    } else {
      return { success: false, message: "product was not deleted" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports.updateCategory = async (CategoryInfo, CategoryID) => {
  const { CategoryName } = CategoryInfo;
  console.log("categoryId", CategoryID, CategoryName);

  try {
    const updateCategory = await db.query(
      `UPDATE productcategories SET CategoryName = ? WHERE CategoryID = ?`,
      [CategoryName, CategoryID]
    );

    if (updateCategory.affectedRows > 0) {
      return {
        success: true,
        message: "Category was updated successfully",
        CategoryID: CategoryID,
      };
    } else {
      return { success: false, message: "Category was not updated" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports.getProductCategories = async () => {
  try {
    const [productcategories] = await db.query(
      "SELECT * FROM productcategories"
    );
    return productcategories;
  } catch (error) {
    throw error;
  }
};
module.exports.getCategoriesDetails = async () => {
  try {
    const [getCategoriesDetails] = await db.query(
      `SELECT  pc.CategoryID, pc.CategoryName, pc.CreatedBy, pc.CreatedDate, p.ProductID, u.UserFirstName, u.UserLastName,  COUNT(p.ProductID) AS NoOfProduct 
 FROM productcategories pc LEFT JOIN 
    products p ON pc.CategoryID = p.ProductCategoryID  JOIN users u ON pc.CreatedBy = u.UserID GROUP BY pc.CategoryID`
    );
    return getCategoriesDetails;
  } catch (error) {
    throw error;
  }
};
