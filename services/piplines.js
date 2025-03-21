// Total revenue over specific period
/* [{
  $match: {
  createdAt: {$gte:new Date(new Date().setDate(new Date().getDate()-30))}
  }
},
  {
    $group: {
      _id: null,
      totalRevenue:{$sum:'$totalPrice'},
      orderCount:{$sum:1},
      averageRevenue:{$avg:'$totalPrice'}
    }
  }
] */

// Users with pending Orders
/* [
  {
    $match: {
    status: "pending"
    }
  },
  {
    $group: {
      _id: '$client',
      pendingOrderForUser:{$sum:1},
      averagePendingForUser:{$avg:'$totalPrice'}
      }
    }
] */

// Top orders by revenue
/*  [
  {
    $match: {
      status : { $ne : "cancelled" }
    }
  },
  {
    $sort: {
      totalPrice: -1
    }
  },
  {
    $limit: 3
  }
]  */

// Top customers by spending
[
  {
    $group: {
      _id: "$client",
      totalOrderCount: { $sum: 1 },
      totalOrdersAmt: { $sum: '$totalPrice' },
      averageOrderCost: { $avg: '$totalPrice' }
    }
  },
  {
    $sort: {
      totalOrdersAmt: -1
    }
  },
  {
    $limit: 3
  }
]

// Most popular products
/* [
  {
    $unwind: {
      path: "$items",
    }
  },
  {
    $group: {
      _id: "$_id",
      totalProducts: { $sum : 1 }
    }
  },
  {
    $sort: {
      totalProducts: -1
    }
  }
] */// Total revenue over specific period
/* [{
  $match: {
    createdAt: {$gte: new Date(new Date().setDate(new Date().getDate()-30))}
  }
},
  {
    $group: {
      _id: null,
      totalRevenue:{$sum:'$totalPrice'},
      orderCount:{$sum:1},
      averageRevenue:{$avg:'$totalPrice'}
    }
  }
] */

// Users with pending Orders
/* [
  {
    $match: {
      status: "pending"
    }
  },
  {
    $group: {
      _id: '$client',
      pendingOrderForUser:{$sum:1},
      averagePendingForUser:{$avg:'$totalPrice'}
    }
  },
  {
    $sort: {
      pendingOrderForUser: -1
    }
  }
] */

// Top orders by revenue
/*  [
  {
    $match: {
      status : { $ne : "cancelled" }
    }
  },
  {
    $sort: {
      totalPrice: -1
    }
  },
  {
    $limit: 5
  }
]  */

// Top customers by spending
[
  {
    $group: {
      _id: "$client",
      totalOrderCount: { $sum: 1 },
      totalOrdersAmt: { $sum: '$totalPrice' },
      averageOrderCost: { $avg: '$totalPrice' }
    }
  },
  {
    $sort: {
      totalOrdersAmt: -1
    }
  },
  {
    $limit: 5
  }
]

// Most popular products
[
  {
    $unwind: {
      path: "$items",
    }
  },
  {
    $group: {
      _id: "$items.product",
      totalProducts: { $sum: 1 }
    }
  },
  {
    $sort: {
      totalProducts: -1
    }
  },
  {
    $limit: 5
  }
]

//Revenue trends
[
  {
    $match: {
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 100)) }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
      },
      ordersCount: { $sum: 1 },
      revenue: { $sum: "$totalPrice" },
      averageOrderRevenue: { $avg: "$totalPrice" }
    }
  },
  {
    $sort: { _id: -1 }
  }
]

// get Clients pipeline
[
  {
    $project: {
      username: 1,
      email: 1,
      phoneNumber: 1,
      membership: 1,
      orders: 1,
      cart: 1,
      flagged: 1,
      isVerified: 1,
      createdAt: 1,
    }
  },
  {
    $lookup: {
      from: 'orders',
      localField: 'orders',
      foreignField: '_id',
      as: 'clientOrders',
      pipeline: [
        {
          $project: {
            items: 1,
            totalPrice: 1,
            status: 1,
            paymentMethod: 1,
            createdAt: 1
          }
        }
      ]
    }
  }
]