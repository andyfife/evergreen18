export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      _AvailableDrinks: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_AvailableDrinks_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Drink';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_AvailableDrinks_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
        ];
      };
      _BrandToEstablishment: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_BrandToEstablishment_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Brand';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_BrandToEstablishment_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'EstablishmentBrand';
            referencedColumns: ['id'];
          },
        ];
      };
      _ColorToTShirt: {
        Row: {
          A: number;
          B: number;
        };
        Insert: {
          A: number;
          B: number;
        };
        Update: {
          A?: number;
          B?: number;
        };
        Relationships: [
          {
            foreignKeyName: '_ColorToTShirt_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Color';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_ColorToTShirt_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'TShirt';
            referencedColumns: ['id'];
          },
        ];
      };
      _EmployeeEstablishment: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_EmployeeEstablishment_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Employee';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_EmployeeEstablishment_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
        ];
      };
      _EstablishmentToBrand: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_EstablishmentToBrand_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_EstablishmentToBrand_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'EstablishmentBrand';
            referencedColumns: ['id'];
          },
        ];
      };
      _FavoriteDrinks: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_FavoriteDrinks_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Drink';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_FavoriteDrinks_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      _IngredientToProduct: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_IngredientToProduct_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Ingredient';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_IngredientToProduct_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
        ];
      };
      _LocationToMediaAsset: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_LocationToMediaAsset_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Location';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_LocationToMediaAsset_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'MediaAsset';
            referencedColumns: ['id'];
          },
        ];
      };
      _ProductToMenuType: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_ProductToMenuType_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'MenuType';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_ProductToMenuType_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
        ];
      };
      _SizeToTShirt: {
        Row: {
          A: number;
          B: number;
        };
        Insert: {
          A: number;
          B: number;
        };
        Update: {
          A?: number;
          B?: number;
        };
        Relationships: [
          {
            foreignKeyName: '_SizeToTShirt_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Size';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_SizeToTShirt_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'TShirt';
            referencedColumns: ['id'];
          },
        ];
      };
      _TokenToTransaction: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_TokenToTransaction_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Token';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: '_TokenToTransaction_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'Transaction';
            referencedColumns: ['id'];
          },
        ];
      };
      Account: {
        Row: {
          access_token: string | null;
          expires_at: number | null;
          id: string;
          id_token: string | null;
          provider: string;
          providerAccountId: string;
          refresh_token: string | null;
          scope: string | null;
          session_state: string | null;
          token_type: string | null;
          type: string;
          user_id: string;
        };
        Insert: {
          access_token?: string | null;
          expires_at?: number | null;
          id: string;
          id_token?: string | null;
          provider: string;
          providerAccountId: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type: string;
          user_id: string;
        };
        Update: {
          access_token?: string | null;
          expires_at?: number | null;
          id?: string;
          id_token?: string | null;
          provider?: string;
          providerAccountId?: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Account_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      AttributeOption: {
        Row: {
          attributeTypeId: number;
          id: number;
          label: string;
          value: string;
        };
        Insert: {
          attributeTypeId: number;
          id?: number;
          label: string;
          value: string;
        };
        Update: {
          attributeTypeId?: number;
          id?: number;
          label?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'AttributeOption_attributeTypeId_fkey';
            columns: ['attributeTypeId'];
            isOneToOne: false;
            referencedRelation: 'AttributeType';
            referencedColumns: ['id'];
          },
        ];
      };
      AttributeType: {
        Row: {
          displayName: string;
          id: number;
          name: string;
          sexRestriction: string | null;
        };
        Insert: {
          displayName: string;
          id?: number;
          name: string;
          sexRestriction?: string | null;
        };
        Update: {
          displayName?: string;
          id?: number;
          name?: string;
          sexRestriction?: string | null;
        };
        Relationships: [];
      };
      Avatar: {
        Row: {
          avatarImage_url: string;
          createdAt: string;
          id: string;
          updatedAt: string;
          user_id: string;
        };
        Insert: {
          avatarImage_url: string;
          createdAt?: string;
          id: string;
          updatedAt: string;
          user_id: string;
        };
        Update: {
          avatarImage_url?: string;
          createdAt?: string;
          id?: string;
          updatedAt?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Avatar_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      AvatarItem: {
        Row: {
          avatarId: string;
          avatarProductId: string;
          id: string;
          isEquipped: boolean;
        };
        Insert: {
          avatarId: string;
          avatarProductId: string;
          id: string;
          isEquipped?: boolean;
        };
        Update: {
          avatarId?: string;
          avatarProductId?: string;
          id?: string;
          isEquipped?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'AvatarItem_avatarId_fkey';
            columns: ['avatarId'];
            isOneToOne: false;
            referencedRelation: 'Avatar';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'AvatarItem_avatarProductId_fkey';
            columns: ['avatarProductId'];
            isOneToOne: false;
            referencedRelation: 'AvatarProduct';
            referencedColumns: ['id'];
          },
        ];
      };
      AvatarProduct: {
        Row: {
          category: string;
          id: string;
          imageUrl: string;
          name: string;
          price: number;
        };
        Insert: {
          category: string;
          id: string;
          imageUrl: string;
          name: string;
          price: number;
        };
        Update: {
          category?: string;
          id?: string;
          imageUrl?: string;
          name?: string;
          price?: number;
        };
        Relationships: [];
      };
      Brand: {
        Row: {
          createdAt: string;
          defaultPrice: number | null;
          description: string | null;
          drinkType: Database['public']['Enums']['DrinkType'] | null;
          id: string;
          ingredient: Database['public']['Enums']['IngredientType'] | null;
          name: string;
          origin: Database['public']['Enums']['Origin'] | null;
          shelf: Database['public']['Enums']['Shelf'] | null;
        };
        Insert: {
          createdAt?: string;
          defaultPrice?: number | null;
          description?: string | null;
          drinkType?: Database['public']['Enums']['DrinkType'] | null;
          id: string;
          ingredient?: Database['public']['Enums']['IngredientType'] | null;
          name: string;
          origin?: Database['public']['Enums']['Origin'] | null;
          shelf?: Database['public']['Enums']['Shelf'] | null;
        };
        Update: {
          createdAt?: string;
          defaultPrice?: number | null;
          description?: string | null;
          drinkType?: Database['public']['Enums']['DrinkType'] | null;
          id?: string;
          ingredient?: Database['public']['Enums']['IngredientType'] | null;
          name?: string;
          origin?: Database['public']['Enums']['Origin'] | null;
          shelf?: Database['public']['Enums']['Shelf'] | null;
        };
        Relationships: [];
      };
      CartItem: {
        Row: {
          createdAt: string;
          currency: string | null;
          id: string;
          menuItemId: string;
          productId: string;
          quantity: number;
          updatedAt: string;
          user_id: string;
        };
        Insert: {
          createdAt?: string;
          currency?: string | null;
          id: string;
          menuItemId: string;
          productId: string;
          quantity: number;
          updatedAt: string;
          user_id: string;
        };
        Update: {
          createdAt?: string;
          currency?: string | null;
          id?: string;
          menuItemId?: string;
          productId?: string;
          quantity?: number;
          updatedAt?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'CartItem_menuItemId_fkey';
            columns: ['menuItemId'];
            isOneToOne: false;
            referencedRelation: 'MenuItem';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'CartItem_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'CartItem_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Color: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      Date: {
        Row: {
          id: number;
          updatedAt: string | null;
        };
        Insert: {
          id?: number;
          updatedAt?: string | null;
        };
        Update: {
          id?: number;
          updatedAt?: string | null;
        };
        Relationships: [];
      };
      Drink: {
        Row: {
          description: string | null;
          id: string;
          image: string | null;
          name: string;
          price: number;
          priceTyp: number;
        };
        Insert: {
          description?: string | null;
          id: string;
          image?: string | null;
          name: string;
          price?: number;
          priceTyp?: number;
        };
        Update: {
          description?: string | null;
          id?: string;
          image?: string | null;
          name?: string;
          price?: number;
          priceTyp?: number;
        };
        Relationships: [];
      };
      Employee: {
        Row: {
          id: string;
          user_id: string;
        };
        Insert: {
          id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Employee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Establishment: {
        Row: {
          address: string | null;
          city: string | null;
          country: string | null;
          defaultMenuId: string | null;
          email: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          name: string | null;
          state: string | null;
          telephone: string | null;
          typeBar: string;
          typeId: string;
          user_id: string;
          zipcode: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          defaultMenuId?: string | null;
          email?: string | null;
          id: string;
          latitude?: number | null;
          longitude?: number | null;
          name?: string | null;
          state?: string | null;
          telephone?: string | null;
          typeBar?: string;
          typeId: string;
          user_id: string;
          zipcode?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          defaultMenuId?: string | null;
          email?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          name?: string | null;
          state?: string | null;
          telephone?: string | null;
          typeBar?: string;
          typeId?: string;
          user_id?: string;
          zipcode?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Establishment_typeId_fkey';
            columns: ['typeId'];
            isOneToOne: false;
            referencedRelation: 'EstablishmentType';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Establishment_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      EstablishmentBrand: {
        Row: {
          brandId: string;
          establishmentId: string;
          id: string;
          ingredient: Database['public']['Enums']['IngredientType'] | null;
          isCustom: boolean;
          isSelected: boolean;
          name: string;
        };
        Insert: {
          brandId: string;
          establishmentId: string;
          id: string;
          ingredient?: Database['public']['Enums']['IngredientType'] | null;
          isCustom?: boolean;
          isSelected?: boolean;
          name: string;
        };
        Update: {
          brandId?: string;
          establishmentId?: string;
          id?: string;
          ingredient?: Database['public']['Enums']['IngredientType'] | null;
          isCustom?: boolean;
          isSelected?: boolean;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'EstablishmentBrand_brandId_fkey';
            columns: ['brandId'];
            isOneToOne: false;
            referencedRelation: 'Brand';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'EstablishmentBrand_establishmentId_fkey';
            columns: ['establishmentId'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
        ];
      };
      EstablishmentProduct: {
        Row: {
          establishmentId: string;
          establishmentTypeId: string;
          id: string;
          isSelected: boolean;
          productId: string;
        };
        Insert: {
          establishmentId: string;
          establishmentTypeId: string;
          id: string;
          isSelected?: boolean;
          productId: string;
        };
        Update: {
          establishmentId?: string;
          establishmentTypeId?: string;
          id?: string;
          isSelected?: boolean;
          productId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'EstablishmentProduct_establishmentId_fkey';
            columns: ['establishmentId'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'EstablishmentProduct_establishmentTypeId_fkey';
            columns: ['establishmentTypeId'];
            isOneToOne: false;
            referencedRelation: 'EstablishmentType';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'EstablishmentProduct_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
        ];
      };
      EstablishmentType: {
        Row: {
          id: string;
          menuExist: boolean;
          name: Database['public']['Enums']['EstablishmentTypeName'];
        };
        Insert: {
          id: string;
          menuExist: boolean;
          name: Database['public']['Enums']['EstablishmentTypeName'];
        };
        Update: {
          id?: string;
          menuExist?: boolean;
          name?: Database['public']['Enums']['EstablishmentTypeName'];
        };
        Relationships: [];
      };
      ExistingEstablishmentMenu: {
        Row: {
          city: string;
          createdAt: string;
          id: string;
          latitude: number | null;
          longitude: number | null;
          menuItems: Json;
          name: string;
          updatedAt: string;
        };
        Insert: {
          city: string;
          createdAt?: string;
          id: string;
          latitude?: number | null;
          longitude?: number | null;
          menuItems: Json;
          name: string;
          updatedAt: string;
        };
        Update: {
          city?: string;
          createdAt?: string;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          menuItems?: Json;
          name?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      Ingredient: {
        Row: {
          category: Database['public']['Enums']['Category'];
          id: string;
          name: string;
        };
        Insert: {
          category: Database['public']['Enums']['Category'];
          id: string;
          name: string;
        };
        Update: {
          category?: Database['public']['Enums']['Category'];
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      Inventory: {
        Row: {
          establishmentId: string;
          id: string;
          inventoryTypeId: string;
          productId: string;
          quantity: number;
        };
        Insert: {
          establishmentId: string;
          id: string;
          inventoryTypeId: string;
          productId: string;
          quantity?: number;
        };
        Update: {
          establishmentId?: string;
          id?: string;
          inventoryTypeId?: string;
          productId?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'Inventory_establishmentId_fkey';
            columns: ['establishmentId'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Inventory_inventoryTypeId_fkey';
            columns: ['inventoryTypeId'];
            isOneToOne: false;
            referencedRelation: 'InventoryType';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Inventory_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
        ];
      };
      InventoryType: {
        Row: {
          establishmentTypeId: string;
          id: string;
          name: string;
        };
        Insert: {
          establishmentTypeId: string;
          id: string;
          name: string;
        };
        Update: {
          establishmentTypeId?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'InventoryType_establishmentTypeId_fkey';
            columns: ['establishmentTypeId'];
            isOneToOne: false;
            referencedRelation: 'EstablishmentType';
            referencedColumns: ['id'];
          },
        ];
      };
      Location: {
        Row: {
          address: string | null;
          city: string | null;
          country: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          name: string | null;
          state: string | null;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          id: string;
          latitude?: number | null;
          longitude?: number | null;
          name?: string | null;
          state?: string | null;
          user_id: string;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          name?: string | null;
          state?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Location_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      MediaAsset: {
        Row: {
          establishmentId: string | null;
          id: string;
          isPrimaryImage: boolean | null;
          name: string | null;
          productId: string | null;
          type: Database['public']['Enums']['MediaAssetType'] | null;
          url: string;
          user_id: string | null;
        };
        Insert: {
          establishmentId?: string | null;
          id: string;
          isPrimaryImage?: boolean | null;
          name?: string | null;
          productId?: string | null;
          type?: Database['public']['Enums']['MediaAssetType'] | null;
          url: string;
          user_id?: string | null;
        };
        Update: {
          establishmentId?: string | null;
          id?: string;
          isPrimaryImage?: boolean | null;
          name?: string | null;
          productId?: string | null;
          type?: Database['public']['Enums']['MediaAssetType'] | null;
          url?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'MediaAsset_establishmentId_fkey';
            columns: ['establishmentId'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'MediaAsset_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'MediaAsset_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Menu: {
        Row: {
          establishmentId: string;
          id: string;
          menuTypeId: string | null;
          name: string;
        };
        Insert: {
          establishmentId: string;
          id: string;
          menuTypeId?: string | null;
          name: string;
        };
        Update: {
          establishmentId?: string;
          id?: string;
          menuTypeId?: string | null;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Menu_establishmentId_fkey';
            columns: ['establishmentId'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Menu_menuTypeId_fkey';
            columns: ['menuTypeId'];
            isOneToOne: false;
            referencedRelation: 'MenuType';
            referencedColumns: ['id'];
          },
        ];
      };
      MenuItem: {
        Row: {
          brandName: string | null;
          category: Database['public']['Enums']['Category'] | null;
          currency: string;
          description: string | null;
          drinkType: Database['public']['Enums']['DrinkType'] | null;
          foodType: Database['public']['Enums']['FoodType'] | null;
          id: string;
          image: string | null;
          ingredient: Database['public']['Enums']['IngredientType'] | null;
          isSelected: boolean;
          menuId: string;
          menuSectionId: string | null;
          name: string;
          order: number | null;
          origin: Database['public']['Enums']['Origin'] | null;
          price: number | null;
          productBrandId: string | null;
          shelf: Database['public']['Enums']['Shelf'] | null;
        };
        Insert: {
          brandName?: string | null;
          category?: Database['public']['Enums']['Category'] | null;
          currency?: string;
          description?: string | null;
          drinkType?: Database['public']['Enums']['DrinkType'] | null;
          foodType?: Database['public']['Enums']['FoodType'] | null;
          id: string;
          image?: string | null;
          ingredient?: Database['public']['Enums']['IngredientType'] | null;
          isSelected?: boolean;
          menuId: string;
          menuSectionId?: string | null;
          name: string;
          order?: number | null;
          origin?: Database['public']['Enums']['Origin'] | null;
          price?: number | null;
          productBrandId?: string | null;
          shelf?: Database['public']['Enums']['Shelf'] | null;
        };
        Update: {
          brandName?: string | null;
          category?: Database['public']['Enums']['Category'] | null;
          currency?: string;
          description?: string | null;
          drinkType?: Database['public']['Enums']['DrinkType'] | null;
          foodType?: Database['public']['Enums']['FoodType'] | null;
          id?: string;
          image?: string | null;
          ingredient?: Database['public']['Enums']['IngredientType'] | null;
          isSelected?: boolean;
          menuId?: string;
          menuSectionId?: string | null;
          name?: string;
          order?: number | null;
          origin?: Database['public']['Enums']['Origin'] | null;
          price?: number | null;
          productBrandId?: string | null;
          shelf?: Database['public']['Enums']['Shelf'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'MenuItem_menuId_fkey';
            columns: ['menuId'];
            isOneToOne: false;
            referencedRelation: 'Menu';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'MenuItem_menuSectionId_fkey';
            columns: ['menuSectionId'];
            isOneToOne: false;
            referencedRelation: 'MenuSection';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'MenuItem_productBrandId_fkey';
            columns: ['productBrandId'];
            isOneToOne: false;
            referencedRelation: 'ProductBrand';
            referencedColumns: ['id'];
          },
        ];
      };
      MenuSection: {
        Row: {
          id: string;
          menuId: string;
          name: string;
        };
        Insert: {
          id: string;
          menuId: string;
          name: string;
        };
        Update: {
          id?: string;
          menuId?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'MenuSection_menuId_fkey';
            columns: ['menuId'];
            isOneToOne: false;
            referencedRelation: 'Menu';
            referencedColumns: ['id'];
          },
        ];
      };
      MenuType: {
        Row: {
          createdAt: string;
          establishmentTypeId: string;
          id: string;
          name: Database['public']['Enums']['EstablishmentTypeName'];
        };
        Insert: {
          createdAt?: string;
          establishmentTypeId: string;
          id: string;
          name: Database['public']['Enums']['EstablishmentTypeName'];
        };
        Update: {
          createdAt?: string;
          establishmentTypeId?: string;
          id?: string;
          name?: Database['public']['Enums']['EstablishmentTypeName'];
        };
        Relationships: [
          {
            foreignKeyName: 'MenuType_establishmentTypeId_fkey';
            columns: ['establishmentTypeId'];
            isOneToOne: false;
            referencedRelation: 'EstablishmentType';
            referencedColumns: ['id'];
          },
        ];
      };
      Message: {
        Row: {
          content: string;
          createdAt: string;
          establishmentId: string | null;
          fulfilled: boolean;
          id: string;
          messageDeleted: boolean;
          messageRead: boolean;
          recipientId: string;
          senderId: string;
        };
        Insert: {
          content: string;
          createdAt?: string;
          establishmentId?: string | null;
          fulfilled?: boolean;
          id: string;
          messageDeleted?: boolean;
          messageRead?: boolean;
          recipientId: string;
          senderId: string;
        };
        Update: {
          content?: string;
          createdAt?: string;
          establishmentId?: string | null;
          fulfilled?: boolean;
          id?: string;
          messageDeleted?: boolean;
          messageRead?: boolean;
          recipientId?: string;
          senderId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Message_establishmentId_fkey';
            columns: ['establishmentId'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Message_recipientId_fkey';
            columns: ['recipientId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Message_senderId_fkey';
            columns: ['senderId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Order: {
        Row: {
          createdAt: string;
          id: string;
          status: Database['public']['Enums']['OrderStatus'];
          tokensSent: boolean;
          updatedAt: string;
          user_id: string | null;
        };
        Insert: {
          createdAt?: string;
          id: string;
          status?: Database['public']['Enums']['OrderStatus'];
          tokensSent?: boolean;
          updatedAt: string;
          user_id?: string | null;
        };
        Update: {
          createdAt?: string;
          id?: string;
          status?: Database['public']['Enums']['OrderStatus'];
          tokensSent?: boolean;
          updatedAt?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Order_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      OrderItem: {
        Row: {
          createdAt: string;
          id: string;
          menuItemId: string | null;
          orderId: string | null;
          quantity: number | null;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          menuItemId?: string | null;
          orderId?: string | null;
          quantity?: number | null;
          updatedAt: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          menuItemId?: string | null;
          orderId?: string | null;
          quantity?: number | null;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'OrderItem_menuItemId_fkey';
            columns: ['menuItemId'];
            isOneToOne: false;
            referencedRelation: 'CartItem';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'OrderItem_orderId_fkey';
            columns: ['orderId'];
            isOneToOne: false;
            referencedRelation: 'Order';
            referencedColumns: ['id'];
          },
        ];
      };
      PasswordResetToken: {
        Row: {
          createdAt: string;
          expiresAt: string;
          id: string;
          token: string;
          user_id: string;
        };
        Insert: {
          createdAt?: string;
          expiresAt: string;
          id: string;
          token: string;
          user_id: string;
        };
        Update: {
          createdAt?: string;
          expiresAt?: string;
          id?: string;
          token?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'PasswordResetToken_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Price: {
        Row: {
          createdAt: string;
          currency: string | null;
          drinkType: Database['public']['Enums']['DrinkType'] | null;
          establishmentId: string;
          id: string;
          ingredientType: Database['public']['Enums']['IngredientType'] | null;
          label: string;
          origin: Database['public']['Enums']['Origin'] | null;
          price: number;
          shelf: Database['public']['Enums']['Shelf'] | null;
        };
        Insert: {
          createdAt?: string;
          currency?: string | null;
          drinkType?: Database['public']['Enums']['DrinkType'] | null;
          establishmentId: string;
          id: string;
          ingredientType?: Database['public']['Enums']['IngredientType'] | null;
          label: string;
          origin?: Database['public']['Enums']['Origin'] | null;
          price: number;
          shelf?: Database['public']['Enums']['Shelf'] | null;
        };
        Update: {
          createdAt?: string;
          currency?: string | null;
          drinkType?: Database['public']['Enums']['DrinkType'] | null;
          establishmentId?: string;
          id?: string;
          ingredientType?: Database['public']['Enums']['IngredientType'] | null;
          label?: string;
          origin?: Database['public']['Enums']['Origin'] | null;
          price?: number;
          shelf?: Database['public']['Enums']['Shelf'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Price_establishmentId_fkey';
            columns: ['establishmentId'];
            isOneToOne: false;
            referencedRelation: 'Establishment';
            referencedColumns: ['id'];
          },
        ];
      };
      Product: {
        Row: {
          beerCategory: Database['public']['Enums']['BeerCategory'] | null;
          category: Database['public']['Enums']['Category'] | null;
          countInStock: number | null;
          createdAt: string;
          currency: string;
          description: string;
          drinkId: string | null;
          drinkType: Database['public']['Enums']['DrinkType'] | null;
          foodType: Database['public']['Enums']['FoodType'] | null;
          id: string;
          ingredient: Database['public']['Enums']['IngredientType'] | null;
          name: string;
          price: number;
          priceTyp: number;
          productId: string;
          updatedAt: string;
        };
        Insert: {
          beerCategory?: Database['public']['Enums']['BeerCategory'] | null;
          category?: Database['public']['Enums']['Category'] | null;
          countInStock?: number | null;
          createdAt?: string;
          currency?: string;
          description: string;
          drinkId?: string | null;
          drinkType?: Database['public']['Enums']['DrinkType'] | null;
          foodType?: Database['public']['Enums']['FoodType'] | null;
          id: string;
          ingredient?: Database['public']['Enums']['IngredientType'] | null;
          name: string;
          price?: number;
          priceTyp?: number;
          productId: string;
          updatedAt: string;
        };
        Update: {
          beerCategory?: Database['public']['Enums']['BeerCategory'] | null;
          category?: Database['public']['Enums']['Category'] | null;
          countInStock?: number | null;
          createdAt?: string;
          currency?: string;
          description?: string;
          drinkId?: string | null;
          drinkType?: Database['public']['Enums']['DrinkType'] | null;
          foodType?: Database['public']['Enums']['FoodType'] | null;
          id?: string;
          ingredient?: Database['public']['Enums']['IngredientType'] | null;
          name?: string;
          price?: number;
          priceTyp?: number;
          productId?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Product_drinkId_fkey';
            columns: ['drinkId'];
            isOneToOne: false;
            referencedRelation: 'Drink';
            referencedColumns: ['id'];
          },
        ];
      };
      ProductBrand: {
        Row: {
          brandId: string;
          brandName: string;
          createdAt: string;
          currency: string;
          id: string;
          image: string | null;
          menuTypeId: string | null;
          productId: string;
          productName: string;
          shelf: Database['public']['Enums']['Shelf'] | null;
        };
        Insert: {
          brandId: string;
          brandName: string;
          createdAt?: string;
          currency?: string;
          id: string;
          image?: string | null;
          menuTypeId?: string | null;
          productId: string;
          productName: string;
          shelf?: Database['public']['Enums']['Shelf'] | null;
        };
        Update: {
          brandId?: string;
          brandName?: string;
          createdAt?: string;
          currency?: string;
          id?: string;
          image?: string | null;
          menuTypeId?: string | null;
          productId?: string;
          productName?: string;
          shelf?: Database['public']['Enums']['Shelf'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ProductBrand_brandId_fkey';
            columns: ['brandId'];
            isOneToOne: false;
            referencedRelation: 'Brand';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductBrand_menuTypeId_fkey';
            columns: ['menuTypeId'];
            isOneToOne: false;
            referencedRelation: 'MenuType';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ProductBrand_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'Product';
            referencedColumns: ['id'];
          },
        ];
      };
      Prompt: {
        Row: {
          category: string;
          createdAt: string;
          id: string;
          name: string;
          promptText: string;
          updatedAt: string;
        };
        Insert: {
          category: string;
          createdAt?: string;
          id: string;
          name: string;
          promptText: string;
          updatedAt: string;
        };
        Update: {
          category?: string;
          createdAt?: string;
          id?: string;
          name?: string;
          promptText?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      QualityModifier: {
        Row: {
          id: string;
          isDefault: boolean;
          modifiers: string | null;
          name: string;
          negatives: string | null;
        };
        Insert: {
          id: string;
          isDefault?: boolean;
          modifiers?: string | null;
          name: string;
          negatives?: string | null;
        };
        Update: {
          id?: string;
          isDefault?: boolean;
          modifiers?: string | null;
          name?: string;
          negatives?: string | null;
        };
        Relationships: [];
      };
      Session: {
        Row: {
          expires: string;
          id: string;
          sessionToken: string;
          status: string | null;
          user_id: string;
        };
        Insert: {
          expires: string;
          id: string;
          sessionToken: string;
          status?: string | null;
          user_id: string;
        };
        Update: {
          expires?: string;
          id?: string;
          sessionToken?: string;
          status?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Session_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Size: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      Task: {
        Row: {
          createdAt: string;
          errorMessage: string | null;
          id: string;
          payload: Json;
          status: Database['public']['Enums']['TaskStatus'];
          type: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          errorMessage?: string | null;
          id: string;
          payload: Json;
          status?: Database['public']['Enums']['TaskStatus'];
          type: string;
          updatedAt: string;
        };
        Update: {
          createdAt?: string;
          errorMessage?: string | null;
          id?: string;
          payload?: Json;
          status?: Database['public']['Enums']['TaskStatus'];
          type?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      Todo: {
        Row: {
          content: string | null;
          id: number;
        };
        Insert: {
          content?: string | null;
          id?: number;
        };
        Update: {
          content?: string | null;
          id?: number;
        };
        Relationships: [];
      };
      Token: {
        Row: {
          address: string;
          amount: number | null;
          coinGeckoId: string | null;
          createdAt: string;
          decimals: number;
          description: string | null;
          iconPath: string;
          id: string;
          isVisible: boolean;
          name: string;
          price: string | null;
          symbol: string;
          updatedAt: string;
          user_id: string | null;
        };
        Insert: {
          address: string;
          amount?: number | null;
          coinGeckoId?: string | null;
          createdAt?: string;
          decimals: number;
          description?: string | null;
          iconPath: string;
          id: string;
          isVisible?: boolean;
          name: string;
          price?: string | null;
          symbol: string;
          updatedAt: string;
          user_id?: string | null;
        };
        Update: {
          address?: string;
          amount?: number | null;
          coinGeckoId?: string | null;
          createdAt?: string;
          decimals?: number;
          description?: string | null;
          iconPath?: string;
          id?: string;
          isVisible?: boolean;
          name?: string;
          price?: string | null;
          symbol?: string;
          updatedAt?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Token_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      TokenDefinition: {
        Row: {
          coinGeckoId: string | null;
          createdAt: string;
          decimals: number;
          description: string | null;
          iconPath: string | null;
          id: string;
          mintAddress: string;
          name: string;
          symbol: Database['public']['Enums']['TokenSymbol'];
          updatedAt: string;
        };
        Insert: {
          coinGeckoId?: string | null;
          createdAt?: string;
          decimals: number;
          description?: string | null;
          iconPath?: string | null;
          id: string;
          mintAddress: string;
          name: string;
          symbol: Database['public']['Enums']['TokenSymbol'];
          updatedAt: string;
        };
        Update: {
          coinGeckoId?: string | null;
          createdAt?: string;
          decimals?: number;
          description?: string | null;
          iconPath?: string | null;
          id?: string;
          mintAddress?: string;
          name?: string;
          symbol?: Database['public']['Enums']['TokenSymbol'];
          updatedAt?: string;
        };
        Relationships: [];
      };
      TokenPrice: {
        Row: {
          createdAt: string;
          id: string;
          price: number;
          timestamp: string;
          tokenId: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          price: number;
          timestamp?: string;
          tokenId: string;
          updatedAt: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          price?: number;
          timestamp?: string;
          tokenId?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'TokenPrice_tokenId_fkey';
            columns: ['tokenId'];
            isOneToOne: false;
            referencedRelation: 'TokenDefinition';
            referencedColumns: ['id'];
          },
        ];
      };
      Transaction: {
        Row: {
          createdAt: string;
          errorMessage: string | null;
          establishmentAmount: number | null;
          establishmentWalletAddress: string | null;
          id: string;
          signature: string | null;
          status: Database['public']['Enums']['TransactionStatus'];
          tenderWalletAddress: string | null;
          tipAmount: number | null;
          tokenId: string | null;
          updatedAt: string | null;
          user_id: string;
        };
        Insert: {
          createdAt?: string;
          errorMessage?: string | null;
          establishmentAmount?: number | null;
          establishmentWalletAddress?: string | null;
          id: string;
          signature?: string | null;
          status: Database['public']['Enums']['TransactionStatus'];
          tenderWalletAddress?: string | null;
          tipAmount?: number | null;
          tokenId?: string | null;
          updatedAt?: string | null;
          user_id: string;
        };
        Update: {
          createdAt?: string;
          errorMessage?: string | null;
          establishmentAmount?: number | null;
          establishmentWalletAddress?: string | null;
          id?: string;
          signature?: string | null;
          status?: Database['public']['Enums']['TransactionStatus'];
          tenderWalletAddress?: string | null;
          tipAmount?: number | null;
          tokenId?: string | null;
          updatedAt?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Transaction_tokenId_fkey';
            columns: ['tokenId'];
            isOneToOne: false;
            referencedRelation: 'UserTokenAccount';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Transaction_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      TransactionFee: {
        Row: {
          feeInLamports: number;
          id: string;
          updatedAt: string;
        };
        Insert: {
          feeInLamports: number;
          id: string;
          updatedAt: string;
        };
        Update: {
          feeInLamports?: number;
          id?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      TShirt: {
        Row: {
          createdAt: string;
          id: number;
          imageUrl: string;
          name: string;
          price: number;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          id?: number;
          imageUrl: string;
          name: string;
          price: number;
          updatedAt: string;
        };
        Update: {
          createdAt?: string;
          id?: number;
          imageUrl?: string;
          name?: string;
          price?: number;
          updatedAt?: string;
        };
        Relationships: [];
      };
      User: {
        Row: {
          avatarBalance: number;
          banned: boolean | null;
          createdAt: string;
          currentAvatarId: string | null;
          currentFullAddress: string | null;
          currentLat: number | null;
          currentLng: number | null;
          email_address: string | null;
          employer: string | null;
          encryptedMnemonic: string | null;
          first_name: string | null;
          hashedPassword: string | null;
          hasWallet: boolean;
          id: string;
          image_url: string | null;
          isActive: boolean;
          isEstablishment: boolean;
          isRead: number | null;
          isTender: boolean;
          last_name: string | null;
          last_sign_in_at: string | null;
          name: string | null;
          object: string | null;
          password_enabled: boolean | null;
          primary_email_address_id: string | null;
          primary_phone_number_id: string | null;
          primaryWeb3WalletId: string | null;
          profile_image_url: string | null;
          protectedAreaPasswordHash: string | null;
          qrCodeUrl: string | null;
          role: Database['public']['Enums']['UserRole'];
          status: string | null;
          two_factor_enabled: boolean | null;
          unreadMessageCount: number | null;
          updatedAt: string | null;

          user_id: string | null;
          username: string | null;
          walletName: string | null;
        };
        Insert: {
          avatarBalance?: number;
          banned?: boolean | null;
          createdAt?: string;
          currentAvatarId?: string | null;
          currentFullAddress?: string | null;
          currentLat?: number | null;
          currentLng?: number | null;
          email_address?: string | null;
          employer?: string | null;
          encryptedMnemonic?: string | null;
          first_name?: string | null;
          hashedPassword?: string | null;
          hasWallet?: boolean;
          id: string;
          image_url?: string | null;
          isActive?: boolean;
          isEstablishment?: boolean;
          isRead?: number | null;
          isTender?: boolean;
          last_name?: string | null;
          last_sign_in_at?: string | null;
          name?: string | null;
          object?: string | null;
          password_enabled?: boolean | null;
          primary_email_address_id?: string | null;
          primary_phone_number_id?: string | null;
          primaryWeb3WalletId?: string | null;
          profile_image_url?: string | null;
          protectedAreaPasswordHash?: string | null;
          qrCodeUrl?: string | null;
          role?: Database['public']['Enums']['UserRole'];
          status?: string | null;
          two_factor_enabled?: boolean | null;
          unreadMessageCount?: number | null;
          updatedAt?: string | null;

          user_id?: string | null;
          username?: string | null;
          walletName?: string | null;
        };
        Update: {
          avatarBalance?: number;
          banned?: boolean | null;
          createdAt?: string;
          currentAvatarId?: string | null;
          currentFullAddress?: string | null;
          currentLat?: number | null;
          currentLng?: number | null;
          email_address?: string | null;
          employer?: string | null;
          encryptedMnemonic?: string | null;
          first_name?: string | null;
          hashedPassword?: string | null;
          hasWallet?: boolean;
          id?: string;
          image_url?: string | null;
          isActive?: boolean;
          isEstablishment?: boolean;
          isRead?: number | null;
          isTender?: boolean;
          last_name?: string | null;
          last_sign_in_at?: string | null;
          name?: string | null;
          object?: string | null;
          password_enabled?: boolean | null;
          primary_email_address_id?: string | null;
          primary_phone_number_id?: string | null;
          primaryWeb3WalletId?: string | null;
          profile_image_url?: string | null;
          protectedAreaPasswordHash?: string | null;
          qrCodeUrl?: string | null;
          role?: Database['public']['Enums']['UserRole'];
          status?: string | null;
          two_factor_enabled?: boolean | null;
          unreadMessageCount?: number | null;
          updatedAt?: string | null;

          user_id?: string | null;
          username?: string | null;
          walletName?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'User_currentAvatarId_fkey';
            columns: ['currentAvatarId'];
            isOneToOne: false;
            referencedRelation: 'Avatar';
            referencedColumns: ['id'];
          },
        ];
      };
      UserTokenAccount: {
        Row: {
          address: string;
          amount: number;
          createdAt: string;
          id: string;
          isVisible: boolean;
          tokenId: string;
          updatedAt: string;
          user_id: string;
        };
        Insert: {
          address: string;
          amount?: number;
          createdAt?: string;
          id: string;
          isVisible?: boolean;
          tokenId: string;
          updatedAt: string;
          user_id: string;
        };
        Update: {
          address?: string;
          amount?: number;
          createdAt?: string;
          id?: string;
          isVisible?: boolean;
          tokenId?: string;
          updatedAt?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'UserTokenAccount_tokenId_fkey';
            columns: ['tokenId'];
            isOneToOne: false;
            referencedRelation: 'TokenDefinition';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'UserTokenAccount_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      VerificationToken: {
        Row: {
          expires: string;
          identifier: string;
          token: string;
        };
        Insert: {
          expires: string;
          identifier: string;
          token: string;
        };
        Update: {
          expires?: string;
          identifier?: string;
          token?: string;
        };
        Relationships: [];
      };
      WalletAccount: {
        Row: {
          access_token: string | null;
          createdAt: string;
          expires_at: number | null;
          id: string;
          id_token: string | null;
          index: number;
          name: string;
          provider: string;
          providerAccountId: string;
          publicKey: string;
          refresh_token: string | null;
          scope: string | null;
          session_state: string | null;
          token_type: string | null;
          type: string;
          updatedAt: string;
          user_id: string;
        };
        Insert: {
          access_token?: string | null;
          createdAt?: string;
          expires_at?: number | null;
          id: string;
          id_token?: string | null;
          index: number;
          name: string;
          provider?: string;
          providerAccountId?: string;
          publicKey: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type?: string;
          updatedAt: string;
          user_id: string;
        };
        Update: {
          access_token?: string | null;
          createdAt?: string;
          expires_at?: number | null;
          id?: string;
          id_token?: string | null;
          index?: number;
          name?: string;
          provider?: string;
          providerAccountId?: string;
          publicKey?: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type?: string;
          updatedAt?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'WalletAccount_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Wallets: {
        Row: {
          id: string;
          primaryWeb3WalletId: string;
          user_id: string;
        };
        Insert: {
          id: string;
          primaryWeb3WalletId: string;
          user_id: string;
        };
        Update: {
          id?: string;
          primaryWeb3WalletId?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Wallets_primaryWeb3WalletId_fkey';
            columns: ['primaryWeb3WalletId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      BeerCategory: 'LAGERS' | 'ALES' | 'PILSNERS' | 'CRAFT' | 'IPA';
      Category: 'TOKEN' | 'BEVERAGE' | 'FOOD' | 'CLOTHING';
      DrinkType:
        | 'LIQUOR'
        | 'COCKTAIL'
        | 'SHOT'
        | 'BEER'
        | 'ALE'
        | 'WINE'
        | 'COFFEE'
        | 'TEA'
        | 'WATER'
        | 'SODA'
        | 'TYPTO'
        | 'SPIRIT'
        | 'SINGLE_MALT'
        | 'NEAT'
        | 'JUICE'
        | 'NON_ALCOHOLIC'
        | 'CIDER'
        | 'APERITIF'
        | 'DIGESTIF'
        | 'SOFT_DRINKS';
      EstablishmentTypeMenu:
        | 'BAR'
        | 'RESTAURANT'
        | 'RETAIL'
        | 'CAFE'
        | 'WINE_BAR';
      EstablishmentTypeName:
        | 'BAR'
        | 'RESTAURANT'
        | 'RETAIL'
        | 'CAFE'
        | 'WINE_BAR';
      FoodType: 'PASTRY' | 'SANDWICH' | 'BAGEL' | 'SALAD' | 'DESSERT';
      IngredientType:
        | 'GIN'
        | 'VODKA'
        | 'WHISKEY'
        | 'RYE'
        | 'BOURBON'
        | 'SINGLE_MALT'
        | 'TEQUILA'
        | 'RUM'
        | 'COGNAC'
        | 'ALE'
        | 'LAGER'
        | 'TYPTO'
        | 'WINE'
        | 'COFFEE'
        | 'TEA'
        | 'WATER'
        | 'SODA'
        | 'MIXED'
        | 'GOLD'
        | 'IPA'
        | 'PILSNER'
        | 'CIDER'
        | 'WHITE_WINE'
        | 'RED_WINE'
        | 'ROSE_WINE'
        | 'SPARKLING_WINE'
        | 'LIQUEUR'
        | 'NON_ALCOHOLIC'
        | 'DIGESTIF'
        | 'MEZCAL'
        | 'PASTRY'
        | 'JUICE'
        | 'PISCO'
        | 'CHARDONNAY'
        | 'SAUVIGNON_BLANC'
        | 'PINOT_GRIGIO'
        | 'ALBARINO'
        | 'CHENIN_BLANC'
        | 'PINOT_NOIR'
        | 'CABERNET_SAUVIGNON'
        | 'MERLOT'
        | 'SYRAH'
        | 'ZINFANDEL'
        | 'SANGIOVESE'
        | 'ROSE'
        | 'PROSECCO'
        | 'CHAMPAGNE'
        | 'CREMANT'
        | 'ORANGE'
        | 'GRUNER_VELTLINER'
        | 'CALVADOS'
        | 'AQUAVIT'
        | 'ABSINTHE'
        | 'ARMAGNAC'
        | 'GRAPPA'
        | 'FERNET'
        | 'JAGERMEISTER';
      MediaAssetType: 'ESTABLISHMENT_BANNER' | 'PRODUCT_IMAGE';
      MenuTypeName: 'BAR' | 'CAFE' | 'RESTAURANT' | 'WINE_BAR';
      OrderStatus:
        | 'ERRORED'
        | 'UNPAID'
        | 'PAID'
        | 'SHIPPED'
        | 'OUT'
        | 'CANCELLED';
      Origin:
        | 'DOMESTIC'
        | 'IMPORT'
        | 'FRANCE'
        | 'ITALY'
        | 'SPAIN'
        | 'PORTUGAL'
        | 'GERMANY'
        | 'AUSTRALIA'
        | 'NEW_ZEALAND'
        | 'CHILE'
        | 'ARGENTINA'
        | 'SOUTH_AFRICA'
        | 'ENGLAND'
        | 'WALES'
        | 'SCOTLAND'
        | 'IRELAND'
        | 'AUSTRIA'
        | 'USA';
      Shelf:
        | 'PREMIUM'
        | 'TOP'
        | 'MID'
        | 'WELL'
        | 'HOUSE'
        | 'BOTTLE'
        | 'DRAUGHT';
      TaskStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
      TokenSymbol: 'SOL' | 'TYP';
      TransactionStatus: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
      UserRole: 'USER' | 'ADMIN';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
