"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { register } from '@/app/api';
import { useRouter } from 'next/navigation';
import { log } from 'console';
import axios from 'axios';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    passwordMismatch: false,
    passwordWeak: false,
    emailInvalid: false,
    apiError: '',
    fieldErrors: {} as Record<string, string>
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Password validation - at least 8 characters, 1 uppercase, 1 lowercase, 1 number
  // Special characters allowed: @$!%*?&
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

  const validateField = (id: string, value: string) => {
    const newErrors = { ...errors };
    switch (id) {
      case 'email':
        newErrors.emailInvalid = !emailRegex.test(value) && value.length > 0;
        break;
      case 'password':
        newErrors.passwordWeak = !passwordRegex.test(value) && value.length > 0;
        newErrors.passwordMismatch = formData.confirmPassword !== value && formData.confirmPassword.length > 0;
        break;
      case 'confirmPassword':
        newErrors.passwordMismatch = formData.password !== value && value.length > 0;
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Clear API errors when user starts typing
    setErrors(prev => ({
      ...prev,
      apiError: '',
      fieldErrors: {}
    }));

    // Validate field in real-time
    validateField(id, value);
  };

  const validateForm = () => {
    const newErrors = {
      passwordMismatch: formData.password !== formData.confirmPassword,
      passwordWeak: !passwordRegex.test(formData.password),
      emailInvalid: !emailRegex.test(formData.email),
      apiError: '',
      fieldErrors: {} as Record<string, string>
    };

    // Check required fields
    const fieldErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) fieldErrors.firstName = 'First name is required';
    if (!formData.email.trim()) fieldErrors.email = 'Email is required';
    if (!formData.password) fieldErrors.password = 'Password is required';
    if (!formData.confirmPassword) fieldErrors.confirmPassword = 'Please confirm your password';

    newErrors.fieldErrors = fieldErrors;
    setErrors(newErrors);

    return !newErrors.passwordMismatch && 
           !newErrors.passwordWeak && 
           !newErrors.emailInvalid && 
           Object.keys(fieldErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setErrors(prev => ({ ...prev, apiError: '' }));

    try {
      const userData = {
        name: formData.firstName,
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      // const result = await register(userData);      
      const data = await axios.post("http://localhost:8000/api/auth/register", userData);
      
      console.log('Registration successful:', data);

      setSuccess(true);
      setFormData({
        firstName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/services');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({
        ...prev,
        apiError: error instanceof Error ? error.message : 'Registration failed. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Account Created Successfully!</h2>
                <p className="text-gray-600">Welcome to Y-Axis. Redirecting you to sign in...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 sm:space-x-3">
            <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Y-Axis</h1>
              <p className="text-blue-600 text-xs sm:text-sm">Your Immigration Partner</p>
            </div>
          </Link>
        </div>

        {/* Signup Form */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Join Y-Axis to start your immigration journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm sm:text-base">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="h-10 sm:h-11"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.fieldErrors.firstName && (
                    <p className="text-red-500 text-xs">{errors.fieldErrors.firstName}</p>
                  )}
                </div>                  
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-10 sm:h-11"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.emailInvalid && (
                  <p className="text-red-500 text-xs">Please enter a valid email address</p>
                )}
                {errors.fieldErrors.email && (
                  <p className="text-red-500 text-xs">{errors.fieldErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="h-10 sm:h-11"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.passwordWeak && (
                  <p className="text-red-500 text-xs">
                    Password must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                )}
                {errors.fieldErrors.password && (
                  <p className="text-red-500 text-xs">{errors.fieldErrors.password}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="h-10 sm:h-11"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {errors.fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-xs">{errors.fieldErrors.confirmPassword}</p>
                )}
              </div>
              
              {errors.passwordMismatch && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Passwords do not match. Please make sure both password fields are identical.
                  </AlertDescription>
                </Alert>
              )}

              {errors.apiError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.apiError}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (  
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/sign-in" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;