# Medusa Brand Module

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node->=16-green.svg)](https://nodejs.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A custom module for Medusa e-commerce that adds brand management capabilities with image support.

## Features

- Brand management (CRUD operations)
- Image processing with automatic variants
- Product-brand relationships
- Search and filtering capabilities
- RESTful API endpoints
- Image optimization with WebP support
- Bulk operations support
- Statistics tracking

## Prerequisites

- Node.js >= 16.0.0
- TypeScript >= 4.9.0
- Medusa >= 1.12.0

## Installation

1. **Install the Module**

```bash
npm install @medusajs/brand-module
```

2. **Register the Module**

In your `medusa-config.js`:

```javascript
const modules = {
  // ... other modules
  brand: {
    resolve: "@medusajs/brand-module",
    options: {
      image: {
        thumbnailSize: 100,
        listSize: 200,
        gallerySize: 600,
        productSize: 400,
        defaultFormat: "webp",
        defaultQuality: 80
      }
    }
  }
}
```

3. **Run Migrations**

```bash
medusa migrations run
```

## Image Storage

By default, the module stores image URLs and their processed variants. The actual images should be hosted on your preferred storage solution (e.g., S3, CloudFront). The module processes images and generates the following variants:

- Thumbnail (100px width)
- List view (200px width)
- Gallery view (600px width)
- Product view (400px width)
- Original (preserved with optimization)

All variants are generated in WebP format for optimal performance.

## API Endpoints

### Admin API

```
GET    /admin/brands              # List all brands
GET    /admin/brands/:id         # Get a single brand
POST   /admin/brands             # Create a brand
POST   /admin/brands/:id         # Update a brand
DELETE /admin/brands/:id         # Delete a brand
POST   /admin/brands/:id/products/:productId  # Attach brand to product
POST   /admin/brands/bulk        # Create multiple brands
POST   /admin/brands/bulk/update # Update multiple brands
POST   /admin/brands/bulk/delete # Delete multiple brands
GET    /admin/brands/:id/stats   # Get brand statistics
```

### Request Examples

Create a brand:
```json
POST /admin/brands
{
  "name": "Nike",
  "description": "Just Do It",
  "image": {
    "url": "https://example.com/nike-logo.png",
    "alt": "Nike Logo"
  }
}
```

Bulk create brands:
```json
POST /admin/brands/bulk
{
  "brands": [
    {
      "name": "Nike",
      "description": "Just Do It",
      "image": {
        "url": "https://example.com/nike-logo.png",
        "alt": "Nike Logo"
      }
    },
    {
      "name": "Adidas",
      "description": "Impossible is Nothing",
      "image": {
        "url": "https://example.com/adidas-logo.png",
        "alt": "Adidas Logo"
      }
    }
  ]
}
```

Get brand statistics:
```json
GET /admin/brands/:id/stats?months=6
```

## Statistics Tracking

The module automatically tracks:

- Brand creation count
- Brand update count
- Brand deletion count
- View count
- Product attachment count

Statistics are stored monthly and can be retrieved via the API.

## Database Schema

The module adds the following tables:

- `brand` - Stores brand information
- `brand_stats` - Stores monthly statistics
- Product table is extended with `brand_id` column

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

### Directory Structure

```
src/modules/brand/
  ├── api/
  │   ├── admin/
  │   └── store/
  ├── middleware/
  │   ├── error/
  │   ├── validation/
  │   └── tracking/
  ├── migrations/
  │   └── *.ts
├── models/
│   ├── brand.ts
│   └── brand-stats.ts
├── repository/
│   ├── brand.ts
│   └── brand-stats.ts
├── services/
│   └── brand.ts
├── types/
│   └── brand.ts
├── utils/
│   ├── image.ts
│   ├── query.ts
│   ├── search.ts
│   ├── transform.ts
│   └── validators.ts
└── index.ts
```

### Type Safety

The module is written in TypeScript with strict mode enabled and includes:

- Strict null checks
- No implicit any
- Strict property initialization
- Unused locals/parameters checks

### Error Handling

Comprehensive error handling with custom error classes:

- `ApiError` - Base API error class
- `ValidationError` - Input validation errors
- `NotFoundError` - Resource not found errors
- `BrandImageError` - Image processing errors
- `BrandValidationError` - Brand-specific validation errors

### Logging

Custom logger implementation for better debugging:

- Prefixed log messages
- Different log levels (info, warn, error)
- Stack trace for errors
- Singleton pattern for consistent logging

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

Please ensure your code:
- Passes all tests
- Follows the existing code style
- Includes appropriate documentation
- Has proper type definitions
- Handles errors appropriately

## License

MIT License

## Author

Dr. Tito (info@nrgy.com.au)

## Support

For support, please open an issue in the repository or contact the maintainers.