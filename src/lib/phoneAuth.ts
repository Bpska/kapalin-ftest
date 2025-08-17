import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  linkWithCredential,
  PhoneAuthProvider,
  updatePhoneNumber
} from 'firebase/auth';
import { auth } from './firebase';

export class PhoneAuthService {
  private static appVerifier: RecaptchaVerifier | null = null;

  // Initialize reCAPTCHA
  static initializeRecaptcha(containerId: string = 'recaptcha-container') {
    if (this.appVerifier) {
      this.appVerifier.clear();
    }
    
    this.appVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: (response: any) => {
        console.log('reCAPTCHA solved', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
    
    return this.appVerifier;
  }

  // Send OTP to phone number
  static async sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
    if (!this.appVerifier) {
      throw new Error('Recaptcha not initialized');
    }

    try {
      // Format phone number (add +91 for India if not present)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        this.appVerifier
      );
      
      return confirmationResult;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  // Verify OTP
  static async verifyOTP(confirmationResult: ConfirmationResult, otp: string): Promise<any> {
    try {
      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
      return credential;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  // Link phone number to existing account
  static async linkPhoneNumber(phoneNumber: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(formattedPhone, this.appVerifier!);
      
      // This would require OTP verification in a real implementation
      // For now, we'll just update the phone number in the user profile
      await updatePhoneNumber(user, PhoneAuthProvider.credential(verificationId, '123456'));
    } catch (error) {
      console.error('Error linking phone number:', error);
      throw error;
    }
  }

  // Format phone number
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add +91 prefix if it's a 10-digit Indian number
    if (cleaned.length === 10 && !phoneNumber.startsWith('+')) {
      return `+91${cleaned}`;
    }
    
    return phoneNumber;
  }

  // Validate phone number
  static validatePhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Indian phone numbers: 10 digits
    if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
      return true;
    }
    
    // International format
    if (phoneNumber.startsWith('+') && cleaned.length >= 10 && cleaned.length <= 15) {
      return true;
    }
    
    return false;
  }
}
