import { Logger } from '@medusajs/medusa'

class BrandLogger extends Logger {
  private static instance: BrandLogger

  private constructor() {
    super('BrandModule')
  }

  static getInstance(): BrandLogger {
    if (!BrandLogger.instance) {
      BrandLogger.instance = new BrandLogger()
    }
    return BrandLogger.instance
  }

  info(message: string, ...args: any[]): void {
    super.info(`[Brand] ${message}`, ...args)
  }

  warn(message: string, ...args: any[]): void {
    super.warn(`[Brand] ${message}`, ...args)
  }

  error(message: string | Error, ...args: any[]): void {
    super.error(`[Brand] ${message instanceof Error ? message.message : message}`, ...args)
    if (message instanceof Error && message.stack) {
      super.debug(message.stack)
    }
  }
}

export const logger = BrandLogger.getInstance()