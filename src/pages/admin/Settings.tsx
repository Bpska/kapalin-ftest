import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    const [siteName, setSiteName] = useState('Kapalin Gita Tales');
    const [siteEmail, setSiteEmail] = useState('contact@kapalingita.com');
    const [sitePhone, setSitePhone] = useState('+91 98765 43210');
    const [siteAddress, setSiteAddress] = useState('Mumbai, Maharashtra, India');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [orderNotifications, setOrderNotifications] = useState(true);
    const [lowStockAlerts, setLowStockAlerts] = useState(true);

    const handleSaveGeneral = () => {
        toast.success('General settings saved successfully');
    };

    const handleSaveNotifications = () => {
        toast.success('Notification settings saved successfully');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your application settings</p>
                </div>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Update your site information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    id="siteName"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteEmail">Contact Email</Label>
                                <Input
                                    id="siteEmail"
                                    type="email"
                                    value={siteEmail}
                                    onChange={(e) => setSiteEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sitePhone">Contact Phone</Label>
                                <Input
                                    id="sitePhone"
                                    value={sitePhone}
                                    onChange={(e) => setSitePhone(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteAddress">Address</Label>
                                <Textarea
                                    id="siteAddress"
                                    value={siteAddress}
                                    onChange={(e) => setSiteAddress(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <Button onClick={handleSaveGeneral}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Manage how you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive email notifications for important updates
                                    </p>
                                </div>
                                <Switch
                                    id="emailNotifications"
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="orderNotifications">Order Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when new orders are placed
                                    </p>
                                </div>
                                <Switch
                                    id="orderNotifications"
                                    checked={orderNotifications}
                                    onCheckedChange={setOrderNotifications}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive alerts when products are running low
                                    </p>
                                </div>
                                <Switch
                                    id="lowStockAlerts"
                                    checked={lowStockAlerts}
                                    onCheckedChange={setLowStockAlerts}
                                />
                            </div>
                            <Button onClick={handleSaveNotifications}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="payment">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Gateway Settings</CardTitle>
                            <CardDescription>Configure payment methods</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Razorpay API Key</Label>
                                <Input type="password" placeholder="Enter Razorpay API Key" />
                            </div>
                            <div className="space-y-2">
                                <Label>Razorpay Secret Key</Label>
                                <Input type="password" placeholder="Enter Razorpay Secret Key" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable Cash on Delivery</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow customers to pay on delivery
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Button>
                                <Save className="mr-2 h-4 w-4" />
                                Save Payment Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Shipping Settings */}
                <TabsContent value="shipping">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Settings</CardTitle>
                            <CardDescription>Configure shipping options</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Standard Shipping Cost</Label>
                                <Input type="number" placeholder="₹50" />
                            </div>
                            <div className="space-y-2">
                                <Label>Express Shipping Cost</Label>
                                <Input type="number" placeholder="₹150" />
                            </div>
                            <div className="space-y-2">
                                <Label>Free Shipping Threshold</Label>
                                <Input type="number" placeholder="₹500" />
                                <p className="text-sm text-muted-foreground">
                                    Orders above this amount get free shipping
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Estimated Delivery Days</Label>
                                <Input type="number" placeholder="3-5 days" />
                            </div>
                            <Button>
                                <Save className="mr-2 h-4 w-4" />
                                Save Shipping Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
