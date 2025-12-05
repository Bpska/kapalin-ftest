import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';

// Mock data for charts
const salesData = [
    { date: 'Mon', sales: 4200, orders: 12 },
    { date: 'Tue', sales: 3800, orders: 10 },
    { date: 'Wed', sales: 5100, orders: 15 },
    { date: 'Thu', sales: 4600, orders: 13 },
    { date: 'Fri', sales: 6200, orders: 18 },
    { date: 'Sat', sales: 7800, orders: 22 },
    { date: 'Sun', sales: 5900, orders: 17 },
];

const productData = [
    { name: 'Bhagavad Gita', value: 45, sales: 13470 },
    { name: 'Ramayana Tales', value: 25, sales: 8725 },
    { name: 'Mahabharata', value: 20, sales: 7980 },
    { name: 'Panchatantra', value: 10, sales: 2490 },
];

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'];

const Analytics = () => {
    const [dateRange, setDateRange] = useState('7days');

    const totalRevenue = salesData.reduce((sum, day) => sum + day.sales, 0);
    const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    const totalProducts = productData.reduce((sum, p) => sum + p.value, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Analytics & Reports</h1>
                    <p className="text-muted-foreground">Track your business performance</p>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+12.5% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">+8.2% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{avgOrderValue.toFixed(0)}</div>
                        <p className="text-xs text-muted-foreground">+3.1% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
                        <Users className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground">+15.3% from last week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Sales Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#F59E0B" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Orders Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Orders Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orders" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Product Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Sales Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={productData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {productData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {productData.map((product, index) => (
                                <div key={product.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index] }}
                                        />
                                        <span className="font-medium">{product.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">₹{product.sales.toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">{product.value} units</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
