import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseUserService, PaymentMethod } from '@/lib/supabaseUserService';

const MyPaymentMethods = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadPaymentMethods();
        }
    }, [user]);

    const loadPaymentMethods = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const methods = await SupabaseUserService.getPaymentMethods(user.id);
            setPaymentMethods(methods);
        } catch (error) {
            console.error('Error loading payment methods:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const maskCardNumber = (last4: string) => {
        return `•••• •••• •••• ${last4}`;
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
                    <h1 className="text-2xl font-bold">Payment Methods</h1>
                </div>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </div>

            {/* Payment Methods List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                    <p className="text-muted-foreground mt-4">Loading payment methods...</p>
                </div>
            ) : paymentMethods.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Payment Methods</h3>
                        <p className="text-muted-foreground mb-4">Add a payment method for faster checkout</p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Payment Method
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <Card key={method.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-lg bg-primary/10">
                                            <CreditCard className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg">{method.name}</CardTitle>
                                                {method.is_default && (
                                                    <Badge variant="default">Default</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground uppercase">{method.type}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {method.card_last4 && (
                                        <p className="text-sm font-mono">{maskCardNumber(method.card_last4)}</p>
                                    )}
                                    {method.card_expiry && (
                                        <p className="text-sm text-muted-foreground">Expires: {method.card_expiry}</p>
                                    )}
                                    {!method.is_default && (
                                        <Button variant="outline" className="w-full" size="sm">
                                            Set as Default
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPaymentMethods;
