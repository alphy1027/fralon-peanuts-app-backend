const Notification = require('..//models/notification');

class NotificationService {
    constructor(notificationModel) {
        this.Notification = notificationModel;
    }

    async createNotification(notificationDetails, session = null) {
        return (
            session ?
                await this.Notification.create([notificationDetails], { session }) :
                await this.Notification.create(notificationDetails)
        )
    }

    async getNotificationById(notificationId) {
        return await this.Notification.findById(notificationId).populate({ path: 'client', select: 'username email' }).exec();
    }

    async getAllNotifications() {
        return await this.Notification.find().populate({ path: 'client', select: 'username email' }).exec();
    }

    async sendOrderNotification(clientId, orderId, session = null) {
        const notification = await this.createNotification({
            message: `New Order placed by client ${clientId}`,
            client: clientId,
            order: orderId,
            type: 'order',
        }, session);
        console.log('Notification for new Order created successfully')
        return notification;
    }

}

module.exports = new NotificationService(Notification);