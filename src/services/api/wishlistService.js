import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const wishlistService = {
  tableName: 'wishlist_items_c',

  // Get all wishlist items (returns array of product IDs)
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "productId_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching wishlist:", response.message);
        return [];
      }

      // Return array of product IDs for compatibility
      return response.data.map(item => item.productId_c).filter(id => id);

    } catch (error) {
      console.error('Error retrieving wishlist:', error);
      return [];
    }
  },

  // Add item to wishlist
  async add(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // Check if already in wishlist
      const current = await this.getAll();
      if (current.includes(productId)) {
        return false; // Item already in wishlist
      }

      const params = {
        records: [{
          productId_c: parseInt(productId)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create wishlist item: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;

    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw new Error('Failed to add item to wishlist');
    }
  },

  // Remove item from wishlist
  async remove(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // First find the wishlist item record
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "productId_c"}}
        ],
        where: [{
          "FieldName": "productId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(productId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error finding wishlist item:", response.message);
        return false;
      }

      if (!response.data?.length) {
        return true; // Item not in wishlist, consider it removed
      }

      // Delete the record
      const deleteParams = {
        RecordIds: response.data.map(item => item.Id)
      };

      const deleteResponse = await apperClient.deleteRecord(this.tableName, deleteParams);

      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        toast.error(deleteResponse.message);
        return false;
      }

      if (deleteResponse.results) {
        const failed = deleteResponse.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete wishlist items: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;

    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw new Error('Failed to remove item from wishlist');
    }
  },

  // Check if item is in wishlist
  async isInWishlist(productId) {
    try {
      const current = await this.getAll();
      return current.includes(parseInt(productId));
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },

  // Clear entire wishlist
  async clear() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // Get all wishlist items
      const params = {
        fields: [{"field": {"Name": "Id"}}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching wishlist for clear:", response.message);
        return false;
      }

      if (!response.data?.length) {
        return true; // Nothing to clear
      }

      // Delete all records
      const deleteParams = {
        RecordIds: response.data.map(item => item.Id)
      };

      const deleteResponse = await apperClient.deleteRecord(this.tableName, deleteParams);

      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        toast.error(deleteResponse.message);
        return false;
      }

      return true;

    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw new Error('Failed to clear wishlist');
    }
  },

  // Get wishlist count
  async getCount() {
    try {
      const items = await this.getAll();
      return items.length;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }
};

export { wishlistService };