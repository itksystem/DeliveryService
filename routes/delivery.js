const express = require('express');
const 
router = express.Router();
const common = require("openfsm-common"); /* Библиотека с общими параметрами */
const authMiddleware = require('openfsm-middlewares-auth-service'); // middleware для проверки токена
const delivery = require('../controllers/deliveryController');


router.post('/v1/create', authMiddleware.authenticateToken, delivery.create);  // Создать заказ на доставку 
router.post('/v1/decline', authMiddleware.authenticateToken, delivery.decline);  // Отменить заказ на доставку


module.exports = router;
