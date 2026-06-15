export interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating: number;
  conditionGrade: string; // e.g., '9/10'
  category: string; // 'Retro Classics', 'Premier League', 'La Liga', 'National Teams', 'Special Editions'
  variants: Variant[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  phone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

// Initial seed data
const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Real Madrid 1998 Retro Home',
    description: 'The historic home kit worn during the memorable 1997-1998 season when Real Madrid clinched their seventh UEFA Champions League trophy, defeating Juventus 1-0 in the final. Manufactured by Kelme and featuring the classic Teka sponsor, this clean white design with purple side highlights is an absolute collector\'s item.',
    price: 45.00,
    originalPrice: 65.00,
    imageUrl: '/images/jerseys/real_madrid_1998.png',
    rating: 4.9,
    conditionGrade: '9.5/10',
    category: 'La Liga',
    variants: [
      { id: 'var-1-s', size: 'S', color: 'White/Purple', stock: 5 },
      { id: 'var-1-m', size: 'M', color: 'White/Purple', stock: 12 },
      { id: 'var-1-l', size: 'L', color: 'White/Purple', stock: 8 },
      { id: 'var-1-xl', size: 'XL', color: 'White/Purple', stock: 3 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Manchester United 2008 Away',
    description: 'The iconic black and red away kit worn during the historic Double-winning season of 2007-2008, when the Red Devils conquered both the Premier League and the UEFA Champions League. Famously worn by Cristiano Ronaldo during his Ballon d\'Or breakout year, featuring the bold AIG logo and Nike styling.',
    price: 45.00,
    originalPrice: 55.00,
    imageUrl: '/images/jerseys/manchester_united_2008.png',
    rating: 4.8,
    conditionGrade: '9/10',
    category: 'Premier League',
    variants: [
      { id: 'var-2-s', size: 'S', color: 'Black/Red', stock: 0 },
      { id: 'var-2-m', size: 'M', color: 'Black/Red', stock: 6 },
      { id: 'var-2-l', size: 'L', color: 'Black/Red', stock: 15 },
      { id: 'var-2-xl', size: 'XL', color: 'Black/Red', stock: 4 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Brazil 2002 National Kit',
    description: 'The legendary yellow and green Nike kit worn by Ronaldinho, Rivaldo, and Ronaldo Nazário as they danced their way to Brazil\'s historic fifth World Cup title in Korea & Japan. Features the iconic CBF crest, Nike Swoosh, and lightweight athletic mesh design of the original 2002 templates.',
    price: 45.00,
    originalPrice: 70.00,
    imageUrl: '/images/jerseys/brazil_2002.png',
    rating: 4.9,
    conditionGrade: '9.8/10',
    category: 'National Teams',
    variants: [
      { id: 'var-3-s', size: 'S', color: 'Yellow/Green', stock: 4 },
      { id: 'var-3-m', size: 'M', color: 'Yellow/Green', stock: 10 },
      { id: 'var-3-l', size: 'L', color: 'Yellow/Green', stock: 6 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Argentina 2022 World Cup Home',
    description: 'The modern classic jersey worn by Lionel Messi during his legendary, career-defining World Cup campaign in Qatar. Featuring the classic light blue and white stripes and Adidas branding, this version holds the three gold stars above the AFA crest following Argentina\'s triumph in the final.',
    price: 45.00,
    imageUrl: '/images/jerseys/argentina_2022.png',
    rating: 5.0,
    conditionGrade: '10/10',
    category: 'National Teams',
    variants: [
      { id: 'var-4-s', size: 'S', color: 'Blue/White', stock: 8 },
      { id: 'var-4-m', size: 'M', color: 'Blue/White', stock: 14 },
      { id: 'var-4-l', size: 'L', color: 'Blue/White', stock: 11 },
      { id: 'var-4-xl', size: 'XL', color: 'Blue/White', stock: 5 }
    ]
  },
  {
    id: 'prod-5',
    name: 'AC Milan 1996 Retro Home',
    description: 'The legendary Lotto home shirt worn by Italian giants like Paolo Maldini, Franco Baresi, and George Weah. Featuring Milan\'s traditional red and black vertical stripes, a classic collar, and the retro Opel sponsor logo, this kit represents the peak of 90s Serie A style.',
    price: 48.00,
    originalPrice: 60.00,
    imageUrl: '/images/jerseys/ac_milan_1996.png',
    rating: 4.7,
    conditionGrade: '8.5/10',
    category: 'Retro Classics',
    variants: [
      { id: 'var-5-m', size: 'M', color: 'Red/Black', stock: 3 },
      { id: 'var-5-l', size: 'L', color: 'Red/Black', stock: 2 }
    ]
  }
];

const STORAGE_KEYS = {
  PRODUCTS: 'usamathrifts_products',
  ORDERS: 'usamathrifts_orders',
};

// Database class to handle localStorage operations
class LocalDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
  }

  // Get all products
  getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  }

  // Get a single product by ID
  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  // Add a new product (Admin feature)
  addProduct(productData: Omit<Product, 'id' | 'variants'>, variantSpecs: { size: string; color: string; stock: number }[]): Product {
    const products = this.getProducts();
    const newId = `prod-${Date.now()}`;
    
    const variants: Variant[] = variantSpecs.map((v, index) => ({
      id: `var-${newId}-${index}`,
      size: v.size,
      color: v.color,
      stock: v.stock
    }));

    const newProduct: Product = {
      ...productData,
      id: newId,
      variants
    };

    products.unshift(newProduct); // Add to beginning of list
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  }

  // Edit stock level of a specific variant
  updateVariantStock(productId: string, variantId: string, newStock: number): boolean {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return false;

    variant.stock = newStock;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  }

  // Get all orders (Admin feature)
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  // Place a Cash on Delivery order
  placeOrder(customerInfo: {
    customerName: string;
    customerEmail: string;
    address: string;
    phone: string;
  }, cartItems: {
    product: Product;
    variant: Variant;
    quantity: number;
  }[]): { success: boolean; error?: string; order?: Order } {
    const products = this.getProducts();
    const orders = this.getOrders();

    // 1. Validate stock levels first
    for (const item of cartItems) {
      const dbProd = products.find(p => p.id === item.product.id);
      if (!dbProd) return { success: false, error: `Product "${item.product.name}" no longer exists.` };

      const dbVar = dbProd.variants.find(v => v.id === item.variant.id);
      if (!dbVar) return { success: false, error: `Variant for "${item.product.name}" is unavailable.` };

      if (dbVar.stock < item.quantity) {
        return { success: false, error: `Insufficient stock for "${item.product.name}" (Size: ${item.variant.size}). Only ${dbVar.stock} left.` };
      }
    }

    // 2. Decrement stock
    for (const item of cartItems) {
      const dbProd = products.find(p => p.id === item.product.id)!;
      const dbVar = dbProd.variants.find(v => v.id === item.variant.id)!;
      dbVar.stock -= item.quantity;
    }

    // 3. Create the order
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      variantId: item.variant.id,
      size: item.variant.size,
      color: item.variant.color,
      quantity: item.quantity,
      price: item.product.price
    }));

    const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...customerInfo,
      items: orderItems,
      totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder); // Newest orders first
    
    // Save updated products and orders back to local storage
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    return { success: true, order: newOrder };
  }

  // Get Store Analytics
  getAnalytics() {
    const products = this.getProducts();
    const orders = this.getOrders();

    const totalSales = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrders = orders.length;

    const lowStockAlerts = products.flatMap(p => 
      p.variants
        .filter(v => v.stock <= 2)
        .map(v => ({
          productName: p.name,
          productId: p.id,
          variantId: v.id,
          size: v.size,
          color: v.color,
          stock: v.stock
        }))
    );

    return {
      totalSales,
      totalOrders,
      totalProductsCount: products.length,
      lowStockAlerts
    };
  }

  // Reset database to seed data
  resetDatabase() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
}

export const db = new LocalDatabase();
