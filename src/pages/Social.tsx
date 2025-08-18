import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Youtube, Instagram, ExternalLink, Play, Heart, Share2, MessageCircle } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface SocialContent {
  id: string;
  title: string;
  description: string;
  platform: 'youtube' | 'instagram';
  url: string;
  thumbnail: string;
  views?: string;
  likes?: string;
  comments?: string;
  duration?: string;
  category: string;
}

const Social = () => {
  const [socialContent] = useState<SocialContent[]>([
    {
      id: 'social-1',
      title: 'Bhagavad Gita Chapter 1 - Complete Explanation',
      description: 'Deep dive into the first chapter with practical life lessons and modern interpretations.',
      platform: 'youtube',
      url: 'https://www.youtube.com/watch?v=example1',
      thumbnail: '/api/placeholder/400/225',
      views: '125K',
      likes: '8.2K',
      comments: '1.2K',
      duration: '45:32',
      category: 'Spiritual Education'
    },
    {
      id: 'social-2',
      title: 'Hanuman Chalisa - Beautiful Rendition',
      description: 'Traditional Hanuman Chalisa with modern musical arrangement and stunning visuals.',
      platform: 'youtube',
      url: 'https://www.youtube.com/watch?v=example2',
      thumbnail: '/api/placeholder/400/225',
      views: '89K',
      likes: '6.8K',
      comments: '890',
      duration: '12:45',
      category: 'Devotional Music'
    },
    {
      id: 'social-3',
      title: 'Krishna Stories for Kids - Episode 1',
      description: 'Engaging animated stories of Lord Krishna that teach moral values to children.',
      platform: 'youtube',
      url: 'https://www.youtube.com/watch?v=example3',
      thumbnail: '/api/placeholder/400/225',
      views: '156K',
      likes: '12.5K',
      comments: '2.1K',
      duration: '18:20',
      category: 'Children Education'
    },
    {
      id: 'social-4',
      title: 'Daily Wisdom - Instagram Reel',
      description: 'Quick spiritual insights and life lessons in under 60 seconds.',
      platform: 'instagram',
      url: 'https://www.instagram.com/reel/example4',
      thumbnail: '/api/placeholder/400/400',
      likes: '15.2K',
      comments: '2.8K',
      category: 'Daily Inspiration'
    },
    {
      id: 'social-5',
      title: 'Meditation Techniques - Instagram Story',
      description: 'Simple meditation techniques you can practice anywhere, anytime.',
      platform: 'instagram',
      url: 'https://www.instagram.com/stories/example5',
      thumbnail: '/api/placeholder/400/400',
      likes: '8.9K',
      comments: '1.5K',
      category: 'Wellness'
    },
    {
      id: 'social-6',
      title: 'Ancient Wisdom in Modern Life',
      description: 'How to apply ancient Indian wisdom in today\'s fast-paced world.',
      platform: 'youtube',
      url: 'https://www.youtube.com/watch?v=example6',
      thumbnail: '/api/placeholder/400/225',
      views: '203K',
      likes: '18.7K',
      comments: '3.2K',
      duration: '32:15',
      category: 'Life Coaching'
    }
  ]);

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'youtube' ? (
      <Youtube className="h-6 w-6 text-red-500 dark:text-red-400" />
    ) : (
      <Instagram className="h-6 w-6 text-pink-500 dark:text-pink-400" />
    );
  };

  const getPlatformColor = (platform: string) => {
    return platform === 'youtube' ? 'border-red-500/20 text-red-500 dark:border-red-400/40 dark:text-red-400' : 'border-pink-500/20 text-pink-500 dark:border-pink-400/40 dark:text-pink-400';
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
            Social Media
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight dark:text-foreground">
            Connect With Us
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto dark:text-muted-foreground">
            Follow us on YouTube and Instagram for daily wisdom, stories, and spiritual insights
          </p>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-muted/30 p-2 rounded-xl dark:bg-muted/20">
            <Button
              variant="default"
              className="rounded-lg"
            >
              <Youtube className="mr-2 h-5 w-5" />
              YouTube
            </Button>
            <Button
              variant="outline"
              className="rounded-lg dark:border-border dark:hover:bg-accent/50"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Instagram
            </Button>
          </div>
        </div>
      </div>

      {/* Social Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {socialContent.map((content) => (
            <Card key={content.id} className="overflow-hidden shadow-xl border-0 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-card/90 dark:border-border dark:shadow-2xl dark:hover:shadow-3xl">
              <div className="p-6 space-y-4">
                {/* Thumbnail */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 dark:from-primary/30"></div>
                  <div className="relative bg-white p-3 rounded-xl shadow-lg dark:bg-gray-800 dark:shadow-xl">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className={`w-full object-cover rounded-lg shadow-md ${
                        content.platform === 'youtube' ? 'h-48' : 'h-64'
                      }`}
                    />
                    {/* Platform Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant="outline" 
                        className={`${getPlatformColor(content.platform)} bg-background/80 backdrop-blur-sm dark:bg-background/90`}
                      >
                        {getPlatformIcon(content.platform)}
                      </Badge>
                    </div>
                    {/* Play Button for YouTube */}
                    {content.platform === 'youtube' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-red-500/90 hover:bg-red-500 text-white shadow-lg flex items-center justify-center dark:bg-red-500 dark:hover:bg-red-600">
                          <Play className="h-8 w-8 ml-1" />
                        </div>
                      </div>
                    )}
                    {/* Duration for YouTube */}
                    {content.platform === 'youtube' && content.duration && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {content.duration}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2 dark:text-foreground">
                      {content.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 dark:text-muted-foreground">
                      {content.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {content.platform === 'youtube' ? (
                      <>
                        <div className="space-y-1">
                          <Play className="h-4 w-4 text-primary mx-auto dark:text-primary" />
                          <p className="text-xs font-medium dark:text-foreground">{content.views}</p>
                        </div>
                        <div className="space-y-1">
                          <Heart className="h-4 w-4 text-red-500 mx-auto dark:text-red-400" />
                          <p className="text-xs font-medium dark:text-foreground">{content.likes}</p>
                        </div>
                        <div className="space-y-1">
                          <MessageCircle className="h-4 w-4 text-blue-500 mx-auto dark:text-blue-400" />
                          <p className="text-xs font-medium dark:text-foreground">{content.comments}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <Heart className="h-4 w-4 text-red-500 mx-auto dark:text-red-400" />
                          <p className="text-xs font-medium dark:text-foreground">{content.likes}</p>
                        </div>
                        <div className="space-y-1">
                          <MessageCircle className="h-4 w-4 text-blue-500 mx-auto dark:text-blue-400" />
                          <p className="text-xs font-medium dark:text-foreground">{content.comments}</p>
                        </div>
                        <div className="space-y-1">
                          <Share2 className="h-4 w-4 text-green-500 mx-auto dark:text-green-400" />
                          <p className="text-xs font-medium dark:text-foreground">Share</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs dark:bg-secondary dark:text-secondary-foreground">
                      {content.category}
                    </Badge>
                    <Button
                      onClick={() => handleExternalLink(content.url)}
                      variant="outline"
                      size="sm"
                      className="text-xs dark:border-border dark:hover:bg-accent/50"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Card className="p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 dark:from-primary/20 dark:via-primary/10 dark:to-transparent dark:border-primary/30 dark:bg-card/90">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4 dark:text-foreground">
            Stay Connected
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto dark:text-muted-foreground">
            Don't miss out on our latest content! Follow us on social media for daily inspiration, 
            spiritual wisdom, and engaging stories that will enrich your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleExternalLink('https://www.youtube.com/@kapalingitatales')}
              variant="default"
              className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600"
            >
              <Youtube className="mr-2 h-5 w-5" />
              Subscribe on YouTube
            </Button>
            <Button
              onClick={() => handleExternalLink('https://www.instagram.com/kapalingitatales')}
              variant="outline"
              className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-500 dark:hover:text-white"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow on Instagram
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Social; 