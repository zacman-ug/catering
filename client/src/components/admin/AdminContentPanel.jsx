import { useCallback, useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import ApiErrorAlert from '../ui/ApiErrorAlert.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const CONTENT_TABLES = [
  { id: 'services', label: 'Services' },
  { id: 'courses', label: 'Courses' },
  { id: 'menu_packages', label: 'Menu packages' },
  { id: 'event_checklist_items', label: 'Event checklist' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'business_faqs', label: 'FAQs (site settings)' },
];

const emptyDraft = () => ({});

function rowLabel(row) {
  if (!row) return 'New item';
  return row.title || row.item || row.question || row.client_name || row.id?.slice(0, 8) || 'Item';
}

export default function AdminContentPanel() {
  const [table, setTable] = useState('services');
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState(emptyDraft());
  const [businessSnapshot, setBusinessSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError('');
    setSelectedId('');
    setDraft(emptyDraft());
    try {
      if (table === 'business_faqs') {
        const res = await api.getBusinessInfo();
        setBusinessSnapshot(res.data || {});
        setRows((res.data?.faqs || []).map((faq, index) => ({ ...faq, id: String(index) })));
      } else {
        const res = await api.listAdminContent(table);
        setRows(res.data || []);
        setBusinessSnapshot(null);
      }
    } catch (err) {
      setError(err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const selectRow = (row) => {
    if (!row) {
      setSelectedId('');
      setDraft(emptyDraft());
      return;
    }
    setSelectedId(row.id);
    setDraft({ ...row });
  };

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (table === 'business_faqs') {
        const faqs = rows.map((row, index) => {
          if (String(row.id) === String(selectedId)) {
            return { question: draft.question || '', answer: draft.answer || '' };
          }
          return { question: row.question, answer: row.answer };
        });
        if (!selectedId && draft.question) {
          faqs.push({ question: draft.question, answer: draft.answer || '' });
        }
        const payload = { ...(businessSnapshot || {}), faqs };
        await api.updateBusinessSettings(payload);
      } else if (table === 'services') {
        const body = {
          title: draft.title,
          slug: draft.slug,
          description: draft.description,
          icon: draft.icon,
          features: typeof draft.features === 'string'
            ? draft.features.split('\n').map((s) => s.trim()).filter(Boolean)
            : draft.features || [],
          sort_order: Number(draft.sort_order) || 0,
          is_active: draft.is_active !== false,
        };
        if (selectedId) await api.saveAdminContent(table, selectedId, body);
        else await api.createAdminContent(table, body);
      } else if (table === 'courses') {
        const body = {
          title: draft.title,
          slug: draft.slug,
          description: draft.description,
          duration: draft.duration,
          level: draft.level,
          price_ugx: draft.price_ugx ? Number(draft.price_ugx) : null,
          max_students: draft.max_students ? Number(draft.max_students) : 20,
          start_date: draft.start_date || null,
          is_active: draft.is_active !== false,
        };
        if (selectedId) await api.saveAdminContent(table, selectedId, body);
        else await api.createAdminContent(table, body);
      } else if (table === 'menu_packages') {
        const body = {
          title: draft.title,
          slug: draft.slug,
          event_type: draft.event_type,
          description: draft.description,
          sample_dishes: typeof draft.sample_dishes === 'string'
            ? draft.sample_dishes.split('\n').map((s) => s.trim()).filter(Boolean)
            : draft.sample_dishes || [],
          price_min_ugx: draft.price_min_ugx ? Number(draft.price_min_ugx) : null,
          price_max_ugx: draft.price_max_ugx ? Number(draft.price_max_ugx) : null,
          sort_order: Number(draft.sort_order) || 0,
          is_active: draft.is_active !== false,
        };
        if (selectedId) await api.saveAdminContent(table, selectedId, body);
        else await api.createAdminContent(table, body);
      } else if (table === 'event_checklist_items') {
        const body = {
          category: draft.category,
          item: draft.item,
          client_provides: draft.client_provides !== false && draft.client_provides !== 'false',
          sort_order: Number(draft.sort_order) || 0,
          is_active: draft.is_active !== false,
        };
        if (selectedId) await api.saveAdminContent(table, selectedId, body);
        else await api.createAdminContent(table, body);
      } else if (table === 'testimonials') {
        const body = {
          client_name: draft.client_name,
          event_type: draft.event_type,
          content: draft.content,
          rating: draft.rating ? Number(draft.rating) : 5,
          is_featured: draft.is_featured === true || draft.is_featured === 'true',
        };
        if (selectedId) await api.saveAdminContent(table, selectedId, body);
        else await api.createAdminContent(table, body);
      }
      await loadRows();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CONTENT_TABLES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTable(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${table === t.id ? 'bg-brand-600 text-white' : 'bg-stone-100'}`}
          >
            {t.label}
          </button>
        ))}
        <button type="button" onClick={() => selectRow(null)} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-stone-300">
          + New
        </button>
      </div>

      <ApiErrorAlert message={error} onRetry={loadRows} />
      {loading ? <LoadingSpinner /> : (
        <div className="grid lg:grid-cols-2 gap-4">
          <ul className="bg-white border border-stone-200 rounded-xl divide-y text-sm max-h-96 overflow-auto">
            {rows.map((row) => (
              <li key={row.id}>
                <button type="button" className="w-full text-left p-3 hover:bg-brand-50" onClick={() => selectRow(row)}>
                  {rowLabel(row)}
                </button>
              </li>
            ))}
            {rows.length === 0 && <li className="p-3 text-stone-500">No rows yet.</li>}
          </ul>

          <form onSubmit={save} className="bg-white border border-stone-200 rounded-xl p-4 space-y-2 text-sm">
            <h3 className="font-bold text-brand-900">{selectedId ? 'Edit' : 'Create'}</h3>
            {table === 'business_faqs' && (
              <>
                <input className="border rounded px-2 py-1 w-full" placeholder="Question" value={draft.question || ''} onChange={(e) => updateField('question', e.target.value)} required />
                <textarea className="border rounded px-2 py-1 w-full" rows={4} placeholder="Answer" value={draft.answer || ''} onChange={(e) => updateField('answer', e.target.value)} required />
              </>
            )}
            {(table === 'services' || table === 'courses' || table === 'menu_packages') && (
              <>
                <input className="border rounded px-2 py-1 w-full" placeholder="Title" value={draft.title || ''} onChange={(e) => updateField('title', e.target.value)} required />
                <input className="border rounded px-2 py-1 w-full" placeholder="Slug (optional)" value={draft.slug || ''} onChange={(e) => updateField('slug', e.target.value)} />
                <textarea className="border rounded px-2 py-1 w-full" rows={3} placeholder="Description" value={draft.description || ''} onChange={(e) => updateField('description', e.target.value)} />
              </>
            )}
            {table === 'services' && (
              <>
                <input className="border rounded px-2 py-1 w-full" placeholder="Icon key" value={draft.icon || ''} onChange={(e) => updateField('icon', e.target.value)} />
                <textarea className="border rounded px-2 py-1 w-full" rows={3} placeholder="Features (one per line)" value={Array.isArray(draft.features) ? draft.features.join('\n') : draft.features || ''} onChange={(e) => updateField('features', e.target.value)} />
              </>
            )}
            {table === 'courses' && (
              <>
                <input className="border rounded px-2 py-1 w-full" placeholder="Duration" value={draft.duration || ''} onChange={(e) => updateField('duration', e.target.value)} />
                <input className="border rounded px-2 py-1 w-full" placeholder="Level" value={draft.level || ''} onChange={(e) => updateField('level', e.target.value)} />
                <input className="border rounded px-2 py-1 w-full" type="number" placeholder="Price UGX" value={draft.price_ugx ?? ''} onChange={(e) => updateField('price_ugx', e.target.value)} />
                <input className="border rounded px-2 py-1 w-full" type="number" placeholder="Max students" value={draft.max_students ?? ''} onChange={(e) => updateField('max_students', e.target.value)} />
                <input className="border rounded px-2 py-1 w-full" type="date" value={draft.start_date ? String(draft.start_date).slice(0, 10) : ''} onChange={(e) => updateField('start_date', e.target.value)} />
              </>
            )}
            {table === 'menu_packages' && (
              <>
                <input className="border rounded px-2 py-1 w-full" placeholder="Event type" value={draft.event_type || ''} onChange={(e) => updateField('event_type', e.target.value)} />
                <textarea className="border rounded px-2 py-1 w-full" rows={3} placeholder="Sample dishes (one per line)" value={Array.isArray(draft.sample_dishes) ? draft.sample_dishes.join('\n') : draft.sample_dishes || ''} onChange={(e) => updateField('sample_dishes', e.target.value)} />
                <input className="border rounded px-2 py-1 w-full" type="number" placeholder="Min price UGX" value={draft.price_min_ugx ?? ''} onChange={(e) => updateField('price_min_ugx', e.target.value)} />
                <input className="border rounded px-2 py-1 w-full" type="number" placeholder="Max price UGX" value={draft.price_max_ugx ?? ''} onChange={(e) => updateField('price_max_ugx', e.target.value)} />
              </>
            )}
            {table === 'event_checklist_items' && (
              <>
                <input className="border rounded px-2 py-1 w-full" placeholder="Category" value={draft.category || ''} onChange={(e) => updateField('category', e.target.value)} required />
                <textarea className="border rounded px-2 py-1 w-full" rows={3} placeholder="Checklist item" value={draft.item || ''} onChange={(e) => updateField('item', e.target.value)} required />
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={draft.client_provides !== false} onChange={(e) => updateField('client_provides', e.target.checked)} />
                  Client provides
                </label>
              </>
            )}
            {table === 'testimonials' && (
              <>
                <input className="border rounded px-2 py-1 w-full" placeholder="Client name" value={draft.client_name || ''} onChange={(e) => updateField('client_name', e.target.value)} required />
                <input className="border rounded px-2 py-1 w-full" placeholder="Event type" value={draft.event_type || ''} onChange={(e) => updateField('event_type', e.target.value)} />
                <textarea className="border rounded px-2 py-1 w-full" rows={3} placeholder="Review text" value={draft.content || ''} onChange={(e) => updateField('content', e.target.value)} required />
                <input className="border rounded px-2 py-1 w-full" type="number" min={1} max={5} placeholder="Rating" value={draft.rating ?? 5} onChange={(e) => updateField('rating', e.target.value)} />
              </>
            )}
            <button type="submit" disabled={saving} className="bg-brand-600 text-white px-4 py-2 rounded-lg disabled:opacity-60">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
