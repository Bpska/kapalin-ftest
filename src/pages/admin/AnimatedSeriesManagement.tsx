import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Video } from 'lucide-react';
import { toast } from 'sonner';
import { adminService, AnimatedSeriesForm } from '@/services/adminService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AnimatedSeriesManagement = () => {
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<any | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<AnimatedSeriesForm>({
    title: '',
    description: '',
    thumbnail_url: '',
    episode_number: 1,
    season_number: 1,
    video_url: '',
    duration: 0,
    category: '',
  });

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      const data = await adminService.getAnimatedSeriesList();
      setSeriesList(data);
    } catch (error) {
      toast.error('Failed to load animated series');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let thumbnailUrl = formData.thumbnail_url;
      
      if (thumbnailFile) {
        const fileName = `${Date.now()}_${thumbnailFile.name}`;
        thumbnailUrl = await adminService.uploadFile('book-covers', fileName, thumbnailFile);
      }

      const seriesData = { ...formData, thumbnail_url: thumbnailUrl };

      if (editingSeries) {
        await adminService.updateAnimatedSeries(editingSeries.id, seriesData);
        toast.success('Series updated successfully');
      } else {
        await adminService.createAnimatedSeries(seriesData);
        toast.success('Series created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      loadSeries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save series');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this series?')) return;
    
    try {
      await adminService.deleteAnimatedSeries(id);
      toast.success('Series deleted successfully');
      loadSeries();
    } catch (error) {
      toast.error('Failed to delete series');
    }
  };

  const handleEdit = (series: any) => {
    setEditingSeries(series);
    setFormData(series);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail_url: '',
      episode_number: 1,
      season_number: 1,
      video_url: '',
      duration: 0,
      category: '',
    });
    setEditingSeries(null);
    setThumbnailFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Animated Series Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Episode
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSeries ? 'Edit Episode' : 'Add New Episode'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Season</Label>
                  <Input
                    type="number"
                    value={formData.season_number || ''}
                    onChange={(e) => setFormData({ ...formData, season_number: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <Label>Episode</Label>
                  <Input
                    type="number"
                    value={formData.episode_number || ''}
                    onChange={(e) => setFormData({ ...formData, episode_number: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Duration (sec)</Label>
                  <Input
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Video URL</Label>
                <Input
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div>
                <Label>Thumbnail Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSeries ? 'Update' : 'Create'} Episode
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {seriesList.map((series) => (
          <Card key={series.id}>
            <CardHeader>
              {series.thumbnail_url ? (
                <img src={series.thumbnail_url} alt={series.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              ) : (
                <div className="w-full h-48 bg-accent rounded-lg mb-4 flex items-center justify-center">
                  <Video className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <CardTitle className="text-lg">{series.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{series.description}</p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                {series.season_number && <span>S{series.season_number}</span>}
                {series.episode_number && <span>E{series.episode_number}</span>}
                {series.duration && <span>{Math.floor(series.duration / 60)}m</span>}
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(series)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(series.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnimatedSeriesManagement;
