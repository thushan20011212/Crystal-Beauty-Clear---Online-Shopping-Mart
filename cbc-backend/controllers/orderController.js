import Order from "../models/order.js";
import Product from "../models/product.js";

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
    if (req.userData == null) {
        res.status(403).json({ 
            message: "Forbidden - no user found" });
        return;
    }

    try {
        if (req.userData.role === "admin") {
            const orders = await Order.find();
            res.json(orders);
        } else {
            const orders = await Order.find({ email: req.userData.email });
            res.json(orders);
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}


export async function updateOrderStatus(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Forbidden - you are not an admin"
        })
        return
    }
    try{
        const orderId = req.params.orderId
        const status = req.params.status

        await Order.updateOne(
            { orderId: orderId 

            }, 
            { status: status 

            }
        )

        res.json({
            message: "Order status updated successfully"
        })

    } catch(e) {
        res.status(500).json({
            message: "Internal server error",
            error: e
        })
        return
    }
}