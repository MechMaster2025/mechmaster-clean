import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Topic, Article } from '../types';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export function TopicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchTopicData();
    }
  }, [slug]);

  const fetchTopicData = async () => {
    try {
      // Fetch topic
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('slug', slug)
        .single();

      if (topicError) throw topicError;

      // Fetch articles for this topic
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('topic_id', topicData.id)
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      setTopic(topicData);
      setArticles(articlesData || []);
    } catch (error) {
      console.error('Error fetching topic data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Topic not found</h1>
          <Link to="/topics" className="text-red-600 hover:text-red-700">
            ← Back to Topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/topics" className="text-red-600 hover:text-red-700">
            ← Back to Topics
          </Link>
        </nav>

        {/* Topic Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mr-6">
              <BookOpen className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{topic.title}</h1>
              <p className="text-xl text-gray-600">{topic.description}</p>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Articles in {topic.title}</h2>
          
          {articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{article.reading_time} min read</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No articles available yet
              </h3>
              <p className="text-gray-600">
                Articles for {topic.title} will be added soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}