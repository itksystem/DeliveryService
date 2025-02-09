/**
 * @swagger
 * servers:
 *   - url: https://127.0.0.1/api/delivery/v1
 *     description: Версия 1 API
 *   - url: https://127.0.0.1/api/delivery/v2
 *     description: Версия 2 API
 */
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
/**
 * @swagger
 * /api/delivery/v1/addresses:
 *   get:
 *     summary: Получить список адресов пользователя
 *     description: Возвращает список адресов, связанных с текущим пользователем. Требуется авторизация.
 *     tags: [deliveryController]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список адресов для доставки пользователю.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 adresses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AddressDto' 
 *    
 *       '422':
 *         description: Ошибка валидации. Пользователь не найден или адреса отсутствуют.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 422
 *                 message:
 *                   type: string
 *                   example: "Unprocessable Entity"
 *       '500':
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
/**
 * @swagger
 * /api/delivery/v1/address:
 *   post:
 *     summary: Сохранить адрес пользователя
 *     description: Сохраняет выбранный адрес текущего пользователем. Требуется авторизация.
 *     tags: [deliveryController]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список адресов для доставки пользователю.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 addresses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AddressDto' 
 *    
 *       '422':
 *         description: Ошибка валидации. Пользователь не найден или адреса отсутствуют.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 422
 *                 message:
 *                   type: string
 *                   example: "Unprocessable Entity"
 *       '500':
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
/**
 * @swagger
 * /api/delivery/v1/address:
 *   delete:
 *     summary: Удалить адрес пользователя
 *     description: Удаляет выбранный адрес текущего пользователя. Требуется авторизация.
 *     tags: [deliveryController]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список адресов для доставки пользователю.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 addressId:
 *                   type: integer 
 *    
 *       '422':
 *         description: Ошибка валидации. Пользователь не найден или адреса отсутствуют.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 422
 *                 message:
 *                   type: string
 *                   example: "Unprocessable Entity"
 *       '500':
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
