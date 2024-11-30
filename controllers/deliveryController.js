const { DateTime }    = require('luxon');
const deliveryHelper = require('../helpers/DeliveryHelper');
const common       = require('openfsm-common');  /* Библиотека с общими параметрами */
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();
const authMiddleware = require('openfsm-middlewares-auth-service'); // middleware для проверки токена
const { v4: uuidv4 } = require('uuid'); 
require('dotenv').config();


const isValidUUID = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const validateRequest = (productId, quantity, userId) => {
    if (!productId || !isValidUUID(productId)) return "Invalid product ID";
    if (!quantity || typeof quantity !== "number" || quantity <= 0) return "Invalid quantity";
    if (!userId ) return "Invalid user ID";
    return null;
};

const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};


exports.create = async (req, res) => {    
    const {orderId, deliveryDate, deliveryTypeId} = req.body;
    if (!orderId || !deliveryDate || !deliveryTypeId ) throw(400);        
    try {
        const delivery = await deliveryHelper.create(orderId, deliveryDate, deliveryTypeId);        
        if(!delivery) throw(422)
        const deliveryOrder = await deliveryHelper.findDeliveryOrder(orderId);
        if(!deliveryOrder.order_id) throw(422) 
        sendResponse(res, 200, { 
            status: true,
            deliveryOrder:    {
             deliveryOrderId: deliveryOrder.id,
             deliveryDate: deliveryOrder.delivery_date,
             orderId: deliveryOrder.order_id,
             courierId: deliveryOrder.courier_id
            }   
            });
    } catch (error) {
         console.error("Error create:", error);
         sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};


exports.decline = async (req, res) => {    
    const {orderId} = req.body;
    if (!orderId) throw(400);        
    try {
        const delivery = await deliveryHelper.decline(orderId);        
        if(!delivery) throw(422)
        sendResponse(res, 200, { status: true});
    } catch (error) {
         console.error("Error create:", error);
         sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};
