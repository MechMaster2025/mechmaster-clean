import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Topic, Article } from '../types';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch topics
      const { data: topicsData } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch recent articles
      const { data: articlesData } = await supabase
        .from('articles')
        .select('*, topic:topics(*)')
        .order('created_at', { ascending: false })
        .limit(5);

      setTopics(topicsData || []);
      setRecentArticles(articlesData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Continue your mechanical engineering journey with our latest content.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{topics.length}</p>
                <p className="text-gray-600">Topics Available</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{recentArticles.length}</p>
                <p className="text-gray-600">Recent Articles</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">Active</p>
                <p className="text-gray-600">Subscription Status</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Topics Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Explore Topics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topics.slice(0, 4).map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/topics/${topic.slug}`}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <BookOpen className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{topic.title}</h3>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/topics"
                className="block text-center mt-6 text-red-600 hover:text-red-700 font-medium"
              >
                View All Topics →
              </Link>
            </div>
          </div>

          {/* Recent Articles */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Articles</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.slug}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{article.topic?.title}</span>
                      <span className="mx-2">•</span>
                      <span>{article.reading_time} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}