const express = require("express");
const router = express.Router();
const orderProductServices = require("../services/oders.services");

router.post("/orderProducts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const buyProduct = await orderProductServices.createOrder(req.body, userId);

    console.log("buyProduct", buyProduct);

    if (buyProduct.success === true) {
      res.status(200).json({
        message: "Your order was created successfully",
        success: true,
        orderId: buyProduct.OrderID,
      });
    } else {
      res.status(404).json({
        message: "Your order was not created",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "An error occurred while creating the order",
      success: false,
      error: error.message,
    });
  }
});

router.get("/getAllProductOrder", async (req, res) => {
  try {
    const allProductOdered = await orderProductServices.getUserPurchase();

    if (allProductOdered.length > 0) {
      res.status(200).json({
        message: "The following product are ordered",
        allProductOrder: allProductOdered,
        success: true,
      });
    } else {
      res.status(404).json({
        message: "No product order available",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching product ordered",
      success: false,
    });
  }
});

router.get('/totalOrderCount', async (req, res) => {
  try {
    const totalOrderCount = await orderProductServices.getTotalOrderCount();
    res.status(200).json({
      success: true,
      totalOrderCount: totalOrderCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the total order count",
    });
  }
});


router.get("/getUserProductOrder", async (req, res) => {
  const { UserID, date } = req.query;
  try {
    const userProductOdered = await orderProductServices.getUserPurchaseDetails(
      UserID,
      date
    );

    if (userProductOdered.length > 0) {
      res.status(200).json({
        message: "The following product are ordered",
        userProductOrder: userProductOdered,
        success: true,
      });
    } else {
      res.status(404).json({
        message: "No product order available",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching product ordered",
      success: false,
    });
  }
});

module.exports = router;
