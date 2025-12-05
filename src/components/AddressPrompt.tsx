import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import SupabaseUserService from '@/lib/supabaseUserService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AddressPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddressPrompt = ({ open, onOpenChange }: AddressPromptProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phoneNumber || '',
    zip_code: '',
    state: '',
    city: '',
    street: '',
    country: 'India',
    type: 'home' as 'home' | 'office' | 'other',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('=== SAVE ADDRESS CLICKED ===');

    if (!user) {
      console.log('No user found');
      toast({ title: 'Not authenticated', description: 'Please login to continue', variant: 'destructive' });
      return;
    }

    // Basic validation
    if (!form.name || !form.phone || !form.zip_code || !form.city || !form.state || !form.street) {
      console.log('Missing fields:', { name: form.name, phone: form.phone, zip_code: form.zip_code, city: form.city, state: form.state, street: form.street });
      toast({ title: 'Missing information', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      console.log('Adding address for user:', user.id);
      // Add address to addresses table
      const addressId = await SupabaseUserService.addAddress(user.id, {
        type: form.type,
        name: form.name,
        street: form.street,
        city: form.city,
        state: form.state,
        zip_code: form.zip_code,
        country: form.country,
        is_default: true,
      });

      console.log('Address saved with ID:', addressId);

      // Update profile phone if provided
      if (form.phone) {
        console.log('Updating phone for user:', user.id);
        await SupabaseUserService.updateUserProfile(user.id, { phone: form.phone });
      }

      console.log('Address save completed successfully');
      toast({ title: 'Address saved', description: 'Your address was saved successfully.' });
      onOpenChange(false);
      
      // Navigate to payment page
      console.log('Navigating to payment page');
      navigate('/payment');
    } catch (error) {
      console.error('Error saving address:', error);
      toast({ title: 'Save failed', description: 'Could not save address. Try again.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Delivery Address</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide your delivery address to continue to payment.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 mt-2">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="street">House No., Building, Street *</Label>
            <Textarea id="street" name="street" value={form.street} onChange={handleChange} className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" value={form.city} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input id="state" name="state" value={form.state} onChange={handleChange} className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="zip_code">PIN Code *</Label>
              <Input id="zip_code" name="zip_code" value={form.zip_code} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" value={form.country} readOnly className="mt-1" />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <button
              className={`px-3 py-1 rounded-md border ${form.type === 'home' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setForm(prev => ({ ...prev, type: 'home' }))}
              type="button"
            >
              Home
            </button>
            <button
              className={`px-3 py-1 rounded-md border ${form.type === 'office' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setForm(prev => ({ ...prev, type: 'office' }))}
              type="button"
            >
              Work
            </button>
            <button
              className={`px-3 py-1 rounded-md border ${form.type === 'other' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setForm(prev => ({ ...prev, type: 'other' }))}
              type="button"
            >
              Other
            </button>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <button
            onClick={handleSave}
            disabled={isSaving}
            type="button"
            style={{
              padding: '8px 16px',
              backgroundColor: '#F59E0B',
              color: '#78471C',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#D97706';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#F59E0B';
              }
            }}
          >
            {isSaving ? 'Saving...' : 'Save & Continue'}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddressPrompt;
