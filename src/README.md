# Medusa Brand Module

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

4. **Run Migrations**

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

## Image Processing

Images are automatically processed when uploaded:

1. Converts to WebP format
2. Generates multiple size variants
3. Optimizes quality per variant
4. Maintains aspect ratio
5. Generates responsive sizes

Example response with variants:
```json
{
  "image": {
    "url": "original-url.webp",
    "width": 800,
    "height": 600,
    "format": "webp",
    "variants": {
      "thumbnail": {
        "url": "thumbnail-url.webp",
        "width": 100,
        "height": 75
      },
      "list": {
        "url": "list-url.webp",
        "width": 200,
        "height": 150
      },
      "gallery": {
        "url": "gallery-url.webp",
        "width": 600,
        "height": 450
      },
      "product": {
        "url": "product-url.webp",
        "width": 400,
        "height": 300
      }
    }
  }
}
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

### Directory Structure

```
src/modules/brand/
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

### Running Tests

```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, please open an issue in the repository or contact the maintainers.