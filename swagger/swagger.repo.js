/**
 * @swagger
 * tags:
 *   - name: deliveryController
 *     description: Управление доставкой
 *   - name: deliveryStatisticController
 *     description: Статистика управления заказами 
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     deliveryOrderDto:
 *       type: object
 *       required: 
 *         - date
 *         - orderId
 *         - deliveryType
 *       properties:
 *         date: 
 *           type: string
 *           format: date
 *         orderId:
 *           description: Номер заказа клиента
 *           type: integer
 *         deliveryType:
 *           description: Тип доставки
 *           type: string
 *           example: COURIER_SERVICE
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     AddressDto:
 *       type: object
 *       properties:
 *         address_id:
 *           type: integer
 *           format: int64
 *           description: Уникальный идентификатор адреса.
 *           example: 1
 *         fias_id:
 *           type: string
 *           format: uuid
 *           description: Уникальный идентификатор адреса в системе ФИАС.
 *           example: "a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0"
 *         fias_level:
 *           type: integer
 *           format: int32
 *           description: Уровень детализации адреса в системе ФИАС.
 *           example: 8
 *         value:
 *           type: string
 *           description: Полное текстовое представление адреса.
 *           example: "ул. Ленина, д. 10, кв. 5"
 *         city:
 *           type: string
 *           description: Название города.
 *           example: "Москва"
 *         country:
 *           type: string
 *           description: Название страны.
 *           example: "Россия"
 *         flat:
 *           type: string
 *           description: Номер квартиры.
 *           example: "5"
 *         house:
 *           type: string
 *           description: Номер дома.
 *           example: "10"
 *         postal_code:
 *           type: string
 *           description: Почтовый индекс (должен содержать 6 символов).
 *           example: "123456"
 *         region:
 *           type: string
 *           description: Название региона.
 *           example: "Московская область"
 *         street:
 *           type: string
 *           description: Название улицы.
 *           example: "Ленина"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Время создания записи.
 *           example: "2023-10-01T12:00:00Z"
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           description: Время удаления записи (используется для soft delete).
 *           example: null
 *       required:
 *         - address_id
 *         - city
 *         - country
 */
/**
 * @swagger
 * /api/delivery/v1/create:
 *   post:
 *     summary: Создание заказа на доставку
 *     tags: [deliveryController]
 *     description: Создает тикет в службу доставки на доставку заказа
 *     responses:
 *       200:
 *         description: Успешный ответ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/deliveryOrderDto' 
 */

/**
 * @swagger
 * /api/delivery/v1/decline:
 *   post:
 *     summary: Отмена заказа на доставку товара клиенту
 *     tags: [deliveryController]
 *     description: Отменяет тикет заказа доставки
 *     responses:
 *       200:
 *         description: Успешный ответ
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: integer
 *                   description: Номер заказа клиента
 *                   example: 123456
 */

