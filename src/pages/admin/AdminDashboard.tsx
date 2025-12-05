import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Music, Video, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { bookService } from '@/services/bookService';
import { adminService } from '@/services/adminService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock sales data
const salesData = [
  { date: 'Mon', revenue: 4200 },
  { date: 'Tue', revenue: 3800 },
  { date: 'Wed', revenue: 5100 },
  { date: 'Thu', revenue: 4600 },
  { date: 'Fri', revenue: 6200 },
  { date: 'Sat', revenue: 7800 },
  { date: 'Sun', revenue: 5900 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Rahul Sharma', amount: 598, status: 'delivered' },
  { id: 'ORD-002', customer: 'Priya Patel', amount: 299, status: 'shipped' },
  { id: 'ORD-003', customer: 'Amit Kumar', amount: 897, status: 'processing' },
  { id: 'ORD-004', customer: 'Sneha Reddy', amount: 299, status: 'pending' },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    books: 0,
    audio: 0,
    series: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, audio, series] = await Promise.all([
          bookService.getAllBooks(),
          adminService.getAudioList(),
          adminService.getAnimatedSeriesList(),
        ]);

        setStats({
          books: books.length,
          audio: audio.length,
          series: series.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);

  const statCards = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', change: '+12.5%' },
    { title: 'Total Orders', value: '107', icon: ShoppingCart, color: 'text-blue-600', change: '+8.2%' },
    { title: 'Total Books', value: stats.books, icon: Book, color: 'text-purple-600', change: '+3' },
    { title: 'Total Customers', value: '45', icon: Users, color: 'text-orange-600', change: '+15.3%' },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'secondary',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                {stat.change && (
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change} from last week
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 days performance</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <p className="text-sm text-muted-foreground">Latest customer orders</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>₹{order.amount}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Content Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Audio Content</CardTitle>
            <Music className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.audio}</div>
            <p className="text-xs text-muted-foreground mt-1">Total audio files</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Animated Series</CardTitle>
            <Video className="h-5 w-5 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.series}</div>
            <p className="text-xs text-muted-foreground mt-1">Total episodes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{(totalRevenue / 107).toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Per order average</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
