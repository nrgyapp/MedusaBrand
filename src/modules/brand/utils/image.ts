import sharp from "sharp"
import { MedusaError } from "@medusajs/utils"
import fetch from "node-fetch"

export type ImageFormat = "webp" | "jpeg" | "png"

export type ImagePreset = "thumbnail" | "list" | "gallery" | "product" | "original"

export const IMAGE_PRESETS = {
  thumbnail: {
    maxWidth: 100,
    quality: 80,
    format: "webp" as ImageFormat,
    maintainAspectRatio: true
  },
  list: {
    maxWidth: 200,
    quality: 85,
    format: "webp" as ImageFormat,
    maintainAspectRatio: true
  },
  gallery: {
    maxWidth: 600,
    quality: 90,
    format: "webp" as ImageFormat,
    maintainAspectRatio: true
  },
  product: {
    maxWidth: 400,
    quality: 90,
    format: "webp" as ImageFormat,
    maintainAspectRatio: true
  },
  original: {
    quality: 95,
    format: "webp" as ImageFormat,
    maintainAspectRatio: true
  }
} as const

export type ImageOptions = {
  maxWidth?: number
  quality?: number
  format?: ImageFormat
  maintainAspectRatio?: boolean
  background?: string
  preset?: ImagePreset
}

export type ProcessedImage = {
  url: string
  width: number
  height: number
  format: ImageFormat
  size: number,
  variants?: {
    [key in ImagePreset]?: Omit<ProcessedImage, 'variants'>
  }
}

export async function processImage(
  imageUrl: string,
  options: ImageOptions = {}
): Promise<ProcessedImage> {
  // If preset is provided, merge preset options with custom options
  const presetOptions = options.preset ? IMAGE_PRESETS[options.preset] : {}
  
  const {
    maxWidth = 800,
    quality = 80,
    format = "webp",
    maintainAspectRatio = true,
    background = "#ffffff"
  } = { ...presetOptions, ...options }

  try {
    // Fetch image
    const response = await fetch(imageUrl)
    const buffer = await response.buffer()
    
    // Generate all variants if no specific preset is provided
    if (!options.preset) {
      const variants: ProcessedImage['variants'] = {}
      
      // Process each preset variant
      for (const [preset, presetOpts] of Object.entries(IMAGE_PRESETS)) {
        if (preset !== 'original') {
          const variantImage = await processImage(imageUrl, {
            ...presetOpts,
            preset: preset as ImagePreset
          })
          delete variantImage.variants // Avoid nested variants
          variants[preset as ImagePreset] = variantImage
        }
      }
    }

    // Process image with sharp
    let image = sharp(buffer)
    const metadata = await image.metadata()
    if (!metadata || !metadata.width) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Could not process image metadata"
      )
    }

    // Resize if needed
    if (metadata.width > maxWidth) {
      image = image.resize(maxWidth, undefined, {
        withoutEnlargement: true,
        fit: maintainAspectRatio ? "inside" : "fill",
        background
      })
    }

    // Convert to desired format
    switch (format) {
      case "webp":
        image = image.webp({ quality })
        break
      case "jpeg":
        image = image.jpeg({ quality })
        break
      case "png":
        image = image.png({ quality })
        break
    }

    // Process the image
    const processedBuffer = await image.toBuffer()

    // Get final dimensions
    const finalMetadata = await image.metadata()

    return {
      url: imageUrl, // Original URL - in production you'd upload the processed image
      width: finalMetadata.width,
      height: finalMetadata.height,
      format: format,
      size: processedBuffer.length,
      ...(variants ? { variants } : {})
    }
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export function validateImageUrl(url: string): void {
  try {
    new URL(url)
  } catch (e) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid image URL format"
    )
  }
}