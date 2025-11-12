import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Music } from 'lucide-react';
import { toast } from 'sonner';
import { adminService, AudioForm } from '@/services/adminService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AudioManagement = () => {
  const [audioList, setAudioList] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAudio, setEditingAudio] = useState<any | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<AudioForm>({
    title: '',
    description: '',
    audio_url: '',
    duration: 0,
    category: '',
    image_url: '',
  });

  useEffect(() => {
    loadAudio();
  }, []);

  const loadAudio = async () => {
    try {
      const data = await adminService.getAudioList();
      setAudioList(data);
    } catch (error) {
      toast.error('Failed to load audio content');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let audioUrl = formData.audio_url;
      let imageUrl = formData.image_url;
      
      if (audioFile) {
        const fileName = `${Date.now()}_${audioFile.name}`;
        audioUrl = await adminService.uploadFile('audio-files', fileName, audioFile);
      }

      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        imageUrl = await adminService.uploadFile('book-covers', fileName, imageFile);
      }

      const audioData = { ...formData, audio_url: audioUrl, image_url: imageUrl };

      if (editingAudio) {
        await adminService.updateAudio(editingAudio.id, audioData);
        toast.success('Audio updated successfully');
      } else {
        await adminService.createAudio(audioData);
        toast.success('Audio created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      loadAudio();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save audio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this audio?')) return;
    
    try {
      await adminService.deleteAudio(id);
      toast.success('Audio deleted successfully');
      loadAudio();
    } catch (error) {
      toast.error('Failed to delete audio');
    }
  };

  const handleEdit = (audio: any) => {
    setEditingAudio(audio);
    setFormData(audio);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      audio_url: '',
      duration: 0,
      category: '',
      image_url: '',
    });
    setEditingAudio(null);
    setAudioFile(null);
    setImageFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Audio Content Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Audio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAudio ? 'Edit Audio' : 'Add New Audio'}</DialogTitle>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Audio File *</Label>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  required={!editingAudio}
                />
              </div>

              <div>
                <Label>Cover Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingAudio ? 'Update' : 'Create'} Audio
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
        {audioList.map((audio) => (
          <Card key={audio.id}>
            <CardHeader>
              {audio.image_url ? (
                <img src={audio.image_url} alt={audio.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              ) : (
                <div className="w-full h-48 bg-accent rounded-lg mb-4 flex items-center justify-center">
                  <Music className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <CardTitle className="text-lg">{audio.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{audio.description}</p>
              {audio.duration && (
                <p className="text-xs text-muted-foreground">
                  Duration: {Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, '0')}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(audio)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(audio.id)}>
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

export default AudioManagement;
