import NotifmeSdk, { EmailRequest, Notification, NotificationStatus } from 'notifme-sdk';
import { notifmeConfig } from '@src/config';

var notifme: NotifmeSdk = new NotifmeSdk({});

/**
 * Generate a singleton of NotifmeSDK
 */
export const initializeNotifme = () => {
    notifme = new NotifmeSdk(notifmeConfig);
    console.log('notifme initialized...')
}

/**
 * Sends an email
 */
export async function sendEmail(email: EmailRequest) : Promise<NotificationStatus> {
    try{
        return await notifme.send({email});
    }catch(err){
        throw(err);
    }
}

/**
 * Sends a notification to multiple channels
 */
export async function send(notification_requests: Notification) : Promise<NotificationStatus> {
    try{
        return await notifme.send(notification_requests);
    }catch(err){
        throw(err);
    }
}

export default notifme;