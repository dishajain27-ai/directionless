import lipstickImg from '../assets/noir_eclipse_lipstick.png';
import highlighterImg from '../assets/stardust_highlighter.png';
import eyeshadowImg from '../assets/nebula_eyeshadow.png';
import elixirImg from '../assets/lunar_elixir.png';
import brushImg from '../assets/eclipse_brush_set.png';
import mistImg from '../assets/cosmic_setting_mist.png';
import linerImg from '../assets/ink_liner_01.png';
import mascaraImg from '../assets/stellar_lash_mascara.png';

export const products = [
  // LIPS (4 Items)
  {
    id: 'prod_1',
    name: 'Noir Absolue',
    price: 3499,
    description: 'An ultra-matte obsidian lipstick infused with micro-gold pigments. Delivers rich, velvet texture and stellar hydration.',
    category: 'Lips',
    image: lipstickImg,
    rating: 4.9,
  },
  {
    id: 'prod_2',
    name: 'Desi Ghee Balm',
    price: 999,
    description: 'Nourishing clarified butter lip treatment that deeply repairs dry skin and locks in natural, glossy hydration.',
    category: 'Lips',
    image: highlighterImg, // Matches the cosmetic compact jar visual context
    rating: 4.8,
  },
  {
    id: 'prod_3',
    name: 'Bengal Alta',
    price: 899,
    description: 'A traditional liquid red dye formulated for modern lightweight wear, giving lips a rich, vibrant crimson stain.',
    category: 'Lips',
    image: elixirImg, // Matches the red liquid dropper bottle context
    rating: 4.7,
  },
  {
    id: 'prod_4',
    name: 'Rani Pink',
    price: 1999,
    description: 'A bold, saturated royal magenta lipstick with a velvety demi-matte finish celebrating traditional heritage.',
    category: 'Lips',
    image: lipstickImg, // Matches the bullet lipstick tube context
    rating: 4.8,
  },

  // EYES (3 Items)
  {
    id: 'prod_5',
    name: 'Monolith Palette',
    price: 5499,
    description: 'Twelve deep volcanic grays, obsidian blacks, and celestial shimmers for creating raw, structural eye statements.',
    category: 'Eyes',
    image: eyeshadowImg, // Matches the eyeshadow palette context
    rating: 4.9,
  },
  {
    id: 'prod_6',
    name: 'Kajal Supreme',
    price: 2499,
    description: 'An intense herbal kohl eyeliner pencil that smudges smoothly and sets to a waterproof obsidian matte.',
    category: 'Eyes',
    image: linerImg, // Matches the kajal/eyeliner pen context
    rating: 4.8,
  },
  {
    id: 'prod_7',
    name: 'Ink Liner 01',
    price: 1899,
    description: 'Futuristic sleek black eyeliner pen with a sharp felt tip drawing a bold graphic swoop of black liquid eyeliner.',
    category: 'Eyes',
    image: linerImg,
    rating: 4.7,
  },

  // FACE (5 Items)
  {
    id: 'prod_8',
    name: 'Chandan Mist',
    price: 2299,
    description: 'A calming sandalwood facial mist spray that purifies, hydrates, and refreshes skin with a soft woodsy aura.',
    category: 'Face',
    image: mistImg, // Matches the mist spray bottle context
    rating: 4.8,
  },
  {
    id: 'prod_9',
    name: 'Gulab Jal',
    price: 699,
    description: 'Pure steam-distilled rosewater that tones pores, balances skin pH, and leaves a fresh, dew-like finish.',
    category: 'Face',
    image: elixirImg, // Matches the rosewater bottle context
    rating: 4.7,
  },
  {
    id: 'prod_10',
    name: 'Midnight Oil',
    price: 4200,
    description: 'An active nightly repair facial oil infused with botanical extracts that restore radiance and smoothness by morning.',
    category: 'Face',
    image: elixirImg, // Matches the dropper serum bottle context
    rating: 4.9,
  },
  {
    id: 'prod_11',
    name: 'Saffron Silk',
    price: 4999,
    description: 'A luxury facial oil containing raw Kashmiri saffron strands to brighten, firm, and refine skin texture.',
    category: 'Face',
    image: elixirImg, // Matches the saffron oil dropper bottle context
    rating: 4.9,
  },
  {
    id: 'prod_12',
    name: 'Sindoor Dust',
    price: 1499,
    description: 'A fine vermillion cosmetic pigment powder for traditional and contemporary graphic makeup accents.',
    category: 'Face',
    image: highlighterImg, // Matches the cosmetic jar/compact context
    rating: 4.6,
  },

  // TOOLS (2 Items)
  {
    id: 'prod_13',
    name: 'Chrome Polish',
    price: 1499,
    description: 'A liquid metal silver chrome nail lacquer with a mirror-shine finish and longwear chip-resistant durability.',
    category: 'Tools',
    image: elixirImg, // Matches the lacquer polish glass bottle context
    rating: 4.6,
  },
  {
    id: 'prod_14',
    name: 'Eclipse Brush Set',
    price: 9500,
    description: 'Five premium handcrafted makeup brushes with synthetic bristles, gold hardware, and obsidian handles.',
    category: 'Tools',
    image: brushImg, // Matches the makeup brushes context
    rating: 4.9,
  }
];
