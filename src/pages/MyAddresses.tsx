import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ChevronLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseUserService, Address } from '@/lib/supabaseUserService';

const MyAddresses = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadAddresses();
        }
    }, [user]);

    const loadAddresses = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const userAddresses = await SupabaseUserService.getAddresses(user.id);
            setAddresses(userAddresses);
        } catch (error) {
            console.error('Error loading addresses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-mobile py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/profile')}
                        className="touch-manipulation"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Shipping Addresses</h1>
                </div>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </div>

            {/* Addresses List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                    <p className="text-muted-foreground mt-4">Loading addresses...</p>
                </div>
            ) : addresses.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Addresses Saved</h3>
                        <p className="text-muted-foreground mb-4">Add a shipping address for faster checkout</p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Address
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <Card key={address.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg">{address.name}</CardTitle>
                                        {address.is_default && (
                                            <Badge variant="default">Default</Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <p>{address.street}</p>
                                    <p>{address.city}, {address.state} {address.zip_code}</p>
                                    <p className="text-muted-foreground">{address.country}</p>
                                    <p className="text-muted-foreground capitalize">Type: {address.type}</p>
                                </div>
                                {!address.is_default && (
                                    <Button variant="outline" className="w-full mt-4" size="sm">
                                        Set as Default
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAddresses;