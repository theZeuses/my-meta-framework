export const verifyEmailMailView = (payload: any) : string => {
    return `
        <h5>Hello,</h5>
        <br>
        <p>
            Please use <strong>${payload.code}</strong> as your verification code.
            <br>
        </p>
        <br>
        <br>
        <h5>Regards</h5>
        <h6>Nobody</h6>
    `;
}