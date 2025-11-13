import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OrderService {
  constructor() {
    this.tableName = 'orders_c';
  }

  async createOrder(orderData) {
    await delay(200);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const orderNumber = `ORD-${Date.now()}`;
      
      const params = {
        records: [{
          orderNumber_c: orderNumber,
          orderDate_c: new Date().toISOString(),
          status_c: "confirmed",
          total_c: orderData.totalAmount,
          items_c: JSON.stringify(orderData.items),
          shippingAddress_c: JSON.stringify(orderData.shippingAddress),
          tracking_c: JSON.stringify({
            trackingNumber: `TRK-${Date.now()}`,
            carrier: "Standard Shipping",
            events: [
              {
                status: "Order Confirmed",
                date: new Date().toISOString(),
                location: "Processing Center"
              }
            ]
          })
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create order: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return { success: false, error: "Failed to create order" };
        }
        
        if (successful.length > 0) {
          return {
            success: true,
            data: {
              orderId: successful[0].data.Id,
              orderNumber: orderNumber
            }
          };
        }
      }

      return { success: false, error: "Order creation failed" };

    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, error: error.message };
    }
  }

  async getOrderById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "orderNumber_c"}},
          {"field": {"Name": "orderDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "shippingAddress_c"}},
          {"field": {"Name": "tracking_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        return { success: false, error: "Order not found" };
      }

      if (!response.data) {
        return { success: false, error: "Order not found" };
      }

      // Transform database fields to UI format
      const order = {
        Id: response.data.Id,
        orderNumber: response.data.orderNumber_c,
        orderDate: response.data.orderDate_c,
        status: response.data.status_c,
        total: response.data.total_c,
        items: response.data.items_c ? JSON.parse(response.data.items_c) : [],
        shippingAddress: response.data.shippingAddress_c ? JSON.parse(response.data.shippingAddress_c) : {},
        tracking: response.data.tracking_c ? JSON.parse(response.data.tracking_c) : null
      };

      return { success: true, data: order };

    } catch (error) {
      console.error("Error fetching order:", error);
      return { success: false, error: error.message };
    }
  }

  async getUserOrders(filters = {}) {
    await delay(300);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "orderNumber_c"}},
          {"field": {"Name": "orderDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "shippingAddress_c"}},
          {"field": {"Name": "tracking_c"}}
        ],
        orderBy: [{"fieldName": "orderDate_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }

      // Transform database fields to UI format
      const orders = response.data.map(order => ({
        Id: order.Id,
        orderNumber: order.orderNumber_c,
        orderDate: order.orderDate_c,
        status: order.status_c,
        total: order.total_c,
        items: order.items_c ? JSON.parse(order.items_c) : [],
        shippingAddress: order.shippingAddress_c ? JSON.parse(order.shippingAddress_c) : {},
        tracking: order.tracking_c ? JSON.parse(order.tracking_c) : null
      }));

      return { success: true, data: orders };

    } catch (error) {
      console.error("Error fetching user orders:", error);
      return { success: false, error: error.message };
    }
  }

  async getOrderTracking(orderId) {
    await delay(200);
    try {
      const orderResponse = await this.getOrderById(orderId);
      
      if (!orderResponse.success) {
        return { success: false, error: "Order not found" };
      }

      const order = orderResponse.data;
      
      return {
        success: true,
        data: order.tracking || {
          trackingNumber: "N/A",
          carrier: "Standard Shipping", 
          events: []
        }
      };

    } catch (error) {
      console.error("Error getting order tracking:", error);
      return { success: false, error: error.message };
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    await delay(200);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        records: [{
          Id: parseInt(orderId),
          status_c: newStatus
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }

      return { success: true };

    } catch (error) {
      console.error("Error updating order status:", error);
      return { success: false, error: error.message };
    }
  }

  async processPayment(paymentData) {
    await delay(1000);
    
    // Simulate payment processing
    const isSuccess = Math.random() > 0.1; // 90% success rate
    
    if (isSuccess) {
      return {
        success: true,
        data: {
          transactionId: `txn_${Date.now()}`,
          status: "completed"
        }
      };
    } else {
      return {
        success: false,
        error: "Payment failed. Please try again."
      };
    }
  }
}

export default new OrderService();