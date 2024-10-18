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

module.exports.createOrder = async (productDetails, UserID) => {
  const { OrderTotalAmount, orderItems } = productDetails;
  const OrderID = generateAlphanumericId(25); // Unique OrderID
  const OrderTrackingNumber = generateAlphanumericId(40); // Unique tracking number
  const connection = await db.getConnection();

  try {
    // Start the transaction
    await connection.beginTransaction();

    // Insert the order into the `orders` table
    const [createOrderResult] = await connection.query(
      "INSERT INTO `orders` (UserID, OrderID, OrderTrackingNumber, OrderStatus, OrderTotalAmount) VALUES (?, ?, ?, ?, ?)",
      [UserID, OrderID, OrderTrackingNumber, "pending", OrderTotalAmount]
    );

    // Check if order was inserted successfully
    if (createOrderResult.affectedRows === 0) {
      throw new Error("Order creation failed.");
    }

    let totalAmount = 0;

    for (const item of orderItems) {
      const { productID, ProductOrderQuantity, ProductPrice, ProductName } =
        item;

      const DetailID = generateAlphanumericId(15);

      await connection.query(
        "INSERT INTO `orderdetails` (OrderID, DetailID, ProductID, ProductOrderQuantity, ProductPrice, ProductName) VALUES (?, ?, ?, ?, ?, ?)",
        [
          OrderID,
          DetailID,
          productID,
          ProductOrderQuantity,
          ProductPrice,
          ProductName,
        ]
      );

      await connection.query(
        "UPDATE products SET ProductQuantity = ProductQuantity - ? WHERE ProductID = ?",
        [ProductOrderQuantity, productID]
      );

      totalAmount += ProductOrderQuantity * ProductPrice;
    }

    // Update the total amount in the `orders` table
    await connection.query(
      "UPDATE `orders` SET OrderTotalAmount = ? WHERE OrderID = ?",
      [totalAmount, OrderID]
    );

    // Commit the transaction
    await connection.commit();

    // Return success with OrderID and sn
    return {
      success: true,
      message: "Order was created successfully",
      OrderID: OrderID,
      // OrderSn: createdOrderSn,
    };
  } catch (error) {
    // Rollback the transaction on error
    await connection.rollback();
    return { success: false, message: error.message };
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

module.exports.getUserPurchase = async () => {
  try {
    const [allproductsPurchase] = await db.query(
      `SELECT 
    u.UserFirstName, 
    u.UserLastName, 
    u.UserPhone,
    u.UserID, 
    od.ProductName, 
    od.ProductOrderQuantity, 
    od.ProductPrice, 
    o.OrderStatus, 
    o.OrderTotalAmount, 
    o.OrderCreatedDate,
    DATE(o.OrderCreatedDate) AS OrderDate, 
    COUNT(o.OrderID) AS OrderCount,
    SUM(o.OrderTotalAmount) AS TotalOrderAmount
  
FROM 
    users u
JOIN 
    orders o ON u.UserID = o.UserID
JOIN 
    orderdetails od ON o.OrderID = od.OrderID
GROUP BY 
    u.UserID, OrderDate 
ORDER BY  o.OrderCreatedDate DESC`
    );
    return allproductsPurchase;
  } catch (error) {
    throw error;
  }
};

module.exports.getUserPurchaseDetails = async (UserID, date) => {
  try {
    const [userproductsPurchase] = await db.query(
      `SELECT 
        u.UserFirstName, 
        u.UserLastName, 
        u.UserPhone, 
        od.ProductName, 
        od.ProductOrderQuantity, 
        od.ProductPrice, 
        o.OrderStatus, 
        o.OrderTotalAmount, 
        o.OrderCreatedDate,
        o.OrderID
      FROM 
        users u
      JOIN 
        orders o ON u.UserID = o.UserID
      JOIN 
        orderdetails od ON o.OrderID = od.OrderID
      WHERE 
        u.UserID = ? AND DATE(o.OrderCreatedDate) = ?
      ORDER BY 
        o.OrderCreatedDate DESC`,
      [UserID, date]
    );
    return userproductsPurchase;
  } catch (error) {
    throw error;
  }
};

module.exports.getTotalOrderCount = async () => {
  try {
    const [allOrderCount] = await db.query(
      `SELECT COUNT(*) AS TotalOrder FROM orders`
    );
    return allOrderCount[0].TotalOrder;
  } catch (error) {
    throw error;
  }
};
