import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, User, Phone, Instagram, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UploadFormData {
  name: string;
  phone: string;
  instagram: string;
  
}

const ImageUpload = () => {
  const { user } = useAuth();
  console.log('User object:', user); // Log the user object
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState<UploadFormData>({
    name: user?.name || user?.email || '',
    phone: '',
    instagram: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !imageFile) {
      toast({
        title: "Missing information",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Upload image to Supabase Storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${imageFile.name}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath);

      // Save upload data to Supabase database
      const { error: dbError } = await supabase
        .from('image_uploads')
        .insert({
          user_id: user.id,
          name: formData.name,
          phone: formData.phone,
          instagram: formData.instagram,
          image_url: urlData.publicUrl,
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Upload successful!",
        description: "Your image has been uploaded and is pending review.",
      });

      // Reset form
      setImageFile(null);
      setPreviewUrl('');
      setFormData({
        name: user?.name || user?.email || '',
        phone: '',
        instagram: '',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-2xl font-bold text-sage-brown text-center mb-6">
          Image Upload
        </h1>

        <Card className="p-6 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-48 h-48 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30 overflow-hidden">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Select an image</p>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <p className="text-sm text-muted-foreground text-center">
                Click the camera icon to select an image to upload
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Instagram Link */}
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Profile Link</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  name="instagram"
                  type="url"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourusername"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !imageFile}
              variant="wisdom"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ImageUpload;
