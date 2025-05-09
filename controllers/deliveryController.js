const { DateTime }    = require('luxon');
const deliveryHelper = require('../helpers/DeliveryHelper');
const common       = require('openfsm-common');  /* Библиотека с общими параметрами */
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();
const authMiddleware = require('openfsm-middlewares-auth-service'); // middleware для проверки токена
const { v4: uuidv4 } = require('uuid'); 
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService
const AddressDto = require('openfsm-address-dto');
require('dotenv').config({ path: '.env-delivery-service' });

const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};


exports.create = async (req, res) => {        
    try {        
        const {orderId, date, deliveryType} = req.body;
        if (!orderId || !date || !deliveryType ) throw(400);        
        const deliveryId = await deliveryHelper.create(orderId, date, deliveryType);        
        if(!deliveryId) throw(422)
        sendResponse(res, 200, { status: true, deliveryId });
    } catch (error) {
         console.error("Error create:", error);
         sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};


exports.decline = async (req, res) => {      
    try {
        const {orderId} = req.body;
        if (!orderId) throw(400);     
        const deliveryId = await deliveryHelper.decline(orderId);        
        if(!deliveryId) throw(422)
        sendResponse(res, 200, { status: true, deliveryId});
    } catch (error) {
         console.error("Error create:", error);
         sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};

exports.addAddress = async (req, res) => {      
    try {
        let userId = await authMiddleware.getUserId(req, res);
        if(!userId) throw(401)
        const address = new AddressDto(req.body);
        if(!address) throw(422);
        let deliveryType = !req.body.deliveryType ? null : req.body.deliveryType;
        const addressId = await deliveryHelper.addAddress(address,userId,deliveryType);
        if(!addressId) throw(422)
        
        sendResponse(res, 200, { status: true, addressId});
    } catch (error) {
         console.error("Error create:", error);
         sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};

exports.setAddress = async (req, res) => {      
    try {
        let userId = await authMiddleware.getUserId(req, res);
        if(!userId) throw(401)            
        const {addressId} = req.body;
        if(!addressId) throw(422);
        const result = await deliveryHelper.setAddress(addressId,userId);        
        if(!result) throw(422)
        sendResponse(res, 200, { status: true, addressId});
    } catch (error) {
         console.error("Error create:", error);
         sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};

exports.deleteAddress = async (req, res) => {      
    try {
        let userId = await authMiddleware.getUserId(req, res);
        if(!userId) throw(401)
        const {addressId} = req.body;
        if (!addressId) throw(400);     
        const result = await deliveryHelper.deleteAddress(addressId, userId);        
        if(!result) throw(422)
        sendResponse(res, 200, { status: true, addressId});
    } catch (error) {
         console.error("Error create:", error);
         sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};


exports.getAddresses = async (req, res) => {      
    try {
        let userId = await authMiddleware.getUserId(req, res);
        if(!userId) throw(401)           
        let query = !req?.query?.query ? null : req?.query?.query;

        const addresses = await deliveryHelper.getAddresses(userId, query);        
        if(!addresses) throw(422)
        sendResponse(res, 200, { status: true, addresses});
    } catch (error) {
         console.error("Error create:", error);
         sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};


exports.getDeliveryTypes = async (req, res) => {      
    try {
        let userId = await authMiddleware.getUserId(req, res);
        if(!userId) throw(401)           
        const types = await deliveryHelper.getDeliveryTypes();        
        if(!types) throw(422)
        sendResponse(res, 200, { status: true, types});
    } catch (error) {
         console.error("Error create:", error);
         sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};
