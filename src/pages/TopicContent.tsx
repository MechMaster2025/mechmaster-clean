import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Topic, BlogContent } from '../types';
import { BookOpen, ArrowLeft, AlertCircle } from 'lucide-react';

export function TopicContent() {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [content, setContent] = useState<BlogContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      if (isSupabaseConfigured()) {
        fetchTopicAndContent();
      } else {
        setError('Supabase not configured');
        setLoading(false);
      }
    }
  }, [slug]);

  const fetchTopicAndContent = async () => {
    try {
      console.log('Fetching topic with slug:', slug);
      
      // Fetch topic with category
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', slug)
        .single();

      if (topicError) {
        console.error('Error fetching topic:', topicError);
        setError(`Topic not found: ${topicError.message}`);
        return;
      }

      console.log('Fetched topic:', topicData);

      // Fetch blog content for this topic
      const { data: contentData, error: contentError } = await supabase
        .from('blog_content')
        .select('*')
        .eq('topic_id', topicData.id)
        .order('id');

      if (contentError) {
        console.error('Error fetching content:', contentError);
        setError(`Error loading content: ${contentError.message}`);
        return;
      }

      console.log('Fetched content:', contentData);

      setTopic(topicData);
      setContent(contentData || []);
    } catch (error) {
      console.error('Error fetching topic and content:', error);
      setError(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Content</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/home" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Topic not found</h1>
          <Link to="/home" className="text-red-600 hover:text-red-700">
            ← Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/home" className="text-red-600 hover:text-red-700">
              Categories
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              to={`/category/${topic.category?.slug}`}
              className="text-red-600 hover:text-red-700"
            >
              {topic.category?.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{topic.title}</span>
          </div>
        </nav>

        {/* Topic Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
              {topic.category?.name}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {topic.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            {topic.short_desc}
          </p>
        </header>

        {/* Content Sections */}
        <div className="prose prose-lg max-w-none">
          {content.length > 0 ? (
            content.map((section, index) => (
              <div key={section.id} className="mb-12">
                {section.section_title && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {section.section_title}
                  </h2>
                )}
                {section.section_body && (
                  <div 
                    className="text-gray-800 leading-relaxed prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.section_body }}
                  />
                )}
                {index < content.length - 1 && (
                  <hr className="my-8 border-gray-200" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No content available
              </h3>
              <p className="text-gray-600">
                No blog content found for {topic.title}.
              </p>
            </div>
          )}
        </div>

        {/* Back to Category */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to={`/category/${topic.category?.slug}`}
            className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {topic.category?.name}
          </Link>
        </div>
      </div>
    </div>
  );
}