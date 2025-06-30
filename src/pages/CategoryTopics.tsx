import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Topic, Category } from '../types';
import { BookOpen, ArrowLeft, AlertCircle } from 'lucide-react';

export function CategoryTopics() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      if (isSupabaseConfigured()) {
        fetchCategoryAndTopics();
      } else {
        setError('Supabase not configured');
        setLoading(false);
      }
    }
  }, [slug]);

  const fetchCategoryAndTopics = async () => {
    try {
      console.log('Fetching category with slug:', slug);
      
      // Fetch category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (categoryError) {
        console.error('Error fetching category:', categoryError);
        setError(`Category not found: ${categoryError.message}`);
        return;
      }

      console.log('Fetched category:', categoryData);

      // Fetch topics for this category
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('title');

      if (topicsError) {
        console.error('Error fetching topics:', topicsError);
        setError(`Error loading topics: ${topicsError.message}`);
        return;
      }

      console.log('Fetched topics:', topicsData);

      setCategory(categoryData);
      setTopics(topicsData || []);
    } catch (error) {
      console.error('Error fetching category and topics:', error);
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
          <p className="text-gray-600">Loading topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Category</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/home" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link to="/home" className="text-red-600 hover:text-red-700">
            ← Back to Categories
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
          <Link to="/home" className="text-red-600 hover:text-red-700 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Link>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
          <p className="text-xl text-gray-600">
            Explore topics related to {category.name.toLowerCase()}
          </p>
        </div>

        {/* Topics List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Topics in {category.name}</h2>
          
          {topics.length > 0 ? (
            <div className="space-y-4">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  to={`/topic/${topic.slug}`}
                  className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {topic.short_desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No topics available
              </h3>
              <p className="text-gray-600">
                No topics found for {category.name}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}