/**
 * Canonical catering services (how we operate) and menu packages (sample menus + UGX ranges).
 * Re-seeded with ON CONFLICT upsert so `npm run db:seed` refreshes copy without duplicates.
 */

export const cateringServices = [
  {
    title: 'Wedding Catering',
    slug: 'wedding-catering',
    description:
      'Full-service wedding catering — from kitchen setup to last plate. Buffet, plated, or mixed service for 50–500+ guests.',
    icon: 'heart',
    features: [
      'Menu tasting & custom wedding menu',
      'Buffet, plated, or mixed service',
      'Dessert table & drink coordination',
      'Dedicated service captain on event day',
    ],
    sort_order: 1,
  },
  {
    title: 'Introduction & Kwanjula',
    slug: 'introduction-catering',
    description:
      'Authentic Ugandan menus for kwanjula, kuhingira, and family introduction ceremonies — large pots, timely service, cultural presentation.',
    icon: 'users',
    features: [
      'Traditional staples (matoke, rice, stews, luombo)',
      'High-volume on-site cooking',
      'Flexible family-style or buffet layout',
      'Experienced cultural event crews',
    ],
    sort_order: 2,
  },
  {
    title: 'Corporate & Conferences',
    slug: 'corporate-events',
    description:
      'Professional catering for board meetings, trainings, conferences, and office celebrations — punctual setup and branded presentation.',
    icon: 'briefcase',
    features: [
      'Breakfast, lunch, or full-day packages',
      'Coffee breaks & snack stations',
      'Dietary options on request',
      'Invoicing for corporate clients',
    ],
    sort_order: 3,
  },
  {
    title: 'Birthday & Graduation',
    slug: 'birthday-graduation',
    description:
      'Celebration menus for birthdays, graduations, baby showers, and milestones — crowd-pleasing dishes and flexible guest counts.',
    icon: 'celebrate',
    features: [
      'Kid-friendly and adult menu options',
      'Cake table coordination (client-supplied cake)',
      'Indoor or garden venue setup',
      'Packages from 30–300+ guests',
    ],
    sort_order: 4,
  },
  {
    title: 'House Parties & Social',
    slug: 'house-party',
    description:
      'Bring the chef to your home or rented venue — relaxed service for friends, reunions, and weekend gatherings.',
    icon: 'home',
    features: [
      'Compact mobile kitchen setup',
      'Grills, stews, and sharing platters',
      'Smaller minimum guest counts on request',
      'Evening and weekend availability',
    ],
    sort_order: 5,
  },
  {
    title: 'Religious & Community',
    slug: 'religious-community',
    description:
      'Respectful catering for duas, church events, fundraisers, and community meals — halal-friendly options and simple service lines.',
    icon: 'community',
    features: [
      'Halal & vegetarian planning',
      'High-throughput buffet lines',
      'Community pricing for large groups',
      'Coordination with event committees',
    ],
    sort_order: 6,
  },
  {
    title: 'Outside Catering — Mobile Kitchen',
    slug: 'outside-catering',
    description:
      'We travel to your venue across Kampala, Wakiso, Mukono, Entebbe, and surrounding districts with a full outside catering operation.',
    icon: 'truck',
    features: [
      'Mobile kitchen & equipment',
      'Power and water planning support',
      'Weather-ready outdoor setup',
      'Any venue with road access',
    ],
    sort_order: 7,
  },
];

/** Per-event sample menus. Prices are total-event ranges (UGX), confirm on call. */
export const menuPackages = [
  {
    event_type: 'Wedding',
    title: 'Wedding Essentials Buffet',
    slug: 'wedding-essentials-buffet',
    description:
      'Popular wedding buffet with traditional and continental choices. Ideal for 80–200 guests. Price scales with guest count and menu upgrades.',
    sample_dishes: [
      'Chicken pilau or beef pilau',
      'Goat or chicken stew',
      'Steamed matoke & rice',
      'Mixed salads & katogo sides',
      'Fresh fruit & simple dessert table',
    ],
    price_min_ugx: 2500000,
    price_max_ugx: 9000000,
    sort_order: 1,
  },
  {
    event_type: 'Wedding',
    title: 'Premium Wedding Plated Service',
    slug: 'wedding-premium-plated',
    description:
      'Elevated plated service, extra courses, and enhanced presentation for formal receptions and large guest lists.',
    sample_dishes: [
      'Welcome bites & soup course',
      'Grilled meats & chef’s signature stew',
      'Premium rice, pasta, or potato accompaniment',
      'Vegetarian & salad course',
      'Full dessert display & coffee service',
    ],
    price_min_ugx: 5000000,
    price_max_ugx: 18000000,
    sort_order: 2,
  },
  {
    event_type: 'Introduction / Kwanjula',
    title: 'Kwanjula Traditional Feast',
    slug: 'kwanjula-traditional-feast',
    description:
      'Classic introduction ceremony menu — hearty Ugandan dishes served buffet-style for both families and guests.',
    sample_dishes: [
      'Luombo (groundnut stew)',
      'Chicken or goat stew',
      'Steamed matoke & sweet potatoes',
      'Rice & local greens',
      'Seasonal fruits',
    ],
    price_min_ugx: 1800000,
    price_max_ugx: 8500000,
    sort_order: 3,
  },
  {
    event_type: 'Introduction / Kwanjula',
    title: 'Kuhingira & Send-off Menu',
    slug: 'kuhingira-send-off-menu',
    description:
      'Focused menu for kuhingira and send-off celebrations — balanced traditional plates with efficient service timing.',
    sample_dishes: [
      'Mixed stew platters',
      'Pilau & rice',
      'Roasted meat option',
      'Vegetable sides & salads',
      'Fruit & refreshments',
    ],
    price_min_ugx: 1500000,
    price_max_ugx: 7000000,
    sort_order: 4,
  },
  {
    event_type: 'Corporate Event',
    title: 'Conference Lunch Package',
    slug: 'corporate-conference-lunch',
    description:
      'Midday corporate menus with quick service windows for meetings, trainings, and full-day conferences.',
    sample_dishes: [
      'Grilled chicken or fish',
      'Vegetable stir-fry & salads',
      'Rice, potatoes, or pasta',
      'Fresh juice & water station',
      'Optional dessert bites',
    ],
    price_min_ugx: 1200000,
    price_max_ugx: 6500000,
    sort_order: 5,
  },
  {
    event_type: 'Corporate Event',
    title: 'Breakfast & Coffee Break',
    slug: 'corporate-breakfast-coffee',
    description:
      'Morning sessions and coffee breaks — pastries, hot breakfast items, and continuous tea/coffee service.',
    sample_dishes: [
      'Pastries & bread basket',
      'Hot breakfast (eggs, sausages, or local options)',
      'Fresh fruit platter',
      'Tea, coffee & snacks for breaks',
    ],
    price_min_ugx: 800000,
    price_max_ugx: 3500000,
    sort_order: 6,
  },
  {
    event_type: 'Birthday',
    title: 'Birthday Celebration Menu',
    slug: 'birthday-celebration-menu',
    description:
      'Fun, flexible birthday catering for home, hall, or garden venues — mix of grills, stews, and finger foods.',
    sample_dishes: [
      'Grilled chicken or meat platters',
      'Pilau or fried rice',
      'Chips, salads & snacks',
      'Stew for sharing',
      'Soft drinks coordination (client may supply)',
    ],
    price_min_ugx: 800000,
    price_max_ugx: 4500000,
    sort_order: 7,
  },
  {
    event_type: 'Graduation',
    title: 'Graduation Party Package',
    slug: 'graduation-party-package',
    description:
      'Celebrate academic milestones with generous buffet menus for family, friends, and classmates.',
    sample_dishes: [
      'Pilau & rice dishes',
      'Chicken & beef options',
      'Vegetable sides & salads',
      'Cake-cutting area setup support',
      'Fruit & dessert options',
    ],
    price_min_ugx: 900000,
    price_max_ugx: 5000000,
    sort_order: 8,
  },
  {
    event_type: 'House Party',
    title: 'House Party & Braai',
    slug: 'house-party-braai',
    description:
      'Relaxed outside catering at your home — braai/grill focus with sharing dishes for evening gatherings.',
    sample_dishes: [
      'Grilled meats & chicken',
      'Roast potatoes or chips',
      'Coleslaw & garden salad',
      'Stew or soup pot',
      'Bread & dipping sauces',
    ],
    price_min_ugx: 600000,
    price_max_ugx: 3200000,
    sort_order: 9,
  },
  {
    event_type: 'Religious / Dua',
    title: 'Religious Gathering Menu',
    slug: 'religious-gathering-menu',
    description:
      'Simple, dignified menus for duas, memorials, and church/community meals — halal-friendly planning available.',
    sample_dishes: [
      'Rice & pilau',
      'Chicken or beef stew',
      'Vegetable & bean dishes',
      'Fruit & water service',
      'Optional dates & light refreshments',
    ],
    price_min_ugx: 700000,
    price_max_ugx: 4000000,
    sort_order: 10,
  },
  {
    event_type: 'Other',
    title: 'Custom Menu — Any Occasion',
    slug: 'custom-menu-any-occasion',
    description:
      'Tell us your event type, culture, and budget — Chef Godwin builds a tailored menu and quote from scratch.',
    sample_dishes: [
      'Chef consultation call',
      'Menu built to your preferences',
      'Buffet or plated service',
      'Scale from intimate to 350+ guests',
      'Confirm final pricing after venue review',
    ],
    price_min_ugx: 600000,
    price_max_ugx: 15000000,
    sort_order: 11,
  },
];
