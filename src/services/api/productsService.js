import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class ProductsService {
  constructor() {
    this.tableName = 'products_c';
    this.categoryTableName = 'categories_c';
  }

  async getAll(filters = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}}
        ],
        where: [],
        orderBy: []
      };

      // Apply filters
      if (filters.category) {
        params.where.push({
          "FieldName": "category_c",
          "Operator": "Contains",
          "Values": [filters.category]
        });
      }

      if (filters.search) {
        params.whereGroups = [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "name_c",
                  "operator": "Contains",
                  "values": [filters.search]
                },
                {
                  "fieldName": "description_c", 
                  "operator": "Contains",
                  "values": [filters.search]
                }
              ]
            }
          ]
        }];
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            params.orderBy.push({"fieldName": "price_c", "sorttype": "ASC"});
            break;
          case "price-high":
            params.orderBy.push({"fieldName": "price_c", "sorttype": "DESC"});
            break;
          case "name":
            params.orderBy.push({"fieldName": "name_c", "sorttype": "ASC"});
            break;
        }
      }

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }

      // Transform database fields to UI format and apply client-side filters
      let products = response.data.map(product => ({
        Id: product.Id,
        name: product.name_c || '',
        description: product.description_c || '',
        price: product.price_c || 0,
        sizes: product.sizes_c ? product.sizes_c.split(',') : [],
        colors: product.colors_c ? product.colors_c.split(',') : [],
        stock: product.stock_c || 0,
        featured: product.featured_c || false,
        images: product.images_c || ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop'],
        category: product.category_c?.Name || '',
        subcategory: product.subcategory_c?.Name || ''
      }));

      // Apply client-side filters
      if (filters.sizes && filters.sizes.length > 0) {
        products = products.filter(p =>
          filters.sizes.some(size => p.sizes.includes(size))
        );
      }

      if (filters.colors && filters.colors.length > 0) {
        products = products.filter(p =>
          filters.colors.some(color => p.colors.includes(color))
        );
      }

      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice);
      }

      return {
        success: true,
        data: products
      };

    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, error: error.message };
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return { success: false, error: "Product not found" };
      }

      if (!response.data) {
        return { success: false, error: "Product not found" };
      }

      // Transform database fields to UI format
      const product = {
        Id: response.data.Id,
        name: response.data.name_c || '',
        description: response.data.description_c || '',
        price: response.data.price_c || 0,
        sizes: response.data.sizes_c ? response.data.sizes_c.split(',') : [],
        colors: response.data.colors_c ? response.data.colors_c.split(',') : [],
        stock: response.data.stock_c || 0,
        featured: response.data.featured_c || false,
        images: response.data.images_c || ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop'],
        category: response.data.category_c?.Name || '',
        subcategory: response.data.subcategory_c?.Name || ''
      };

      return {
        success: true,
        data: product
      };

    } catch (error) {
      console.error("Error fetching product:", error);
      return { success: false, error: error.message };
    }
  }

  async getFeatured() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}}
        ],
        where: [{
          "FieldName": "featured_c",
          "Operator": "EqualTo",
          "Values": [true]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }

      // Transform database fields to UI format
      const products = response.data.map(product => ({
        Id: product.Id,
        name: product.name_c || '',
        description: product.description_c || '',
        price: product.price_c || 0,
        sizes: product.sizes_c ? product.sizes_c.split(',') : [],
        colors: product.colors_c ? product.colors_c.split(',') : [],
        stock: product.stock_c || 0,
        featured: product.featured_c || false,
        images: product.images_c || ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop'],
        category: product.category_c?.Name || '',
        subcategory: product.subcategory_c?.Name || ''
      }));

      return {
        success: true,
        data: products
      };

    } catch (error) {
      console.error("Error fetching featured products:", error);
      return { success: false, error: error.message };
    }
  }

  async getRelated(productId, limit = 4) {
    try {
      // First get the product to find its category
      const productResponse = await this.getById(productId);
      if (!productResponse.success) {
        return { success: false, error: "Product not found" };
      }

      const product = productResponse.data;
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}}
        ],
        where: [
          {
            "FieldName": "category_c",
            "Operator": "Contains", 
            "Values": [product.category]
          },
          {
            "FieldName": "Id",
            "Operator": "NotEqualTo",
            "Values": [parseInt(productId)]
          }
        ],
        pagingInfo: {
          "limit": limit,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return { success: false, error: response.message };
      }

      // Transform database fields to UI format
      const products = response.data.map(product => ({
        Id: product.Id,
        name: product.name_c || '',
        description: product.description_c || '',
        price: product.price_c || 0,
        sizes: product.sizes_c ? product.sizes_c.split(',') : [],
        colors: product.colors_c ? product.colors_c.split(',') : [],
        stock: product.stock_c || 0,
        featured: product.featured_c || false,
        images: product.images_c || ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop'],
        category: product.category_c?.Name || '',
        subcategory: product.subcategory_c?.Name || ''
      }));

      return {
        success: true,
        data: products
      };

    } catch (error) {
      console.error("Error fetching related products:", error);
      return { success: false, error: error.message };
    }
  }

  async getCategories() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.categoryTableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }

      // Transform to simple array of category names
      const categories = response.data.map(cat => cat.name_c).filter(name => name);

      return {
        success: true,
        data: categories
      };

    } catch (error) {
      console.error("Error fetching categories:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new ProductsService();