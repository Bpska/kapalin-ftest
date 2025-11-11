import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Lightbulb, 
  BookOpen, 
  PenTool, 
  Brain, 
  Sparkles, 
  Save, 
  Copy, 
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
  usage: string;
  examples: string[];
  createdAt: string;
  isFavorite: boolean;
}

const FuturePrompts = () => {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([
    {
      id: 'prompt-1',
      title: 'Story Generation - Bhagavad Gita',
      description: 'Generate engaging stories based on Bhagavad Gita teachings for children',
      category: 'Story Generation',
      content: `You are a master storyteller specializing in ancient Indian wisdom. Create an engaging story for children aged 8-12 based on the Bhagavad Gita teachings. The story should:

1. Include a relatable character facing a moral dilemma
2. Incorporate wisdom from the Gita in simple language
3. Have a clear moral lesson
4. Be engaging and age-appropriate
5. Include dialogue and descriptive language

Focus on themes like: courage, friendship, honesty, or helping others.`,
      tags: ['children', 'bhagavad-gita', 'moral-lessons', 'storytelling'],
      usage: 'Use this prompt to create educational stories that teach ancient wisdom to young minds.',
      examples: [
        'Krishna and Arjuna\'s friendship story',
        'The wise old tree and the young bird',
        'Arjuna learns about duty and courage'
      ],
      createdAt: '2024-01-15',
      isFavorite: true
    },
    {
      id: 'prompt-2',
      title: 'Character Development - Hindu Mythology',
      description: 'Create detailed character profiles for figures from Hindu mythology',
      category: 'Character Development',
      content: `Develop a comprehensive character profile for a figure from Hindu mythology. Include:

1. Physical description and appearance
2. Personality traits and characteristics
3. Powers and abilities
4. Background story and origin
5. Relationships with other characters
6. Moral lessons they represent
7. How they can inspire modern readers

Choose from: Hanuman, Krishna, Rama, Sita, Durga, or any other deity.`,
      tags: ['hindu-mythology', 'character-development', 'spiritual-leaders', 'inspiration'],
      usage: 'Perfect for creating engaging character descriptions in books, articles, or educational content.',
      examples: [
        'Hanuman - The embodiment of devotion and strength',
        'Krishna - The divine teacher and friend',
        'Durga - The fierce protector and mother'
      ],
      createdAt: '2024-01-10',
      isFavorite: false
    },
    {
      id: 'prompt-3',
      title: 'Lesson Planning - Spiritual Education',
      description: 'Design lesson plans for teaching spiritual concepts to different age groups',
      category: 'Education',
      content: `Create a comprehensive lesson plan for teaching spiritual concepts to [AGE_GROUP]. The lesson should:

1. Have clear learning objectives
2. Include age-appropriate activities
3. Incorporate storytelling and examples
4. Provide discussion questions
5. Suggest follow-up activities
6. Address common misconceptions
7. Include assessment methods

Topics: karma, dharma, meditation, compassion, or any spiritual concept.`,
      tags: ['education', 'lesson-planning', 'spiritual-concepts', 'age-appropriate'],
      usage: 'Ideal for teachers, parents, or educators creating spiritual education programs.',
      examples: [
        'Teaching karma to preschoolers through stories',
        'Meditation techniques for teenagers',
        'Understanding dharma for young adults'
      ],
      createdAt: '2024-01-08',
      isFavorite: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    tags: '',
    usage: ''
  });

  const categories = ['all', 'Story Generation', 'Character Development', 'Education', 'Content Creation', 'Translation'];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePrompt = () => {
    if (newPrompt.title && newPrompt.content) {
      const prompt: PromptTemplate = {
        id: `prompt-${Date.now()}`,
        title: newPrompt.title,
        description: newPrompt.description,
        category: newPrompt.category,
        content: newPrompt.content,
        tags: newPrompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        usage: newPrompt.usage,
        examples: [],
        createdAt: new Date().toISOString().split('T')[0],
        isFavorite: false
      };
      setPrompts([prompt, ...prompts]);
      setNewPrompt({ title: '', description: '', category: '', content: '', tags: '', usage: '' });
      setShowCreateForm(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setPrompts(prompts.map(prompt => 
      prompt.id === id ? { ...prompt, isFavorite: !prompt.isFavorite } : prompt
    ));
  };

  const copyPrompt = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(prompt => prompt.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-16 dark:from-primary/20 dark:via-primary/10 dark:to-transparent">
        <div className="absolute inset-0 opacity-30 dark:opacity-20"></div>
        
        {/* Theme Toggle Button - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary dark:border-primary/40 dark:text-primary dark:bg-primary/10">
            AI Assistant
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight dark:text-foreground">
            Future Prompts Library
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto dark:text-muted-foreground">
            Access our curated collection of AI prompts for creating spiritual content, stories, and educational materials
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-background dark:text-foreground dark:border-border dark:placeholder:text-muted-foreground"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md text-foreground dark:bg-background dark:text-foreground dark:border-border"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Create Button */}
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Prompt
          </Button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-6 dark:bg-card/90 dark:border-border dark:shadow-2xl">
            <h3 className="text-xl font-bold mb-4 dark:text-foreground">Create New Prompt Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPrompt.title}
                  onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
                  placeholder="Enter prompt title"
                  className="dark:bg-background dark:text-foreground dark:border-border"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newPrompt.category}
                  onChange={(e) => setNewPrompt({...newPrompt, category: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground dark:bg-background dark:text-foreground dark:border-border"
                >
                  <option value="">Select category</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newPrompt.description}
                  onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
                  placeholder="Brief description of the prompt"
                  className="dark:bg-background dark:text-foreground dark:border-border"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="content">Prompt Content</Label>
                <Textarea
                  id="content"
                  value={newPrompt.content}
                  onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
                  placeholder="Enter the full prompt content..."
                  rows={6}
                  className="dark:bg-background dark:text-foreground dark:border-border"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newPrompt.tags}
                  onChange={(e) => setNewPrompt({...newPrompt, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                  className="dark:bg-background dark:text-foreground dark:border-border"
                />
              </div>
              <div>
                <Label htmlFor="usage">Usage Instructions</Label>
                <Input
                  id="usage"
                  value={newPrompt.usage}
                  onChange={(e) => setNewPrompt({...newPrompt, usage: e.target.value})}
                  placeholder="How to use this prompt"
                  className="dark:bg-background dark:text-foreground dark:border-border"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleCreatePrompt}>Create Prompt</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="dark:border-border dark:hover:bg-accent/50">Cancel</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Prompts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="overflow-hidden shadow-xl border-0 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 dark:bg-card/90 dark:border-border dark:shadow-2xl dark:hover:shadow-3xl">
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs dark:border-border dark:bg-transparent">
                        {prompt.category}
                      </Badge>
                      {prompt.isFavorite && (
                        <Sparkles className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2 dark:text-foreground">
                      {prompt.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed dark:text-muted-foreground">
                      {prompt.description}
                    </p>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="bg-muted/30 rounded-lg p-4 dark:bg-muted/20">
                  <p className="text-sm text-muted-foreground line-clamp-4 dark:text-muted-foreground">
                    {prompt.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs dark:bg-secondary dark:text-secondary-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Usage */}
                <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                  <strong>Usage:</strong> {prompt.usage}
                </div>

                {/* Examples */}
                {prompt.examples.length > 0 && (
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                    <strong>Examples:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      {prompt.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50 dark:border-border/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
                    <span>Created: {prompt.createdAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleFavorite(prompt.id)}
                      variant="ghost"
                      size="sm"
                      className={prompt.isFavorite ? 'text-yellow-500 dark:text-yellow-400' : ''}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => copyPrompt(prompt.content)}
                      variant="outline"
                      size="sm"
                      className="dark:border-border dark:hover:bg-accent/50"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deletePrompt(prompt.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 dark:border-border dark:hover:bg-accent/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4 dark:text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2 dark:text-foreground">No prompts found</h3>
            <p className="text-muted-foreground dark:text-muted-foreground">Try adjusting your search or create a new prompt template.</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Card className="p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 dark:from-primary/20 dark:via-primary/10 dark:to-transparent dark:border-primary/30 dark:bg-card/90">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4 dark:text-foreground">
            Ready to Create Amazing Content?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto dark:text-muted-foreground">
            Use our AI prompt library to generate engaging spiritual content, educational materials, 
            and inspiring stories that connect with readers of all ages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="default"
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Your First Prompt
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 dark:border-border dark:hover:bg-accent/50"
            >
              <Download className="h-5 w-5" />
              Export Library
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FuturePrompts; 