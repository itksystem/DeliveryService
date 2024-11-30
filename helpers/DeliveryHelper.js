const db = require('openfsm-database-connection-producer');
const { UserPermissionsDTO, RoleDTO, PermissionDTO } = require('openfsm-permissions-dto');
const { UserDTO } = require('openfsm-user-dto');
const common      = require('openfsm-common');  /* Библиотека с общими параметрами */
const {OrderDto}   = require('openfsm-order-dto');

require('dotenv').config();
const ClientProducerAMQP  =  require('openfsm-client-producer-amqp'); // ходим в почту через шину
const amqp = require('amqplib');

/* Коннектор для шины RabbitMQ */
const {
  RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD,  
  RABBITMQ_ORDER_STATUS_QUEUE, RABBITMQ_ORDER_DECLINE_QUEUE, 
  RABBITMQ_DELIVERY_RESERVATION_QUEUE, RABBITMQ_DELIVERY_DECLINE_QUEUE  } = process.env;
const login = RABBITMQ_USER || 'guest';
const pwd = RABBITMQ_PASSWORD || 'guest';
const ORDER_STATUS_QUEUE       = RABBITMQ_ORDER_STATUS_QUEUE || 'ORDER_STATUS';
const DELIVERY_RESERVATION_QUEUE  = RABBITMQ_DELIVERY_RESERVATION_QUEUE || 'DELIVERY_RESERVATION';
const DELIVERY_DECLINE_QUEUE   = RABBITMQ_DELIVERY_DECLINE_QUEUE || 'DELIVERY_DECLINE';
const host = RABBITMQ_HOST || 'rabbitmq-service';
const port = RABBITMQ_PORT || '5672';



/*
 @deliveryTypeId - Тип доставки
 @timeSlotId - временной слот
 @output {object}
*/
exports.findCourierByTimeSlot = (deliveryTypeId, timeSlotId) => { // найти курьера  по типу и временному слоту
  return new Promise((resolve, reject) => {  
        db.query( common.SQL.DELIVERY.FIND_COURIER_BY_TIME_SLOT,
          [deliveryTypeId, timeSlotId],
          (err, results) => {
            if (err) {
              console.log(err); 
              return reject(null);
            }
            resolve(results[0]);
        }
     );
  });
};
/*
 @courierId - ID курьера
  @output {object}
*/
exports.findCourierById = (courierId) => { // найти курьера  по ID
  return new Promise((resolve, reject) => {  
        db.query(
          common.SQL.DELIVERY.FIND_COURIER_BY_ID, [courierId],
          (err, results) => {
            if (err) {
              console.log(err); 
              return reject(null);
            }
            resolve(results[0]);
        }
     );
  });
};
/*
 @deliveryDate - дата доставки
 @courierId - ID курьера
 @output {object}
*/
exports.getCourierOrderCount = (deliveryDate, courierId) => { // найти количество заказов у курьера на определенный день
  return new Promise((resolve, reject) => {  
        db.query(common.SQL.DELIVERY.GET_COURIER_ORDER_COUNT, [deliveryDate, courierId],
          (err, results) => {
            if (err) {
              console.log(err); 
              return reject(null);
            }
            resolve(results[0]);
        }
     );
  });
};
/*
 @deliveryDate - дата доставки
 @courierId - ID курьера
 @output {object} 
 Найти нужного курьера
*/
exports.findCourier = (deliveryDate, deliveryTypeId) => { 
  return new Promise((resolve, reject) => {  
        db.query(common.SQL.DELIVERY.FIND_COURIER, [deliveryDate, deliveryTypeId],
          (err, results) => {
            if (err) {
              console.log(err); 
              return reject(null);
            }
            resolve(results[0]);
        }
     );
  });
};

exports.findDeliveryOrder = (orderId) => { // найти заказ на доставку c назначенным курьером
  return new Promise((resolve, reject) => {  
        db.query(common.SQL.DELIVERY.FIND_DELIVERY_ORDER, [orderId],
          (err, results) => {
            if (err) {
              console.log(err); 
              return reject(null);
            }
            resolve(results[0]);
        }
     );
  });
};

/*
 @deliveryDate - дата доставки
 @courierId - ID курьера
 @output {object}
*/
exports.deliveryOrderAdd = (orderId, deliveryDate, courierId) => {
  return new Promise((resolve, reject) => {
      // Валидация входных данных
      if (!orderId || !deliveryDate || !courierId) {
          return reject(new Error("Invalid input parameters"));
      }      
      db.query(common.SQL.DELIVERY.DELIVERY_ORDER_ADD,
          [orderId, deliveryDate, courierId, courierId],
          (err, results) => {
              if (err) {
                  console.error("Database error:", err);
                  return reject(false); // Передать ошибку дальше
              }

              // Проверка успешной вставки
              if (results.affectedRows === 0) {
                  console.error("Database error:", "Insertion failed, no rows affected.");
                  return reject(false);
              }

              resolve(true); // Успешная вставка
          }
      );
  });
};


// Создали заказ
exports.create = (orderId, deliveryDate, deliveryTypeId) => {
  return new Promise(async (resolve, reject) => {
    let courier;
    try {
      courier = await exports.findCourier(deliveryDate, deliveryTypeId);
    } catch (err) {
      console.error(`Ошибка при поиске курьера: ${err}`);
      return reject(false); // Завершить выполнение на ошибке
    }

    if (!courier) {
      console.error(`Курьер не найден: deliveryDate=${deliveryDate}, deliveryTypeId=${deliveryTypeId}`);
      return reject(false);
    }

    const [deliveryOrder, deliveryResult] = await Promise.all([
      exports.findDeliveryOrder(orderId),
      exports.deliveryOrderAdd(orderId, deliveryDate, courier.courier_id)
    ]);
  
    if (deliveryOrder) {
      console.log(`Заказ уже существует: orderId=${orderId}`);
      return resolve(true); // Заказ уже существует
    }
    if (!deliveryResult) {
      console.error(`Ошибка при добавлении заказа: orderId=${orderId}`);
      return reject(false);
    }
    
  });
};



// отменили  заказ
exports.decline = (orderId) => {
  return new Promise((resolve, reject) => {  
    db.query(common.SQL.DELIVERY.DECLINE, [orderId],
      (err, results) => {
        if (err) {
          console.log(err); 
          return reject(false);
        }
        resolve(true);
    }
   );
 });
};


async function startConsumer(queue, handler) {
  try {
      const connection = await amqp.connect(`amqp://${login}:${pwd}@${host}:${port}`);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, { durable: true });
      console.log(`Listening on queue ${queue}...`);
      channel.consume(queue, async (msg) => {
          if (msg) {
              try {
                  const data = JSON.parse(msg.content.toString());
                  await handler(data);
                  channel.ack(msg);
              } catch (error) {
                  console.error(`Error processing message: ${error}`);
                  // channel.nack(msg, false, true); // Повторная попытка
              }
          }
      });
  } catch (error) {
      console.error(`Error connecting to RabbitMQ: ${error}`);
  }
}

/*
{
"orderId":41, 
"deliveryId" : "COURIER_SERVICE"
}
*/

startConsumer(DELIVERY_RESERVATION_QUEUE, async (msg) => {
   const today = new Date();
   const year = today.getFullYear();
   const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
   const day = String(today.getDate()).padStart(2, '0');
   const formattedDate = `${year}-${month}-${day}`;
   await  exports.create(msg.order.orderId, formattedDate, msg.order.deliveryId)       
});

startConsumer(DELIVERY_DECLINE_QUEUE, async (msg) => {
  await exports.decline(msg.order.orderId),
  await courierSearchStatusMessageSend(msg)
});

async function courierSearchStatusMessageSend(msg){ // поставить статус - поиск курьера (когда нет свободного)
  try {
     let rabbitClient = new ClientProducerAMQP();
      await  rabbitClient.sendMessage(ORDER_STATUS_QUEUE, {status: true, processStatus : 'COURIER_SEARCH',  order: msg.order })  
    } catch (error) {
      console.log(`declineStatusMessageSend. Ошибка ${error}`);
  } 
  return;
}
