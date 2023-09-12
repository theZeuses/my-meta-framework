export class InsertVerificationCodeDto {
    public attempts?: number;
    
    public channel: string;
    
    public code: string;
    
    public created_at?: Date;
    
    public expires_at: Date;
        
    public medium: string;
    
    public reference_id?: string;
    
    public type: string;
    
    public updated_at?: Date;
}