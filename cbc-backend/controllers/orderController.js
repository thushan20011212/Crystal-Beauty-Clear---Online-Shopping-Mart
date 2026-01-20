import Order from "../models/order.js";
import Product from "../models/product.js";

// Helper function to check if user is admin
function isAdmin(req) {
    return req.userData && req.userData.role === "admin";
}



export async function createOrder(req, res) {
    if (req.userData == null) {
        res.status(403).json({ message: "Forbidden - no user found" });
        return;
    }

    const orderInfo = req.body;

    if (orderInfo.name == null) {
        orderInfo.name = req.userData.firstName + " " + req.userData.lastName;
    }

    //CBC00001
    let orderId = "CBC00001";

    const lastOrders = await Order.find().sort({ date: -1 }).limit(1);

    if (lastOrders.length > 0) {
        const lastOrderId = lastOrders[0].orderId; //CBC00551

        const lastOrderNumberString = lastOrderId.replace("CBC", ""); //00551
        const lastOrderNumber = parseInt(lastOrderNumberString); //551
        const newOrderNumber = lastOrderNumber + 1; //552
        const newOrderNumberString = String(newOrderNumber).padStart(5, "0");
        orderId = "CBC" + newOrderNumberString;
    }

    try {
        let total = 0;
        let labelledTotal = 0;
        const products = [];

        for (let i = 0; i < (orderInfo.products || []).length; i++) {
            const reqProd = orderInfo.products[i];

            const item = await Product.findOne({ productId: reqProd.productId });
            if (item == null) {
                res.status(404).json({
                    message: "Product with productID " + reqProd.productId + " not found"
                });
                return;
            }

            if (item.isAvailabel == false) {
                res.status(404).json({
                    message: "Product with productID " + reqProd.productId + " is not available right now"
                });
                return;
            }

            products.push({
                productId: item.productId,
                name: item.name,
                altNames: item.altNames,
                description: item.description,
                images: item.image,
                labelledPrice: item.labelledPrice,
                price: item.price,
                quantity: reqProd.qty
            });

            total += item.price * reqProd.qty;
            labelledTotal += (item.labelledPrice * reqProd.qty);
        }

        const order = new Order({
            orderId: orderId,
            email: req.userData.email,
            name: orderInfo.name,
            address: orderInfo.address,
            phone: orderInfo.phone,
            products: products,
            labelledTotal: labelledTotal,
            total: total
        });

        const createdOrder = await order.save();
        res.json({
            message: "Order created successfully",
            order: createdOrder
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}

export async function getOrders(req, res) {
    // Check if user is authenticated
    if (req.userData == null) {
        return res.status(403).json({ 
            message: "Forbidden - authentication required" 
        });
    }

    try {
        if (isAdmin(req)) {
            // Admin sees all orders
            const orders = await Order.find();
            res.json(orders);
        } else {
            // Regular users see only their own orders
            const orders = await Order.find({ email: req.userData.email });
            res.json(orders);
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}


export async function updateOrderStatus(req, res) {
    // Check if user is admin
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Forbidden - you are not an admin"
        });
    }
    
    try {
        const orderId = req.params.orderId;
        const status = req.params.status;

        // Validate status value
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be one of: " + validStatuses.join(", ")
            });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId }, 
            { status: status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (e) {
        res.status(500).json({
            message: "Internal server error",
            error: e.message
        });
    }
}