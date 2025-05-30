const express = require('express');
router = express.Router();
const common = require("openfsm-common"); /* Библиотека с общими параметрами */
const authMiddleware = require('openfsm-middlewares-auth-service'); // middleware для проверки токена
const delivery = require('../controllers/deliveryController');


router.post('/v1/create', authMiddleware.authenticateToken, delivery.create);    // Создать заказ на доставку 
router.post('/v1/decline', authMiddleware.authenticateToken, delivery.decline);  // Отменить заказ на доставку

router.post('/v1/address', authMiddleware.authenticateToken, delivery.addAddress);  // Добавить адрес пользователя
router.patch('/v1/address', authMiddleware.authenticateToken, delivery.setAddress);  // Установить  адрес пользователя по умолчанию
router.delete('/v1/address', authMiddleware.authenticateToken, delivery.deleteAddress);  // Удалить адрес пользователя

router.get('/v1/addresses', authMiddleware.authenticateToken, delivery.getAddresses);  // Получить список адресов пользователя
router.get('/v1/delivery-types', authMiddleware.authenticateToken, delivery.getDeliveryTypes);  // Получить список типов доставки


module.exports = router;
