/**
 * Sample catalogue + data model (documented with JSDoc so editors give autocomplete in plain JS).
 *
 * In production this would come from a headless CMS (e.g. Builder.io, Contentful, Sanity) and a
 * booking/inventory API. The shapes below are the contract the UI depends on, so swapping the
 * source only means replacing the functions in `src/lib/catalog.js`.
 *
 * "Dream" is a fictional brand created for this portfolio project.
 *
 * @typedef {'dawn' | 'day' | 'dusk' | 'mist'} Theme  illustration palette
 * @typedef {'Europe' | 'Southeast Asia'} Region
 * @typedef {'Wine & Gastronomy' | 'Culture & History' | 'Festive Season' | 'Scenic Landscapes' | 'Spring Blooms'} CruiseTag
 *
 * @typedef {Object} ItineraryDay
 * @property {number} day
 * @property {string} port
 * @property {string} title
 * @property {string} description
 *
 * @typedef {Object} Departure
 * @property {string} date   ISO date, YYYY-MM-DD
 * @property {number} price  per person, double occupancy, USD (Deluxe Stateroom)
 *
 * @typedef {Object} Cruise
 * @property {string} slug
 * @property {string} title
 * @property {string} tagline
 * @property {string} river
 * @property {Region} region
 * @property {string[]} countries
 * @property {number} nights
 * @property {string} embark
 * @property {string} disembark
 * @property {string} ship
 * @property {Theme} theme
 * @property {string} summary
 * @property {string[]} highlights
 * @property {string[]} included
 * @property {CruiseTag[]} tags
 * @property {boolean} [featured]
 * @property {ItineraryDay[]} itinerary
 * @property {Departure[]} departures
 */

/** @returns {Departure} */
const dep = (date, price) => ({ date, price });
const day = (n, port, title, description) => ({
  day: n,
  port,
  title,
  description,
});
const COMMON_INCLUDED = [
  'Wine, beer and soft drinks with lunch and dinner',
  'Guided shore excursion in every port',
  'Complimentary Wi-Fi onboard',
  'Port charges and gratuities for onboard crew',
];
/** @type {Cruise[]} */
export const CRUISES = [
  {
    slug: 'danube-imperial-capitals',
    title: 'Imperial Capitals of the Danube',
    tagline: 'Three grand capitals and the Wachau Valley in one unhurried week.',
    river: 'Danube',
    region: 'Europe',
    countries: ['Hungary', 'Slovakia', 'Austria', 'Germany'],
    nights: 7,
    embark: 'Budapest',
    disembark: 'Passau',
    ship: 'MS Alder Dawn',
    theme: 'dawn',
    featured: true,
    tags: ['Culture & History', 'Scenic Landscapes'],
    summary:
      'Glide from the lit-up Hungarian Parliament to the baroque spires of Passau, with a full day in Vienna and a slow cruise through the terraced vineyards of the Wachau.',
    highlights: [
      'Evening panorama of Budapest from the Danube',
      'Private-hour entry to a Vienna palace',
      'Cruising the UNESCO-listed Wachau Valley',
      'Optional Salzburg day trip from Linz',
    ],
    included: COMMON_INCLUDED,
    itinerary: [
      day(
        1,
        'Budapest',
        'Welcome aboard',
        'Embark in the afternoon, then sail past the floodlit Parliament at dusk.',
      ),
      day(
        2,
        'Budapest',
        'Pearl of the Danube',
        'Guided tour of Buda Castle and Fisherman’s Bastion; free evening in the thermal-bath district.',
      ),
      day(
        3,
        'Bratislava',
        'Old town stroll',
        'Walk the pastel lanes of Slovakia’s riverside capital and taste local pastries.',
      ),
      day(
        4,
        'Vienna',
        'Imperial Vienna',
        'Morning city tour, afternoon at Schönbrunn, concert tickets available in the evening.',
      ),
      day(
        5,
        'Dürnstein',
        'Wachau Valley',
        'Cruise by terraced vineyards and ruined castles; apricot-and-wine tasting in Dürnstein.',
      ),
      day(
        6,
        'Melk',
        'Abbey on the hill',
        'Tour the golden baroque abbey of Melk, then a relaxed afternoon on the sun deck.',
      ),
      day(
        7,
        'Linz',
        'Choose your adventure',
        'Join the optional Salzburg excursion or explore Linz’s modern riverfront.',
      ),
      day(
        8,
        'Passau',
        'Farewell',
        'Disembark after breakfast, or extend your stay in the “City of Three Rivers”.',
      ),
    ],
    departures: [
      dep('2027-04-10', 2899),
      dep('2027-05-08', 3099),
      dep('2027-06-12', 3299),
      dep('2027-09-18', 3199),
      dep('2027-10-02', 2999),
    ],
  },
  {
    slug: 'rhine-castles-and-romance',
    title: 'Rhine Castles & Romance',
    tagline: 'Fairy-tale fortresses, riverside wine towns and Alsatian charm.',
    river: 'Rhine',
    region: 'Europe',
    countries: ['Netherlands', 'Germany', 'France', 'Switzerland'],
    nights: 7,
    embark: 'Amsterdam',
    disembark: 'Basel',
    ship: 'MS Alder Tide',
    theme: 'day',
    featured: true,
    tags: ['Scenic Landscapes', 'Wine & Gastronomy'],
    summary:
      'Sail upstream through the Rhine Gorge, where a castle crowns almost every bend, and finish in the half-timbered heart of Strasbourg before arriving in Basel.',
    highlights: [
      'Dawn sail-through of the Rhine Gorge and the Lorelei rock',
      'Riesling tasting in Rüdesheim',
      'Heidelberg Castle and its old town',
      'Strasbourg’s “Petite France” quarter by canal',
    ],
    included: COMMON_INCLUDED,
    itinerary: [
      day(
        1,
        'Amsterdam',
        'Welcome aboard',
        'Board in the afternoon and enjoy a captain’s welcome reception.',
      ),
      day(
        2,
        'Kinderdijk',
        'Windmills at work',
        'Visit the UNESCO windmills, then cruise toward Germany overnight.',
      ),
      day(
        3,
        'Cologne',
        'Cathedral city',
        'Guided walk to the Gothic cathedral, then a Kölsch tasting in the old town.',
      ),
      day(
        4,
        'Koblenz',
        'Where rivers meet',
        'Ride the cable car to Ehrenbreitstein Fortress; optional Marksburg Castle tour.',
      ),
      day(
        5,
        'Rüdesheim',
        'Rhine Gorge',
        'Sail the most romantic stretch of the Rhine; wine tasting in Drosselgasse.',
      ),
      day(
        6,
        'Mannheim',
        'Heidelberg day',
        'Tour Heidelberg’s ruined castle and wander the Philosophers’ Walk.',
      ),
      day(
        7,
        'Strasbourg',
        'Alsatian afternoon',
        'Canal cruise through Petite France, then flammekueche for dinner.',
      ),
      day(8, 'Basel', 'Farewell', 'Disembark after breakfast in Switzerland’s cultural capital.'),
    ],
    departures: [
      dep('2027-04-24', 3199),
      dep('2027-05-22', 3399),
      dep('2027-07-17', 3599),
      dep('2027-09-11', 3399),
      dep('2027-10-09', 3099),
    ],
  },
  {
    slug: 'seine-impressionist-trail',
    title: 'Seine: The Impressionist Trail',
    tagline: 'Follow Monet from Paris to the Normandy coast and back.',
    river: 'Seine',
    region: 'Europe',
    countries: ['France'],
    nights: 7,
    embark: 'Paris',
    disembark: 'Paris',
    ship: 'MS Alder Reed',
    theme: 'mist',
    featured: true,
    tags: ['Culture & History', 'Wine & Gastronomy'],
    summary:
      'A round trip from Paris with Giverny’s water-lily garden, Rouen’s cathedral and the harbour town of Honfleur — painted, quite literally, on the way.',
    highlights: [
      'Monet’s house and gardens in Giverny',
      'Rouen’s Gothic cathedral and Joan of Arc history',
      'Honfleur harbour and Normandy cider tasting',
      'Evening cruise past illuminated Paris landmarks',
    ],
    included: COMMON_INCLUDED,
    itinerary: [
      day(
        1,
        'Paris',
        'Welcome aboard',
        'Board near the Eiffel Tower and settle in for an evening cruise.',
      ),
      day(
        2,
        'Paris',
        'Montmartre & Louvre',
        'Artists’ hill in the morning; free afternoon for museums or the Marais.',
      ),
      day(3, 'Vernon', 'Giverny', 'Walk through Monet’s garden and the Japanese bridge.'),
      day(
        4,
        'Rouen',
        'City of a hundred spires',
        'Guided tour of the cathedral and half-timbered old town.',
      ),
      day(
        5,
        'Honfleur',
        'Normandy coast',
        'Harbour-side lunch and an optional D-Day beaches excursion.',
      ),
      day(
        6,
        'Caudebec-en-Caux',
        'Abbeys & orchards',
        'Visit the ruins of Jumièges Abbey, then a cider and Calvados tasting.',
      ),
      day(
        7,
        'Les Andelys',
        'Château Gaillard',
        'Climb to Richard the Lionheart’s fortress for sweeping river views.',
      ),
      day(8, 'Paris', 'Farewell', 'Return to Paris and disembark after breakfast.'),
    ],
    departures: [
      dep('2027-05-01', 3499),
      dep('2027-06-05', 3699),
      dep('2027-08-21', 3599),
      dep('2027-09-25', 3499),
    ],
  },
  {
    slug: 'douro-valley-wine-cellars',
    title: 'Douro Valley Wine & Quintas',
    tagline: 'Terraced vineyards, port cellars and long lunches on the water.',
    river: 'Douro',
    region: 'Europe',
    countries: ['Portugal', 'Spain'],
    nights: 7,
    embark: 'Porto',
    disembark: 'Porto',
    ship: 'MS Alder Vine',
    theme: 'dusk',
    tags: ['Wine & Gastronomy', 'Scenic Landscapes'],
    summary:
      'Sail deep into Portugal’s oldest demarcated wine region, with private quinta visits, a day in Spanish Salamanca and sunsets over a thousand terraces.',
    highlights: [
      'Port cellar tasting in Vila Nova de Gaia',
      'Lunch at a family-run quinta in Pinhão',
      'Day trip to Salamanca, Spain',
      'Scenic train ride through the upper Douro (seasonal)',
    ],
    included: COMMON_INCLUDED,
    itinerary: [
      day(
        1,
        'Porto',
        'Welcome aboard',
        'Settle in, then toast the trip with a glass of tawny port.',
      ),
      day(
        2,
        'Régua',
        'Heart of port country',
        'Cruise upriver through locks and vineyards to Peso da Régua.',
      ),
      day(
        3,
        'Pinhão',
        'Quinta lunch',
        'Visit a working estate for a vineyard walk and a long, local lunch.',
      ),
      day(
        4,
        'Barca d’Alva',
        'Salamanca',
        'Cross into Spain for a guided visit of the golden university city.',
      ),
      day(
        5,
        'Pinhão',
        'Slow day',
        'Lazy morning on the sun deck, afternoon olive-oil and wine pairing.',
      ),
      day(6, 'Régua', 'Lamego', 'Climb the baroque staircase of Nossa Senhora dos Remédios.'),
      day(
        7,
        'Entre-os-Rios',
        'Guimarães',
        'Explore the birthplace of Portugal before the farewell dinner.',
      ),
      day(8, 'Porto', 'Farewell', 'Return to Porto and disembark after breakfast.'),
    ],
    departures: [
      dep('2027-03-27', 2699),
      dep('2027-05-15', 2899),
      dep('2027-06-19', 3099),
      dep('2027-09-04', 3099),
      dep('2027-10-16', 2799),
    ],
  },
  {
    slug: 'mekong-heritage-and-delta',
    title: 'Mekong Heritage & Delta Life',
    tagline: 'Angkor’s temples, Phnom Penh’s riverfront and floating markets.',
    river: 'Mekong',
    region: 'Southeast Asia',
    countries: ['Cambodia', 'Vietnam'],
    nights: 8,
    embark: 'Siem Reap',
    disembark: 'Ho Chi Minh City',
    ship: 'MS Alder Lotus',
    theme: 'dawn',
    tags: ['Culture & History', 'Scenic Landscapes'],
    summary:
      'Begin with a sunrise at Angkor Wat, then drift south along the Mekong into the Vietnamese delta, stopping in stilted villages, craft workshops and bustling markets.',
    highlights: [
      'Sunrise at Angkor Wat with a private guide',
      'Phnom Penh’s Royal Palace and riverfront',
      'Sampan ride through delta canals',
      'Cai Be floating market at first light',
    ],
    included: [...COMMON_INCLUDED, 'Visa assistance for Cambodia and Vietnam'],
    itinerary: [
      day(
        1,
        'Siem Reap',
        'Welcome to Cambodia',
        'Arrive, meet your guide and enjoy a welcome dinner with apsara dance.',
      ),
      day(
        2,
        'Siem Reap',
        'Angkor Wat',
        'Sunrise at the temples, then Ta Prohm and the Bayon in the golden afternoon.',
      ),
      day(
        3,
        'Kampong Cham',
        'Village life',
        'Join the ship and cycle through rural villages along the river.',
      ),
      day(4, 'Phnom Penh', 'Royal capital', 'Visit the Silver Pagoda and the riverside promenade.'),
      day(
        5,
        'Koh Chen',
        'Craft island',
        'Meet silversmiths and tour a local school supported by the cruise line.',
      ),
      day(
        6,
        'Tan Chau',
        'Into Vietnam',
        'Cross the border by river and explore silk-weaving villages.',
      ),
      day(
        7,
        'Sa Dec',
        'Flower town',
        'Walk the flower nurseries and the former house of a famed local writer.',
      ),
      day(
        8,
        'Cai Be',
        'Floating market',
        'Dawn market visit, then a cruise along quiet canals by sampan.',
      ),
      day(
        9,
        'Ho Chi Minh City',
        'Farewell',
        'Disembark after breakfast; optional city tour before your flight.',
      ),
    ],
    departures: [
      dep('2027-01-16', 3899),
      dep('2027-02-13', 4099),
      dep('2027-03-13', 3999),
      dep('2027-10-30', 3799),
      dep('2027-11-27', 3899),
    ],
  },
  {
    slug: 'rhone-provence-lavender',
    title: 'Provence & the Rhône in Bloom',
    tagline: 'Lavender hills, Van Gogh’s Arles and a glass of Châteauneuf.',
    river: 'Rhône',
    region: 'Europe',
    countries: ['France'],
    nights: 7,
    embark: 'Lyon',
    disembark: 'Arles',
    ship: 'MS Alder Lavender',
    theme: 'day',
    tags: ['Wine & Gastronomy', 'Scenic Landscapes'],
    summary:
      'Float from gastronomic Lyon to sun-washed Arles with time for markets, Roman ruins and the purple fields of the Luberon in high summer.',
    highlights: [
      'Market breakfast in Lyon’s Les Halles',
      'Châteauneuf-du-Pape tasting',
      'Lavender fields and hilltop villages of the Luberon',
      'Van Gogh’s Arles on foot',
    ],
    included: COMMON_INCLUDED,
    itinerary: [
      day(1, 'Lyon', 'Welcome aboard', 'Embark in the capital of French gastronomy.'),
      day(2, 'Lyon', 'Beaujolais', 'Wine-country excursion with a long lunch in a village bistro.'),
      day(
        3,
        'Tournon-sur-Rhône',
        'Hermitage hill',
        'Ride the vintage steam train and taste Rhône Syrah.',
      ),
      day(4, 'Viviers', 'Medieval lanes', 'Wander one of France’s best-preserved medieval towns.'),
      day(5, 'Avignon', 'Palace of the Popes', 'Tour the papal palace and the famous bridge.'),
      day(
        6,
        'Avignon',
        'Luberon lavender',
        'Full-day excursion to Gordes and Roussillon with lavender-field stops.',
      ),
      day(7, 'Arles', 'Van Gogh’s light', 'Walk the Roman arena and the painter’s cafés.'),
      day(8, 'Arles', 'Camargue & farewell', 'Optional Camargue morning before disembarking.'),
    ],
    departures: [
      dep('2027-06-26', 3299),
      dep('2027-07-10', 3399),
      dep('2027-07-24', 3399),
      dep('2027-09-04', 3099),
    ],
  },
  {
    slug: 'danube-christmas-markets',
    title: 'Danube Christmas Markets',
    tagline: 'Mulled wine, candlelight and seven cities dressed for the season.',
    river: 'Danube',
    region: 'Europe',
    countries: ['Germany', 'Austria', 'Slovakia', 'Hungary'],
    nights: 7,
    embark: 'Nuremberg',
    disembark: 'Budapest',
    ship: 'MS Alder Frost',
    theme: 'dusk',
    featured: false,
    tags: ['Festive Season', 'Culture & History'],
    summary:
      'Hop between storybook markets from Nuremberg’s famed Christkindlesmarkt to Vienna’s palace squares, returning each evening to a warm, lantern-lit ship.',
    highlights: [
      'Nuremberg Christkindlesmarkt with a local guide',
      'Gingerbread and mulled-wine tasting in Regensburg',
      'Advent concert in Vienna',
      'Market lights along Budapest’s Danube promenade',
    ],
    included: [...COMMON_INCLUDED, 'Hot-chocolate station on the sun deck'],
    itinerary: [
      day(
        1,
        'Nuremberg',
        'Welcome aboard',
        'Embark and enjoy a first stroll through the Christkindlesmarkt.',
      ),
      day(2, 'Regensburg', 'Medieval market', 'Tour the Old Town and taste Bavarian gingerbread.'),
      day(
        3,
        'Passau',
        'City of three rivers',
        'Visit St. Stephen’s Cathedral and its enormous organ.',
      ),
      day(4, 'Linz', 'Salzburg Advent', 'Optional excursion to Salzburg’s Christmas markets.'),
      day(5, 'Melk', 'Abbey & wine', 'Tour the abbey and sample Wachau wines in the evening.'),
      day(
        6,
        'Vienna',
        'Advent in Vienna',
        'City tour, palace markets and an evening classical concert.',
      ),
      day(
        7,
        'Bratislava',
        'Old-town lights',
        'Explore the market in the shadow of Bratislava Castle.',
      ),
      day(8, 'Budapest', 'Farewell', 'Disembark after a final Danube sunrise.'),
    ],
    departures: [
      dep('2027-11-25', 2499),
      dep('2027-12-02', 2699),
      dep('2027-12-09', 2699),
      dep('2027-12-16', 2599),
    ],
  },
  {
    slug: 'holland-belgium-tulip-time',
    title: 'Tulip Time in Holland & Belgium',
    tagline: 'Keukenhof in bloom, Flemish cities and canals in spring light.',
    river: 'Rhine',
    region: 'Europe',
    countries: ['Netherlands', 'Belgium'],
    nights: 8,
    embark: 'Amsterdam',
    disembark: 'Amsterdam',
    ship: 'MS Alder Tide',
    theme: 'mist',
    tags: ['Spring Blooms', 'Culture & History'],
    summary:
      'A spring-only voyage timed to peak tulip season, pairing Keukenhof’s seven million bulbs with Antwerp’s fashion quarter and the canals of Bruges.',
    highlights: [
      'Keukenhof Gardens at peak bloom',
      'Hoorn and the Zuiderzee seafaring towns',
      'Antwerp diamond district and Rubens’ house',
      'Ghent and Bruges in a single, easy day',
    ],
    included: COMMON_INCLUDED,
    itinerary: [
      day(
        1,
        'Amsterdam',
        'Welcome aboard',
        'Board in the afternoon, then a canal-side welcome dinner.',
      ),
      day(2, 'Amsterdam', 'Keukenhof', 'Spend the morning among millions of tulips and hyacinths.'),
      day(3, 'Hoorn', 'Golden Age harbour', 'Walk the old trading port and taste Dutch cheese.'),
      day(
        4,
        'Arnhem',
        'Art & forest',
        'Visit the Kröller-Müller Museum in Hoge Veluwe National Park.',
      ),
      day(5, 'Rotterdam', 'Modern Netherlands', 'Cube houses, the Markthal and a harbour cruise.'),
      day(
        6,
        'Antwerp',
        'Flemish masters',
        'Tour the cathedral and Rubens’ house, then enjoy Belgian chocolate.',
      ),
      day(7, 'Ghent', 'Medieval Ghent & Bruges', 'Two UNESCO-listed cities in one day.'),
      day(8, 'Middelburg', 'Zeeland coast', 'Explore the island capital and its Saturday market.'),
      day(9, 'Amsterdam', 'Farewell', 'Return to Amsterdam and disembark after breakfast.'),
    ],
    departures: [
      dep('2027-03-27', 3199),
      dep('2027-04-03', 3499),
      dep('2027-04-10', 3699),
      dep('2027-04-17', 3699),
    ],
  },
];
