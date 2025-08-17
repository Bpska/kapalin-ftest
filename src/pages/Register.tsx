import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, BookOpen, Phone } from 'lucide-react';
import { PhoneAuthService } from '@/lib/phoneAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Reset phone verification if phone number changes
    if (e.target.name === 'phoneNumber') {
      setPhoneVerified(false);
      setOtpSent(false);
      setOtp('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.phoneNumber);
      toast({
        title: "Account created!",
        description: "Welcome to Kapalin Gita Tales. Your wisdom journey begins now.",
      });
      navigate('/');
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!PhoneAuthService.validatePhoneNumber(formData.phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Initialize reCAPTCHA
      PhoneAuthService.initializeRecaptcha('recaptcha-container');
      
      // Send OTP
      const formattedPhone = PhoneAuthService.formatPhoneNumber(formData.phoneNumber);
      // Note: This is a simplified implementation. In a real app, you'd use Firebase's phone auth
      // For now, we'll simulate OTP sending
      setTimeout(() => {
        setOtpSent(true);
        setVerificationId('simulated-verification-id');
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the OTP (Demo: 123456)",
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp !== '123456') { // Demo OTP
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP",
        variant: "destructive",
      });
      return;
    }

    setPhoneVerified(true);
    toast({
      title: "Phone Verified",
      description: "Your phone number has been verified successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-soft">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-sage-brown">
            Join Kapalin Gita Tales
          </h1>
          <p className="text-muted-foreground">Start your child's wisdom journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="flex space-x-2">
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
                maxLength={10}
                disabled={phoneVerified || otpSent}
              />
              {!phoneVerified && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOTP}
                  disabled={isLoading || !formData.phoneNumber || !PhoneAuthService.validatePhoneNumber(formData.phoneNumber)}
                >
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </Button>
              )}
            </div>
            {phoneVerified && (
              <p className="text-sm text-green-600">✓ Phone number verified</p>
            )}
          </div>

          {otpSent && !phoneVerified && (
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <div className="flex space-x-2">
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerifyOTP}
                  disabled={!otp || otp.length !== 6}
                >
                  Verify
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Demo OTP: 123456</p>
            </div>
          )}

          <div id="recaptcha-container"></div>

          <Button
            type="submit"
            className="w-full"
            variant="wisdom"
            disabled={isLoading || (formData.phoneNumber && !phoneVerified)}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;