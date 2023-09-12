import { Notification } from "@core/notification/BaseNotification";
import { EmailRequest } from "notifme-sdk";
import { verifyEmailMailView } from './views/verify-email.mail';

export class VerifyEmailNotification extends Notification {    
    protected get channels() : Array<"mail">{
        return ["mail"];
    }

    protected get queue(): "redis" | "none" {
        return "none";
    }

    protected MailFormat(receiver: any, payload?: {
        code: string
    }): Partial<EmailRequest> {
        return {
            subject: `Verify your email`,
            html: verifyEmailMailView(payload)
        }
    }
}