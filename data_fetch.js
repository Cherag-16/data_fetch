class ProductAnalyzer {
  constructor() {
      this.products = [];
      this.filterHistory = [];
  }

  async initialize() {
      try {
          const response = await fetch('https://fakestoreapi.com/products');
          if (!response.ok) {
              throw new Error('Failed to fetch product data');
          }
          this.products = await response.json();
          this.displayInitialProducts();
      } catch (error) {
          console.error('Error initializing product data:', error.message);
      }
  }

  displayInitialProducts() {
      console.log('\n=== First 5 Products Overview ===');
      this.products.slice(0, 5).forEach(product => {
          console.log(`- ${product.title} ($${product.price})`);
      });
  }

  async filterByCategory(category) {
      try {
          const filteredProducts = this.products.filter(
              product => product.category.toLowerCase() === category.toLowerCase()
          );

          this.addToHistory('category', category, filteredProducts.length);

          console.log(`\n=== Products in ${category} category ===`);
          filteredProducts.forEach(product => {
              console.log(`- ${product.title} ($${product.price})`);
          });

          return filteredProducts;
      } catch (error) {
          console.error('Error filtering products:', error.message);
          return [];
      }
  }

  findMostExpensiveProduct() {
      try {
          const mostExpensive = this.products.reduce(
              (max, product) => (product.price > max.price ? product : max),
              this.products[0]
          );

          console.log('\n=== Most Expensive Product ===');
          console.log(`Title: ${mostExpensive.title}`);
          console.log(`Price: $${mostExpensive.price}`);
          console.log(`Category: ${mostExpensive.category}`);

          return mostExpensive;
      } catch (error) {
          console.error('Error finding most expensive product:', error.message);
          return null;
      }
  }

  calculateAveragePrice() {
      try {
          const average = this.products.reduce((sum, product) => sum + product.price, 0) / 
                        this.products.length;

          console.log('\n=== Price Analysis ===');
          console.log(`Average Price: $${average.toFixed(2)}`);

          return average;
      } catch (error) {
          console.error('Error calculating average price:', error.message);
          return 0;
      }
  }

  addToHistory(filterType, criteria, resultCount) {
      const historyEntry = {
          timestamp: new Date().toISOString(),
          filterType,
          criteria,
          resultCount
      };
      this.filterHistory.push(historyEntry);
  }

  displayFilterHistory() {
      console.log('\n=== Filter History ===');
      this.filterHistory.forEach(entry => {
          console.log(`${entry.timestamp}: Filtered by ${entry.filterType} "${entry.criteria}" - Found ${entry.resultCount} items`);
      });
  }

  getCategories() {
      const categories = [...new Set(this.products.map(product => product.category))];
      console.log('\n=== Available Categories ===');
      categories.forEach(category => console.log(`- ${category}`));
      return categories;
  }
}

async function analyzeProductData() {
  try {
      const analyzer = new ProductAnalyzer();
      await analyzer.initialize();
      const categories = analyzer.getCategories();
      await analyzer.filterByCategory('electronics');
      analyzer.findMostExpensiveProduct();
      analyzer.calculateAveragePrice();
      analyzer.displayFilterHistory();
  } catch (error) {
      console.error('Error in product analysis:', error.message);
  }
}

analyzeProductData();
