class ProductAnalyzer {
  constructor() {
      this.products = [];
      this.filterHistory = [];
  }

  // Fetch and initialize product data
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

  // Display first 5 products
  displayInitialProducts() {
      console.log('\n=== First 5 Products Overview ===');
      this.products.slice(0, 5).forEach(product => {
          console.log(`- ${product.title} ($${product.price})`);
      });
  }

  // Filter products by category
  async filterByCategory(category) {
      try {
          const filteredProducts = this.products.filter(
              product => product.category.toLowerCase() === category.toLowerCase()
          );

          // Log filter history
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

  // Find product with highest price
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

  // Calculate average price
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

  // Add filter operation to history
  addToHistory(filterType, criteria, resultCount) {
      const historyEntry = {
          timestamp: new Date().toISOString(),
          filterType,
          criteria,
          resultCount
      };
      this.filterHistory.push(historyEntry);
  }

  // Display filter history
  displayFilterHistory() {
      console.log('\n=== Filter History ===');
      this.filterHistory.forEach(entry => {
          console.log(`${entry.timestamp}: Filtered by ${entry.filterType} "${entry.criteria}" - Found ${entry.resultCount} items`);
      });
  }

  // Get available categories
  getCategories() {
      const categories = [...new Set(this.products.map(product => product.category))];
      console.log('\n=== Available Categories ===');
      categories.forEach(category => console.log(`- ${category}`));
      return categories;
  }
}

// Example usage
async function analyzeProductData() {
  try {
      const analyzer = new ProductAnalyzer();
      
      // Initialize and fetch data
      await analyzer.initialize();

      // Get available categories
      const categories = analyzer.getCategories();

      // Filter products by category (example: 'electronics')
      await analyzer.filterByCategory('electronics');

      // Find most expensive product
      analyzer.findMostExpensiveProduct();

      // Calculate average price
      analyzer.calculateAveragePrice();

      // Display filter history
      analyzer.displayFilterHistory();

  } catch (error) {
      console.error('Error in product analysis:', error.message);
  }
}

// Run the analysis
analyzeProductData();