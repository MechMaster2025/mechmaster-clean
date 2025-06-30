import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, FileText } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Topic, BlogContent } from '../types';
import { Link } from 'react-router-dom';

interface SearchResult {
  type: 'topic' | 'content';
  id: string;
  title: string;
  description: string;
  slug?: string;
  topic_slug?: string;
}

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!isSupabaseConfigured()) {
      // Demo search results
      const demoResults: SearchResult[] = [
        {
          type: 'topic',
          id: '1',
          title: 'Gate Valves',
          description: 'Complete guide to gate valves, types, and applications',
          slug: 'gate-valves'
        },
        {
          type: 'topic',
          id: '2',
          title: 'Centrifugal Pumps',
          description: 'Working principles and performance of centrifugal pumps',
          slug: 'centrifugal-pumps'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(demoResults);
      setIsOpen(true);
      return;
    }

    setLoading(true);
    try {
      // Search topics
      const { data: topics } = await supabase
        .from('topics')
        .select('id, title, short_desc, slug')
        .or(`title.ilike.%${searchQuery}%,short_desc.ilike.%${searchQuery}%`)
        .limit(5);

      // Search blog content
      const { data: content } = await supabase
        .from('blog_content')
        .select(`
          id, 
          section_title, 
          section_body,
          topic:topics(slug, title)
        `)
        .or(`section_title.ilike.%${searchQuery}%,section_body.ilike.%${searchQuery}%`)
        .limit(5);

      const searchResults: SearchResult[] = [
        ...(topics || []).map(topic => ({
          type: 'topic' as const,
          id: topic.id,
          title: topic.title,
          description: topic.short_desc,
          slug: topic.slug
        })),
        ...(content || []).map(item => ({
          type: 'content' as const,
          id: item.id,
          title: item.section_title || 'Content Section',
          description: item.section_body?.substring(0, 100) + '...' || '',
          topic_slug: item.topic?.slug
        }))
      ];

      setResults(searchResults);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search topics and content..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.type === 'topic' ? `/topic/${result.slug}` : `/topic/${result.topic_slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      {result.type === 'topic' ? (
                        <BookOpen className="w-4 h-4 text-red-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {result.description}
                      </p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {result.type === 'topic' ? 'Topic' : 'Content'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}