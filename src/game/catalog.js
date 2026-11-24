/**
 * Katalog objek mengikuti contoh materi "Detektif Sampah: Dari Masalah Jadi Berkah".
 * Klasifikasi yang digunakan game adalah klasifikasi latihan untuk pembelajaran;
 * praktik pemilahan nyata tetap mengikuti pedoman pemerintah/pengelola setempat.
 */
export const CATEGORIES = {
  organic: {
    id: 'organic',
    name: 'Organik',
    short: 'ORGANIK',
    color: '#13b981',
    dark: '#08784f',
    light: '#ddf8ec',
    binLabel: 'ORGANIK',
    description: 'Sampah mudah terurai yang berasal dari sisa makhluk hidup.',
    examples: 'Sisa makanan, kulit buah, daun, dan tisu.',
    action: 'Olah menjadi kompos atau eco-enzyme.'
  },
  inorganic: {
    id: 'inorganic',
    name: 'Anorganik',
    short: 'ANORGANIK',
    color: '#f5b51b',
    dark: '#9a6500',
    light: '#fff3c7',
    binLabel: 'ANORGANIK',
    description: 'Bahan yang umumnya lebih sulit terurai dan dapat dipilah untuk guna ulang atau daur ulang.',
    examples: 'Botol plastik, kaleng, bungkus makanan, dan kantong plastik.',
    action: 'Bersihkan, gunakan ulang, atau setorkan ke bank sampah.'
  },
  b3: {
    id: 'b3',
    name: 'Sampah B3',
    short: 'B3',
    color: '#ef5350',
    dark: '#a51e27',
    light: '#ffe3e2',
    binLabel: 'SAMPAH B3',
    description: 'Bahan atau benda yang memiliki karakteristik berbahaya dan perlu penanganan khusus.',
    examples: 'Baterai bekas dan benda yang berpotensi melukai atau terkontaminasi.',
    action: 'Pisahkan dan serahkan ke fasilitas/pengelola yang tepat. Jangan dibakar.'
  }
};

export const WASTE_ITEMS = [
  // Organik
  { id: 'rice', name: 'Sisa nasi', category: 'organic', kind: 'rice', hint: 'Sisa makanan berasal dari bahan hayati dan dapat membusuk.', fact: 'Sisa makanan dapat diolah menjadi kompos.' },
  { id: 'banana', name: 'Kulit pisang', category: 'organic', kind: 'banana', hint: 'Kulit buah berasal dari tumbuhan dan mudah terurai.', fact: 'Kulit pisang dapat masuk bahan kompos.' },
  { id: 'leaf', name: 'Daun kering', category: 'organic', kind: 'leaf', hint: 'Daun merupakan bagian tumbuhan.', fact: 'Daun kering dapat dicacah untuk mempercepat pengomposan.' },
  { id: 'orange', name: 'Kulit jeruk', category: 'organic', kind: 'orange', hint: 'Kulit buah merupakan sisa bahan organik.', fact: 'Kulit buah dapat dimanfaatkan untuk kompos atau eco-enzyme.' },
  { id: 'apple', name: 'Potongan apel', category: 'organic', kind: 'apple', hint: 'Potongan buah berasal dari makhluk hidup.', fact: 'Sisa buah sebaiknya dipisahkan agar tidak tercampur plastik.' },
  { id: 'tissue', name: 'Tisu bekas', category: 'organic', kind: 'tissue', hint: 'Tisu kertas yang tidak terkontaminasi bahan berbahaya dapat terurai.', fact: 'Tisu yang terkena bahan kimia perlu mengikuti petunjuk penanganan setempat.' },
  // Anorganik
  { id: 'bottle', name: 'Botol plastik', category: 'inorganic', kind: 'bottle', hint: 'Kemasan plastik tidak cepat terurai dan dapat dipilah untuk didaur ulang.', fact: 'Kosongkan dan bersihkan botol sebelum disetor ke bank sampah.' },
  { id: 'can', name: 'Kaleng minuman', category: 'inorganic', kind: 'can', hint: 'Kaleng logam dapat dikumpulkan sebagai bahan daur ulang.', fact: 'Kaleng yang bersih memiliki nilai guna sebagai bahan daur ulang.' },
  { id: 'wrapper', name: 'Bungkus makanan', category: 'inorganic', kind: 'wrapper', hint: 'Kemasan makanan berbahan plastik termasuk sampah anorganik dalam latihan ini.', fact: 'Tidak semua kemasan fleksibel diterima semua fasilitas daur ulang.' },
  { id: 'bag', name: 'Kantong plastik', category: 'inorganic', kind: 'bag', hint: 'Kantong plastik merupakan bahan yang sulit terurai secara alami.', fact: 'Kurangi penggunaannya dengan membawa tas belanja guna ulang.' },
  { id: 'cup', name: 'Gelas plastik', category: 'inorganic', kind: 'cup', hint: 'Gelas plastik adalah kemasan berbahan plastik.', fact: 'Pisahkan dari sisa minuman dan cek apakah fasilitas menerima jenis plastik ini.' },
  { id: 'carton', name: 'Kotak minuman', category: 'inorganic', kind: 'carton', hint: 'Kemasan minuman terdiri dari beberapa lapisan bahan dan perlu dipilah.', fact: 'Kosongkan dan pipihkan kemasan sebelum disetor.' },
  // B3 / penanganan khusus berdasarkan contoh pada materi sumber
  { id: 'battery', name: 'Baterai bekas', category: 'b3', kind: 'battery', hint: 'Baterai bekas dapat mengandung bahan yang berbahaya bagi lingkungan.', fact: 'Jangan dibongkar atau dibakar. Serahkan ke titik pengumpulan yang sesuai.' },
  { id: 'glass', name: 'Pecahan kaca', category: 'b3', kind: 'glass', hint: 'Pecahan kaca dapat melukai dan harus ditangani secara khusus.', fact: 'Jangan dipegang langsung. Beri tanda dan minta bantuan orang dewasa/pengelola.' },
  { id: 'mask', name: 'Masker bekas', category: 'b3', kind: 'mask', hint: 'Materi pembelajaran memasukkan masker bekas ke kelompok penanganan khusus.', fact: 'Kondisi dan aturan setempat dapat memengaruhi cara penanganannya.' }
];

export const DEFAULT_DISTRIBUTION = { organic: 40, inorganic: 50, b3: 10 };
