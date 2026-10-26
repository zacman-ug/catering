import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { cateringServices, menuPackages } from './cateringPackages.js';

async function seed() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('admin123', 10);

  await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING`,
    ['admin@chefgodwin.ug', passwordHash, 'Chef Godwin Admin', 'admin']
  );

  await pool.query(
    `INSERT INTO site_settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    ['business_info', JSON.stringify({
      name: 'Chef Godwin Foods and Kitchen Uganda',
      shortName: 'Chef Godwin',
      owner: 'Chef Godwin Marvin',
      tagline: 'Professional outside catering & culinary training in Kampala',
      address: 'God With Us Plaza, Kampala, Uganda',
      phones: ['+256754845995', '+256771343592'],
      whatsapp: '+256754845995',
      email: 'info@chefgodwin.ug',
      facebook: 'https://www.facebook.com/CHEFGodwinUganda',
      coordinates: { lat: 0.2972025, lng: 32.5266698 },
      hours: {
        monday: '8:00 AM – 6:00 PM',
        tuesday: '8:00 AM – 6:00 PM',
        wednesday: '8:00 AM – 6:00 PM',
        thursday: '8:00 AM – 6:00 PM',
        friday: '8:00 AM – 6:00 PM',
        saturday: '9:00 AM – 4:00 PM',
        sunday: 'By appointment',
      },
      serviceAreas: ['Kampala', 'Wakiso', 'Mukono', 'Entebbe', 'Surrounding districts by request'],
      minGuestCount: 20,
      leadTimeDays: 7,
      googleReviewsUrl: 'https://www.google.com/maps/search/?api=1&query=Chef+Godwin+Foods+and+Kitchen+Uganda',
      instagram: 'https://www.instagram.com/',
      videoUrl: 'https://www.facebook.com/CHEFGodwinUganda',
      analyticsId: '',
      chefCredentials: [
        'Professional outside catering specialist in Kampala',
        'Experience with large-scale events (350+ guests)',
        'Culinary trainer — Godwin Cooking School',
      ],
      faqs: [
        {
          question: 'How far in advance should I book catering?',
          answer: 'We recommend booking at least 7 days before your event. Large events (200+ guests) should be booked 2–4 weeks ahead.',
        },
        {
          question: 'Do you provide outside catering?',
          answer: 'Yes. We bring our team and mobile kitchen setup to your venue across Kampala and nearby areas.',
        },
        {
          question: 'Can you accommodate dietary requirements?',
          answer: 'Yes. Tell us about allergies, halal, vegetarian, or other needs when you submit your booking inquiry.',
        },
        {
          question: 'What is the minimum guest count?',
          answer: 'Our standard outside catering packages start from 20 guests. Contact us for smaller private chef requests.',
        },
      ],
    })]
  );

  for (const s of cateringServices) {
    await pool.query(
      `INSERT INTO services (title, slug, description, icon, features, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, TRUE)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         icon = EXCLUDED.icon,
         features = EXCLUDED.features,
         sort_order = EXCLUDED.sort_order,
         is_active = TRUE,
         updated_at = NOW()`,
      [s.title, s.slug, s.description, s.icon, JSON.stringify(s.features), s.sort_order]
    );
  }

  const courses = [
    {
      title: 'Foundation Cooking Course',
      slug: 'foundation-cooking',
      description: 'Learn essential knife skills, food safety, and classic Ugandan and continental recipes. Perfect for beginners.',
      duration: '4 weeks',
      level: 'beginner',
      price_ugx: 500000,
      max_students: 15,
    },
    {
      title: 'Professional Catering Course',
      slug: 'professional-catering',
      description: 'Large-scale event cooking, menu costing, presentation, and team management for aspiring caterers.',
      duration: '8 weeks',
      level: 'intermediate',
      price_ugx: 1200000,
      max_students: 12,
    },
    {
      title: 'Weekend Masterclass',
      slug: 'weekend-masterclass',
      description: 'Intensive weekend sessions on specific cuisines — pilau, stews, baking, and more.',
      duration: '2 days',
      level: 'all levels',
      price_ugx: 150000,
      max_students: 20,
    },
  ];

  for (const c of courses) {
    await pool.query(
      `INSERT INTO courses (title, slug, description, duration, level, price_ugx, max_students)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO NOTHING`,
      [c.title, c.slug, c.description, c.duration, c.level, c.price_ugx, c.max_students]
    );
  }

  const testimonials = [
    {
      client_name: 'Sarah N.',
      event_type: 'Wedding',
      content: 'Chef Godwin and his team catered our wedding for 300 guests. The food was exceptional and the service was seamless.',
      rating: 5,
      is_featured: true,
    },
    {
      client_name: 'James M.',
      event_type: 'Corporate Event',
      content: 'Professional, punctual, and delicious. Our company event was a huge success thanks to Chef Godwin.',
      rating: 5,
      is_featured: true,
    },
    {
      client_name: 'Grace A.',
      event_type: 'Introduction',
      content: 'Authentic traditional dishes that impressed both families. Highly recommend for cultural ceremonies.',
      rating: 5,
      is_featured: false,
    },
  ];

  for (const t of testimonials) {
    await pool.query(
      `INSERT INTO testimonials (client_name, event_type, content, rating, is_featured)
       SELECT $1, $2, $3, $4, $5
       WHERE NOT EXISTS (
         SELECT 1 FROM testimonials WHERE client_name = $6 AND content = $7
       )`,
      [t.client_name, t.event_type, t.content, t.rating, t.is_featured, t.client_name, t.content]
    );
  }

  for (const pkg of menuPackages) {
    await pool.query(
      `INSERT INTO menu_packages (event_type, title, slug, description, sample_dishes, price_min_ugx, price_max_ugx, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8, TRUE)
       ON CONFLICT (slug) DO UPDATE SET
         event_type = EXCLUDED.event_type,
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         sample_dishes = EXCLUDED.sample_dishes,
         price_min_ugx = EXCLUDED.price_min_ugx,
         price_max_ugx = EXCLUDED.price_max_ugx,
         sort_order = EXCLUDED.sort_order,
         is_active = TRUE,
         updated_at = NOW()`,
      [pkg.event_type, pkg.title, pkg.slug, pkg.description, JSON.stringify(pkg.sample_dishes), pkg.price_min_ugx, pkg.price_max_ugx, pkg.sort_order]
    );
  }

  await pool.query(
    `INSERT INTO blog_posts (title, slug, excerpt, content, is_published, published_at)
     VALUES ($1,$2,$3,$4,TRUE,NOW())
     ON CONFLICT (slug) DO NOTHING`,
    [
      'The Best Chicken Pilau Recipe',
      'best-chicken-pilau-recipe',
      'Step-by-step pilau from Chef Godwin.',
      'Follow Chef Godwin for full directions and pro tips for fluffy, flavorful pilau at home.',
    ]
  );

  await pool.query(
    `INSERT INTO case_studies (title, slug, event_type, guest_count, location, summary, content, is_featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,TRUE)
     ON CONFLICT (slug) DO NOTHING`,
    [
      '350 Guest Wedding in Kampala',
      '350-guest-wedding-kampala',
      'Wedding',
      350,
      'Kampala',
      'Large-scale outside catering with full mobile kitchen setup.',
      'Chef Godwin and team managed menu execution, on-site cooking, and service for 350 guests.',
    ]
  );

  const checklist = [
    { category: 'Venue', item: 'Secure venue access and event timeline', client_provides: true },
    { category: 'Venue', item: 'Tables and seating arrangement plan', client_provides: true },
    { category: 'Utilities', item: 'Water access point at venue', client_provides: true },
    { category: 'Utilities', item: 'Power source for kitchen equipment', client_provides: true },
    { category: 'Service', item: 'Final guest count 5 days before event', client_provides: true },
  ];

  for (let i = 0; i < checklist.length; i += 1) {
    const item = checklist[i];
    await pool.query(
      `INSERT INTO event_checklist_items (category, item, client_provides, sort_order)
       SELECT $1,$2,$3,$4
       WHERE NOT EXISTS (SELECT 1 FROM event_checklist_items WHERE item = $2)`,
      [item.category, item.item, item.client_provides, i + 1]
    );
  }

  console.log('Seed completed successfully.');
  console.log('Default admin: admin@chefgodwin.ug / admin123');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
