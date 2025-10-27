export const policies = {
  CustomerPolicy: () => import("#policies/customer_policy"),
  OrderPolicy: () => import("#policies/order_policy"),
};
