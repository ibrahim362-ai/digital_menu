import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        cashier: true
      }
    });
    
    console.log('Total orders:', orders.length);
    
    if (orders.length > 0) {
      console.log('\nOrders by cashier:');
      const ordersByCashier = {};
      orders.forEach(order => {
        const cashierId = order.cashierId;
        if (!ordersByCashier[cashierId]) {
          ordersByCashier[cashierId] = {
            count: 0,
            cashierName: order.cashier.name
          };
        }
        ordersByCashier[cashierId].count++;
      });
      
      Object.entries(ordersByCashier).forEach(([cashierId, data]) => {
        console.log(`Cashier ID ${cashierId} (${data.cashierName}): ${data.count} order(s)`);
      });
    } else {
      console.log('No orders found in database');
    }
    
    const cashiers = await prisma.cashier.findMany();
    console.log('\nTotal cashiers:', cashiers.length);
    cashiers.forEach(c => console.log(`- ID ${c.id}: ${c.name} (${c.username})`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrders();
