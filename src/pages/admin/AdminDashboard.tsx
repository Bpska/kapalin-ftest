import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Music, Video, Users } from 'lucide-react';
import { bookService } from '@/services/bookService';
import { adminService } from '@/services/adminService';

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

  const statCards = [
    { title: 'Total Books', value: stats.books, icon: Book, color: 'text-blue-600' },
    { title: 'Audio Content', value: stats.audio, icon: Music, color: 'text-purple-600' },
    { title: 'Animated Series', value: stats.series, icon: Video, color: 'text-pink-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your content from here</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
