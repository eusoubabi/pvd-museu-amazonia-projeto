import { create } from 'zustand';

// 1. Definição dos Tipos (igual ao que tínhamos)
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Interface da nossa "Store": ESTADO (cartItems) AÇÕES (addToCart, etc.)
interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void; // Ação para limpar o carrinho
}

// 2. Criação da Store create() e função (set) que permite atualizar o estado.
export const useCartStore = create<CartState>((set) => ({
  // Estado inicial
  cartItems: [],

  // Ações
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cartItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Se já existe, aumenta a quantidade
        const updatedItems = state.cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        return { cartItems: updatedItems };
      }
      // Se é novo, adiciona
      return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        // Se a quantidade for 0 ou menos, remove o item
        return { cartItems: state.cartItems.filter((i) => i.id !== id) };
      }
      
      const updatedItems = state.cartItems.map((i) =>
        i.id === id ? { ...i, quantity: quantity } : i
      );
      
      return { cartItems: updatedItems };
    }),
  
  // Implementação da nova ação
  clearCart: () => set({ cartItems: [] }),
}));