// Run: node supabase/seed-new-products.js
// Adds all new products from the mandi price list

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) env[key.trim()] = val.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const NEW_PRODUCTS = [
  { name: 'Mausami Methi', hindi: 'मेथी', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop' },
  { name: 'Bel Pathar', hindi: 'बेल', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1587049016823-69ef9d68f4b3?w=400&h=400&fit=crop' },
  { name: 'Tarbuj (Watermelon)', hindi: 'तरबूज', unit: 'Per kg', price: 30, image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=400&fit=crop' },
  { name: 'Amrud Net Wala', hindi: 'अमरुद', unit: 'Per kg', price: 120, image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&h=400&fit=crop' },
  { name: 'Kharbuja Meetha', hindi: 'खरबूजा', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&h=400&fit=crop' },
  { name: 'Aam Safeda Meetha', hindi: 'आम सफेदा', unit: 'Per kg', price: 160, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop' },
  { name: 'Chiku Mota Meetha', hindi: 'चीकू', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1611183060658-e03b3616eab6?w=400&h=400&fit=crop' },
  { name: 'Parwal Desi', hindi: 'परवल', unit: 'Per kg', price: 100, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop' },
  { name: 'Kakdi', hindi: 'ककड़ी', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=400&fit=crop' },
  { name: 'Shakarkandi', hindi: 'शकरकंदी', unit: 'Per kg', price: 100, image: 'https://images.unsplash.com/photo-1596097635092-6d8e3e5e3f2a?w=400&h=400&fit=crop' },
  { name: 'Kaccha Aam', hindi: 'कच्चा आम', unit: 'Per kg', price: 120, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop' },
  { name: 'Nariyal Pani Wala', hindi: 'नारियल', unit: 'Per piece', price: 80, image: 'https://images.unsplash.com/photo-1550828284-74f4e07e7308?w=400&h=400&fit=crop' },
  { name: 'Lal Aalu', hindi: 'लाल आलू', unit: '5 kg', price: 70, image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=400&fit=crop' },
  { name: 'Aalu Pahadi', hindi: 'आलू पहाड़ी', unit: '5 kg', price: 120, image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=400&fit=crop' },
  { name: 'Aalu Chips Wala', hindi: 'आलू चिप्स', unit: '5 kg', price: 80, image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=400&fit=crop' },
  { name: 'Tamatar Desi Lal', hindi: 'टमाटर देसी', unit: 'Per kg', price: 40, image: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&h=400&fit=crop' },
  { name: 'Dhaniya Desi', hindi: 'धनिया', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1599909631715-cd9f4d5e8324?w=400&h=400&fit=crop' },
  { name: 'Hari Mirch Tithi', hindi: 'हरी मिर्च', unit: 'Per 250g', price: 30, image: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?w=400&h=400&fit=crop' },
  { name: 'Pudina', hindi: 'पुदीना', unit: 'Per gaddi', price: 10, image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&h=400&fit=crop' },
  { name: 'Gobhi White', hindi: 'गोभी', unit: 'Per kg', price: 70, image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop' },
  { name: 'Gajar Orange', hindi: 'गाजर', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop' },
  { name: 'Gajar Lal Top', hindi: 'गाजर लाल', unit: 'Per kg', price: 50, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop' },
  { name: 'Pyaj Lal Nasik', hindi: 'प्याज नासिक', unit: 'Per kg', price: 30, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop' },
  { name: 'Matar Pencil Meethi', hindi: 'मटर पेंसिल', unit: 'Per kg', price: 100, image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=400&fit=crop' },
  { name: 'Kathal', hindi: 'कटहल', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1598397271942-281702e2b1c3?w=400&h=400&fit=crop' },
  { name: 'Apple Kinnaur', hindi: 'सेब किन्नौर', unit: 'Per kg', price: 180, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop' },
  { name: 'Santra Meetha', hindi: 'संतरा', unit: 'Per kg', price: 120, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop' },
  { name: 'Apple Juicy', hindi: 'सेब जूसी', unit: 'Per kg', price: 220, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop' },
  { name: 'Angur Hara', hindi: 'अंगूर हरा', unit: 'Per kg', price: 140, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop' },
  { name: 'Kiwi Box', hindi: 'कीवी', unit: '4 pcs box', price: 180, image: 'https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=400&h=400&fit=crop' },
  { name: 'Papita Paka', hindi: 'पपीता', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=400&fit=crop' },
  { name: 'Pineapple', hindi: 'अनानास', unit: 'Per kg', price: 70, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop' },
  { name: 'Anar Nasik Lal', hindi: 'अनार नासिक', unit: 'Per kg', price: 180, image: 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=400&h=400&fit=crop' },
  { name: 'Kele Mota', hindi: 'केला मोटा', unit: '12 pcs', price: 70, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop' },
  { name: 'Mushroom Top', hindi: 'मशरूम', unit: 'Per box', price: 40, image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400&h=400&fit=crop' },
  { name: 'Broccoli', hindi: 'ब्रोकली', unit: 'Per kg', price: 100, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop' },
  { name: 'Ghiya Naya', hindi: 'घीया', unit: 'Per kg', price: 50, image: 'https://images.unsplash.com/photo-1583687355032-37b7af5484b6?w=400&h=400&fit=crop' },
  { name: 'Shimla Mirch', hindi: 'शिमला मिर्च', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop' },
  { name: 'Beans', hindi: 'बीन्स', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae10c47?w=400&h=400&fit=crop' },
  { name: 'Muli Patte Wali', hindi: 'मूली', unit: 'Per kg', price: 40, image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&h=400&fit=crop' },
  { name: 'Palak', hindi: 'पालक', unit: 'Per kg', price: 50, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop' },
  { name: 'Tamatar Hybrid Lamba', hindi: 'टमाटर हाइब्रिड', unit: 'Per kg', price: 50, image: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&h=400&fit=crop' },
  { name: 'Chukandar', hindi: 'चुकंदर', unit: 'Per kg', price: 40, image: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&h=400&fit=crop' },
  { name: 'Tori', hindi: 'तोरी', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1583687355032-37b7af5484b6?w=400&h=400&fit=crop' },
  { name: 'Bhindi Chhoti', hindi: 'भिंडी छोटी', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=400&fit=crop' },
  { name: 'Band Gobhi', hindi: 'बंद गोभी', unit: 'Per kg', price: 40, image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=400&fit=crop' },
  { name: 'Tinda', hindi: 'टिंडा', unit: 'Per kg', price: 100, image: 'https://images.unsplash.com/photo-1583687355032-37b7af5484b6?w=400&h=400&fit=crop' },
  { name: 'Baigan Bharta', hindi: 'बैंगन भर्ता', unit: 'Per kg', price: 50, image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=400&h=400&fit=crop' },
  { name: 'Arbi Dehradun', hindi: 'अरबी', unit: 'Per kg', price: 79, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop' },
  { name: 'Adrak', hindi: 'अदरक', unit: 'Per kg', price: 99, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop' },
  { name: 'Nimbu', hindi: 'नींबू', unit: 'Per kg', price: 240, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop' },
  { name: 'Pila Petha', hindi: 'पीला पेठा', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1583687355032-37b7af5484b6?w=400&h=400&fit=crop' },
  { name: 'Lahsun Mota', hindi: 'लहसुन मोटा', unit: 'Per kg', price: 260, image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2571?w=400&h=400&fit=crop' },
  { name: 'Lehsun Desi', hindi: 'लहसुन देसी', unit: 'Per kg', price: 200, image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2571?w=400&h=400&fit=crop' },
  { name: 'Kaccha Papita', hindi: 'कच्चा पपीता', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=400&fit=crop' },
  { name: 'Sahjan', hindi: 'सहजन', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop' },
  { name: 'Sem Fali', hindi: 'सेम फली', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae10c47?w=400&h=400&fit=crop' },
  { name: 'Gawar Fali', hindi: 'ग्वार फली', unit: 'Per kg', price: 100, image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae10c47?w=400&h=400&fit=crop' },
  { name: 'Karela', hindi: 'करेला', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=400&fit=crop' },
  { name: 'Kaccha Kela', hindi: 'कच्चा केला', unit: 'Per kg', price: 50, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop' },
  { name: 'Moti Mirch', hindi: 'मोटी मिर्च', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?w=400&h=400&fit=crop' },
  { name: 'Kundru', hindi: 'कुंदरू', unit: 'Per kg', price: 60, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop' },
  { name: 'Aanwala', hindi: 'आंवला', unit: 'Per kg', price: 150, image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&h=400&fit=crop' },
  { name: 'Sweet Corn', hindi: 'स्वीट कॉर्न', unit: 'Per packet', price: 20, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop' },
  { name: 'Hara Pyaj', hindi: 'हरा प्याज', unit: 'Per kg', price: 80, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop' },
  { name: 'Puja Nariyal', hindi: 'पूजा नारियल', unit: 'Per piece', price: 50, image: 'https://images.unsplash.com/photo-1550828284-74f4e07e7308?w=400&h=400&fit=crop' },
];

async function seed() {
  console.log(`Inserting ${NEW_PRODUCTS.length} new products...`);

  for (const p of NEW_PRODUCTS) {
    const { error } = await supabase.from('products').insert({ ...p, available: true });
    if (error) {
      console.log(`  Skip (may exist): ${p.name} — ${error.message}`);
    } else {
      console.log(`  ✓ ${p.name} — ₹${p.price}`);
    }
  }

  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`\nDone! Total products in database: ${count}`);
}

seed();
