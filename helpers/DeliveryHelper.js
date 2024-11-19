const db = require('openfsm-database-connection-producer');
const { UserPermissionsDTO, RoleDTO, PermissionDTO } = require('openfsm-permissions-dto');
const { UserDTO } = require('openfsm-user-dto');
const common      = require('openfsm-common');  /* Библиотека с общими параметрами */
const {OrderDto}   = require('openfsm-order-dto');

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
          common.SQL.DELIVERY.FIND_COURIER_BY_ID,
          `SELECT * FROM delivery_couriers WHERE courier_id = ? `, [courierId],
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


// создали заказ
exports.create = (orderId, deliveryDate, deliveryTypeId) => {
  return new Promise( async (resolve, reject) => {  
    let courier =  await exports.findCourier(deliveryDate, deliveryTypeId);
      if(courier) {  // курьер найден
        let deliveryOrder = await exports.findDeliveryOrder(orderId);
          if(!deliveryOrder) {  // заказ не был ранее сформирован - добавляем
             let deliveryResult = await exports.deliveryOrderAdd(orderId, deliveryDate, courier.courier_id);
                if(deliveryResult) { // зарегистрировали заказ
                 resolve(true)
              } else 
            reject(false)
         } else 
          resolve(true)
       }
   });
};


// отменили  заказ
exports.decline = (deliveryOrderId) => {
  return new Promise((resolve, reject) => {  
    db.query(common.SQL.DELIVERY.DECLINE, [deliveryOrderId],
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
