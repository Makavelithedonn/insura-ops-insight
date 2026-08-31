import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Search, Tag } from 'lucide-react';
import { useState } from 'react';
import { blogPosts } from '@/site/data/insurance';

export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  const categories = ['الكل', ...Array.from(new Set(blogPosts.map((p) => p.category)))];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.includes(search) || post.excerpt.includes(search);
    const matchesCategory = activeCategory === 'الكل' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-l from-primary-800 to-primary-950 py-16 md:py-20">
        <div className="container-x text-center">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">المدونة</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            مقالات ونصائح حول التأمين لمساعدتك في اتخاذ أفضل القرارات
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="border-b border-dark-100 bg-white py-6">
        <div className="container-x">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث في المقالات..."
                className="input-field pr-12"
              />
              <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-50 text-dark-600 hover:bg-dark-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="section-padding bg-dark-50">
        <div className="container-x">
          {filteredPosts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-dark-500">لا توجد مقالات مطابقة لبحثك</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-dark-200/60 transition-all hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Tag className="h-16 w-16 text-white/30" />
                    </div>
                    <div className="absolute top-3 right-3 rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-dark-400">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-dark-900 group-hover:text-primary-600">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-dark-500">{post.excerpt}</p>
                    <Link
                      to="/blog"
                      className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-600"
                    >
                      اقرأ المزيد
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
