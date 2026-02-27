export const CATEGORIES = {
  documents: { label: 'Documents & Money', emoji: '🪪' },
  clothing:  { label: 'Clothing', emoji: '👕' },
  toiletries:{ label: 'Toiletries & Health', emoji: '🧴' },
  electronics:{ label: 'Electronics', emoji: '🔌' },
  gear:      { label: 'Gear & Equipment', emoji: '🎒' },
  kids:      { label: 'Kids & Baby', emoji: '🧸' },
  activities:{ label: 'Activity Gear', emoji: '🏄' },
  food:      { label: 'Food & Snacks', emoji: '🍎' },
  comfort:   { label: 'Comfort & Entertainment', emoji: '😴' },
  transport: { label: 'Transport Essentials', emoji: '✈️' },
};

// qty helpers — receive (days, travelers) and return a number
const perDay    = (n, min=1) => (d)    => Math.max(min, Math.ceil(d * n));
const flat      = (n)        => ()     => n;
const perPerson = (n)        => (_,t)  => n * t;

// travelModes helpers (travelModes is always an array after generator normalizes it)
const hasMode  = (t, mode)    => t.travelModes?.includes(mode);
const hasAny   = (t, modes)   => t.travelModes?.some(m => modes.includes(m));

export const ALL_ITEMS = [
  // DOCUMENTS
  { id:'d1',  name:'Passport',                            category:'documents', qty:perPerson(1), cond:t=>t.isInternational },
  { id:'d2',  name:'Visa / entry documents',              category:'documents', qty:flat(1),      cond:t=>t.isInternational },
  { id:'d3',  name:'Travel insurance documents',          category:'documents', qty:flat(1),      cond:t=>t.isInternational },
  { id:'d4',  name:"Driver's license / state ID",         category:'documents', qty:perPerson(1), cond:()=>true },
  { id:'d5',  name:'Hotel / Airbnb confirmations',        category:'documents', qty:flat(1),      cond:()=>true },
  { id:'d6',  name:'Flight / train / bus tickets',        category:'documents', qty:flat(1),      cond:()=>true },
  { id:'d7',  name:'Emergency contact list',              category:'documents', qty:flat(1),      cond:()=>true },
  { id:'d8',  name:'Foreign currency / local cash',       category:'documents', qty:flat(1),      cond:t=>t.isInternational },
  { id:'d9',  name:'Travel credit card (no foreign fees)',category:'documents', qty:flat(1),      cond:t=>t.isInternational },
  { id:'d10', name:'Vaccine / health records',            category:'documents', qty:flat(1),      cond:t=>t.isInternational },
  { id:'d11', name:'International driving permit',        category:'documents', qty:flat(1),      cond:t=>t.isInternational && hasAny(t, ['car','rentalCar']) },

  // CLOTHING
  { id:'c1',  name:'T-shirts / tops',              category:'clothing', qty:perDay(1,2),   cond:()=>true },
  { id:'c2',  name:'Underwear',                    category:'clothing', qty:perDay(1,3),   cond:()=>true },
  { id:'c3',  name:'Socks',                        category:'clothing', qty:perDay(1,3),   cond:()=>true },
  { id:'c4',  name:'Pants / jeans',               category:'clothing', qty:perDay(0.4,2), cond:()=>true },
  { id:'c5',  name:'Pajamas',                      category:'clothing', qty:flat(1),       cond:()=>true },
  { id:'c6',  name:'Extra outfit (spill insurance)',category:'clothing', qty:perPerson(1), cond:()=>true },
  { id:'c7',  name:'Light jacket / cardigan',      category:'clothing', qty:flat(1),       cond:t=>['mild','cold','rainy'].includes(t.weather) },
  { id:'c8',  name:'Heavy winter coat',            category:'clothing', qty:perPerson(1),  cond:t=>t.weather==='cold' },
  { id:'c9',  name:'Thermal base layers',          category:'clothing', qty:flat(2),       cond:t=>t.weather==='cold' },
  { id:'c10', name:'Warm hat & gloves',            category:'clothing', qty:perPerson(1),  cond:t=>t.weather==='cold' },
  { id:'c11', name:'Scarf',                        category:'clothing', qty:perPerson(1),  cond:t=>t.weather==='cold' },
  { id:'c12', name:'Rain jacket / poncho',         category:'clothing', qty:perPerson(1),  cond:t=>['rainy','mild'].includes(t.weather) },
  { id:'c13', name:'Swimsuit',                     category:'clothing', qty:flat(2),       cond:t=>t.weather==='hot'||t.activities.some(a=>['beach','swimming','snorkeling'].includes(a))||t.accommodation==='cruise' },
  { id:'c14', name:'Shorts',                       category:'clothing', qty:perDay(0.5,2), cond:t=>t.weather==='hot'||t.activities.includes('beach') },
  { id:'c15', name:'Sun hat / baseball cap',       category:'clothing', qty:flat(1),       cond:t=>t.weather==='hot'||t.activities.some(a=>['beach','hiking','birdwatching'].includes(a)) },
  { id:'c16', name:'Hiking boots',                 category:'clothing', qty:perPerson(1),  cond:t=>t.activities.includes('hiking') },
  { id:'c17', name:'Flip flops / sandals',         category:'clothing', qty:perPerson(1),  cond:t=>t.weather==='hot'||t.activities.includes('beach') },
  { id:'c18', name:'Athletic / running shoes',     category:'clothing', qty:perPerson(1),  cond:t=>t.activities.some(a=>['hiking','sports','running','yoga','cycling'].includes(a)) },
  { id:'c19', name:'Dress shoes / smart casual shoes', category:'clothing', qty:perPerson(1), cond:t=>t.activities.some(a=>['dining','nightlife'].includes(a))||t.accommodation==='cruise' },
  { id:'c20', name:'Formal outfit',               category:'clothing', qty:perPerson(1),  cond:t=>t.activities.includes('dining')||t.accommodation==='cruise' },
  { id:'c21', name:'Ski jacket & pants',           category:'clothing', qty:perPerson(1),  cond:t=>t.activities.includes('skiing') },
  { id:'c22', name:'Wool / moisture-wicking socks',category:'clothing', qty:perDay(1,2),   cond:t=>t.activities.includes('hiking')||t.weather==='cold' },
  { id:'c23', name:'Cycling jersey / padded shorts',category:'clothing', qty:perPerson(1), cond:t=>t.activities.includes('cycling') },
  { id:'c24', name:'Water shoes',                  category:'clothing', qty:perPerson(1),  cond:t=>t.activities.some(a=>['kayaking','snorkeling'].includes(a)) },

  // TOILETRIES
  { id:'t1',  name:'Toothbrush & toothpaste',         category:'toiletries', qty:perPerson(1), cond:()=>true },
  { id:'t2',  name:'Shampoo & conditioner',            category:'toiletries', qty:flat(1),      cond:t=>t.accommodation!=='hotel' },
  { id:'t3',  name:'Body wash / soap',                 category:'toiletries', qty:flat(1),      cond:t=>t.accommodation!=='hotel' },
  { id:'t4',  name:'Deodorant',                        category:'toiletries', qty:perPerson(1), cond:()=>true },
  { id:'t5',  name:'Sunscreen SPF 50+',                category:'toiletries', qty:perPerson(1), cond:t=>t.weather==='hot'||t.activities.some(a=>['beach','hiking','snorkeling'].includes(a)) },
  { id:'t6',  name:'Lip balm with SPF',                category:'toiletries', qty:flat(1),      cond:t=>t.weather==='hot'||t.weather==='cold' },
  { id:'t7',  name:'Moisturizer',                      category:'toiletries', qty:flat(1),      cond:()=>true },
  { id:'t8',  name:'Prescription medications',         category:'toiletries', qty:flat(1),      cond:()=>true },
  { id:'t9',  name:'Pain reliever (ibuprofen / Tylenol)', category:'toiletries', qty:flat(1),   cond:()=>true },
  { id:'t10', name:'Antacid / stomach medicine',       category:'toiletries', qty:flat(1),      cond:()=>true },
  { id:'t11', name:'Antihistamine / allergy meds',     category:'toiletries', qty:flat(1),      cond:()=>true },
  { id:'t12', name:'Motion sickness medication',       category:'toiletries', qty:flat(1),      cond:t=>hasAny(t, ['plane','cruise']) },
  { id:'t13', name:'First aid kit',                    category:'toiletries', qty:flat(1),      cond:t=>t.activities.some(a=>['hiking','camping','rockClimbing'].includes(a))||t.accommodation==='camping' },
  { id:'t14', name:'Insect repellent',                 category:'toiletries', qty:flat(1),      cond:t=>t.activities.some(a=>['hiking','camping','birdwatching','kayaking'].includes(a))||t.weather==='hot' },
  { id:'t15', name:'Hand sanitizer',                   category:'toiletries', qty:flat(1),      cond:()=>true },
  { id:'t16', name:'Diarrhea medication',              category:'toiletries', qty:flat(1),      cond:t=>t.isInternational },
  { id:'t17', name:'Water purification tablets',       category:'toiletries', qty:flat(1),      cond:t=>t.accommodation==='camping' },
  { id:'t18', name:'Blister plasters / moleskin',      category:'toiletries', qty:flat(1),      cond:t=>t.activities.some(a=>['hiking','rockClimbing'].includes(a)) },
  { id:'t19', name:'Thermometer',                      category:'toiletries', qty:flat(1),      cond:t=>t.hasKids },
  { id:'t20', name:'Razor & shaving cream',            category:'toiletries', qty:flat(1),      cond:()=>true },
  { id:'t21', name:'Reef-safe sunscreen',              category:'toiletries', qty:perPerson(1), cond:t=>t.activities.includes('snorkeling') },

  // ELECTRONICS
  { id:'e1',  name:'Phone & charger',                  category:'electronics', qty:perPerson(1), cond:()=>true },
  { id:'e2',  name:'Portable power bank',              category:'electronics', qty:flat(1),      cond:()=>true },
  { id:'e3',  name:'Universal travel adapter',         category:'electronics', qty:flat(1),      cond:t=>t.isInternational },
  { id:'e4',  name:'Laptop & charger',                 category:'electronics', qty:flat(1),      cond:t=>t.days>3||t.activities.includes('work') },
  { id:'e5',  name:'Earbuds / headphones',             category:'electronics', qty:perPerson(1), cond:()=>true },
  { id:'e6',  name:'Noise-canceling headphones',       category:'electronics', qty:flat(1),      cond:t=>hasAny(t, ['plane','train']) },
  { id:'e7',  name:'Camera & memory cards',            category:'electronics', qty:flat(1),      cond:t=>t.activities.some(a=>['photography','sightseeing','birdwatching','wildlife'].includes(a)) },
  { id:'e8',  name:'GoPro / waterproof camera',        category:'electronics', qty:flat(1),      cond:t=>t.activities.some(a=>['beach','swimming','skiing','surfing','snorkeling','kayaking'].includes(a)) },
  { id:'e9',  name:'Multi-outlet power strip',         category:'electronics', qty:flat(1),      cond:t=>t.travelers>2 },
  { id:'e10', name:'VPN subscription (set up before leaving)', category:'electronics', qty:flat(1), cond:t=>t.isInternational },
  { id:'e11', name:'International SIM / eSIM',         category:'electronics', qty:perPerson(1), cond:t=>t.isInternational },

  // GEAR
  { id:'g1',  name:'Luggage locks',                    category:'gear', qty:flat(2),      cond:()=>true },
  { id:'g2',  name:'Packing cubes',                    category:'gear', qty:flat(1),      cond:()=>true },
  { id:'g3',  name:'Laundry bag',                      category:'gear', qty:flat(1),      cond:t=>t.days>5 },
  { id:'g4',  name:'Travel umbrella',                  category:'gear', qty:flat(1),      cond:t=>['rainy','mild'].includes(t.weather) },
  { id:'g5',  name:'Reusable water bottle',            category:'gear', qty:perPerson(1), cond:()=>true },
  { id:'g6',  name:'Day backpack',                     category:'gear', qty:flat(1),      cond:t=>t.activities.some(a=>['hiking','sightseeing','birdwatching'].includes(a)) },
  { id:'g7',  name:'Quick-dry travel towel',           category:'gear', qty:perPerson(1), cond:t=>['camping','hostel'].includes(t.accommodation)||t.activities.some(a=>['beach','kayaking'].includes(a)) },
  { id:'g8',  name:'Sleeping bag',                     category:'gear', qty:perPerson(1), cond:t=>t.accommodation==='camping' },
  { id:'g9',  name:'Tent',                             category:'gear', qty:flat(1),      cond:t=>t.accommodation==='camping' },
  { id:'g10', name:'Camping stove & fuel',             category:'gear', qty:flat(1),      cond:t=>t.accommodation==='camping' },
  { id:'g11', name:'Headlamp & extra batteries',       category:'gear', qty:perPerson(1), cond:t=>t.accommodation==='camping'||t.activities.includes('hiking') },
  { id:'g12', name:'Trekking poles',                   category:'gear', qty:perPerson(1), cond:t=>t.activities.includes('hiking') },
  { id:'g13', name:'Beach bag',                        category:'gear', qty:flat(1),      cond:t=>t.activities.includes('beach') },
  { id:'g14', name:'Dry bag / waterproof pouch',       category:'gear', qty:flat(1),      cond:t=>t.activities.some(a=>['beach','hiking','swimming','kayaking','snorkeling'].includes(a)) },
  { id:'g15', name:'Snorkel & mask',                   category:'gear', qty:perPerson(1), cond:t=>t.activities.includes('swimming')&&t.weather==='hot' },
  { id:'g16', name:'Luggage tags',                     category:'gear', qty:flat(2),      cond:t=>hasMode(t, 'plane') },
  { id:'g17', name:'Portable luggage scale',           category:'gear', qty:flat(1),      cond:t=>hasMode(t, 'plane') },
  { id:'g18', name:'Money belt / anti-theft pouch',    category:'gear', qty:perPerson(1), cond:t=>t.isInternational },
  { id:'g19', name:'Car emergency kit',                category:'gear', qty:flat(1),      cond:t=>hasMode(t, 'car') },
  { id:'g20', name:'Foldable shopping bag',            category:'gear', qty:flat(1),      cond:()=>true },
  { id:'g21', name:'Picnic blanket',                   category:'gear', qty:flat(1),      cond:t=>t.activities.some(a=>['picnic','festivals'].includes(a)) },
  { id:'g22', name:'Binoculars',                       category:'gear', qty:flat(1),      cond:t=>t.activities.some(a=>['hiking','wildlife','birdwatching'].includes(a)) },

  // KIDS
  { id:'k1',  name:'Diapers & wipes',                  category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k2',  name:'Baby formula / food',              category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k3',  name:'Stroller / carrier',               category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k4',  name:"Children's sunscreen",             category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k5',  name:"Children's medications",           category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k6',  name:'Favorite toys / stuffed animals',  category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k7',  name:'Kids tablet / entertainment',      category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k8',  name:'Coloring books / activity pads',   category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k9',  name:'Car seat',                         category:'kids', qty:flat(1), cond:t=>t.hasKids && hasAny(t, ['car','rentalCar']) },
  { id:'k10', name:'Child ID / birth certificate copy',category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k11', name:'Night light / sleep soother',      category:'kids', qty:flat(1), cond:t=>t.hasKids },
  { id:'k12', name:'Swim arm bands / life jacket',     category:'kids', qty:flat(1), cond:t=>t.hasKids&&t.activities.some(a=>['beach','swimming','kayaking'].includes(a)) },

  // ACTIVITY GEAR
  { id:'a1',  name:'Surfboard / surf wax',             category:'activities', qty:flat(1),      cond:t=>t.activities.includes('surfing') },
  { id:'a2',  name:'Wetsuit',                          category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('surfing')||(t.activities.includes('swimming')&&t.weather!=='hot') },
  { id:'a3',  name:'Yoga mat',                         category:'activities', qty:flat(1),      cond:t=>t.activities.includes('yoga') },
  { id:'a4',  name:'Running belt / armband',           category:'activities', qty:flat(1),      cond:t=>t.activities.includes('running') },
  { id:'a5',  name:'Ski poles',                        category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('skiing') },
  { id:'a6',  name:'Ski goggles & helmet',             category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('skiing') },
  { id:'a7',  name:'National park / attraction tickets',category:'activities', qty:flat(1),     cond:t=>t.activities.some(a=>['hiking','sightseeing'].includes(a)) },
  { id:'a8',  name:'Diving certification card',        category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('scuba') },
  { id:'a9',  name:'Festival wristbands / tickets',    category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('festivals') },
  { id:'a10', name:'Fishing license & gear',           category:'activities', qty:flat(1),      cond:t=>t.activities.includes('fishing') },
  // Snorkeling
  { id:'a11', name:'Snorkel, mask & fins',             category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('snorkeling') },
  { id:'a12', name:'Underwater camera housing',        category:'activities', qty:flat(1),      cond:t=>t.activities.includes('snorkeling') },
  // Birdwatching
  { id:'a13', name:'Bird field guide / app',           category:'activities', qty:flat(1),      cond:t=>t.activities.includes('birdwatching') },
  { id:'a14', name:'Birdwatching binoculars',          category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('birdwatching') },
  // Cycling
  { id:'a15', name:'Bicycle helmet',                   category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('cycling') },
  { id:'a16', name:'Bike lock',                        category:'activities', qty:flat(1),      cond:t=>t.activities.includes('cycling') },
  { id:'a17', name:'Cycling repair kit (spare tube, pump)', category:'activities', qty:flat(1), cond:t=>t.activities.includes('cycling') },
  // Kayaking
  { id:'a18', name:'Kayak dry bag',                    category:'activities', qty:flat(1),      cond:t=>t.activities.includes('kayaking') },
  { id:'a19', name:'Paddling gloves',                  category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('kayaking') },
  // Rock Climbing
  { id:'a20', name:'Rock climbing shoes',              category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('rockClimbing') },
  { id:'a21', name:'Chalk bag & chalk',                category:'activities', qty:flat(1),      cond:t=>t.activities.includes('rockClimbing') },
  { id:'a22', name:'Harness & belay device',           category:'activities', qty:perPerson(1), cond:t=>t.activities.includes('rockClimbing') },

  // FOOD
  { id:'f1',  name:'Healthy snacks (nuts, granola bars)',category:'food', qty:flat(1), cond:()=>true },
  { id:'f2',  name:'Electrolyte packets',              category:'food', qty:flat(1), cond:t=>t.activities.some(a=>['hiking','cycling','kayaking','rockClimbing'].includes(a))||t.weather==='hot' },
  { id:'f3',  name:'Protein bars',                     category:'food', qty:flat(1), cond:t=>t.activities.some(a=>['hiking','cycling','rockClimbing'].includes(a)) },
  { id:'f4',  name:'Camping cookware set',             category:'food', qty:flat(1), cond:t=>t.accommodation==='camping' },
  { id:'f5',  name:"Kids' snacks",                     category:'food', qty:flat(1), cond:t=>t.hasKids },
  { id:'f6',  name:'Instant coffee / tea bags',        category:'food', qty:flat(1), cond:t=>t.days>2 },

  // COMFORT
  { id:'co1', name:'Neck pillow',                      category:'comfort', qty:perPerson(1), cond:t=>hasAny(t, ['plane','train'])||t.days>3 },
  { id:'co2', name:'Sleep mask',                       category:'comfort', qty:perPerson(1), cond:t=>hasMode(t, 'plane')||t.days>3 },
  { id:'co3', name:'Earplugs',                         category:'comfort', qty:perPerson(1), cond:t=>hasMode(t, 'plane')||t.accommodation==='hostel' },
  { id:'co4', name:'Books / magazines',                category:'comfort', qty:flat(1),      cond:t=>t.days>2 },
  { id:'co5', name:'Playing cards / travel games',     category:'comfort', qty:flat(1),      cond:t=>t.travelers>1 },
  { id:'co6', name:'Journal & pen',                    category:'comfort', qty:flat(1),      cond:()=>true },
  { id:'co7', name:'Downloaded movies / shows (offline)', category:'comfort', qty:flat(1),   cond:t=>hasAny(t, ['plane','train']) },
  { id:'co8', name:'Offline maps app',                 category:'comfort', qty:flat(1),      cond:t=>t.isInternational },
  { id:'co9', name:'Translation app',                  category:'comfort', qty:flat(1),      cond:t=>t.isInternational },
  { id:'co10',name:'Melatonin / sleep aid',            category:'comfort', qty:flat(1),      cond:t=>t.isInternational||hasMode(t, 'plane') },

  // TRANSPORT
  { id:'tr1', name:'Online check-in (24h before flight)', category:'transport', qty:flat(1), cond:t=>hasMode(t, 'plane') },
  { id:'tr2', name:'Car GPS / phone mount',            category:'transport', qty:flat(1),    cond:t=>hasAny(t, ['car','rentalCar']) },
  { id:'tr3', name:'Transit card / local pass',        category:'transport', qty:perPerson(1), cond:t=>hasAny(t, ['train','bus'])||t.activities.includes('sightseeing') },
  { id:'tr4', name:'Cruise boarding pass & docs',      category:'transport', qty:flat(1),    cond:t=>t.accommodation==='cruise'||hasMode(t, 'cruise') },
  { id:'tr5', name:'Rental car confirmation & insurance docs', category:'transport', qty:flat(1), cond:t=>hasMode(t, 'rentalCar') },
  { id:'tr6', name:'Roadside assistance contact / app',category:'transport', qty:flat(1),    cond:t=>hasAny(t, ['car','rentalCar']) },
];
