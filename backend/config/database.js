import PouchDB from 'pouchdb';
import findPlugin from 'pouchdb-find';

PouchDB.plugin(findPlugin);

// Set up a local prefix for pouch files
const Pouch = PouchDB.defaults({
     prefix: './pouch/'
});

// Databases
const itemsDB = new Pouch("items_db");
const transactionsDB = new Pouch("transactions_db");

// Initialize Items Database
const initializeItemsDB = async () => {
     try {
          await itemsDB.createIndex({
               index: { fields: ['item_name'] }
          });

          await itemsDB.createIndex({
               index: { fields: ['default_cost_price', 'default_selling_price'] }
          });

     } catch (err) {
          console.error("Error initializing items database:", err);
          throw err;
     }
};

// Initialize Transactions Database
const initializeTransactionsDB = async () => {
     try {
          await transactionsDB.createIndex({
               index: { fields: ['date'] }
          });

          await transactionsDB.createIndex({
               index: { fields: ['item_name', 'cost_price', 'selling_price'] }
          });

     } catch (err) {
          console.error("Error initializing transactions database:", err);
          throw err;
     }
};

export {
     itemsDB,
     transactionsDB,
     initializeItemsDB,
     initializeTransactionsDB
};
