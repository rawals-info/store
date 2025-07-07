import { AbstractFileProviderService, MedusaError } from "@medusajs/utils"
import { Readable } from "stream"
import https from "https"
import axios from "axios"
import { v2 as cloudinary, UploadApiOptions } from "cloudinary"

// Type definitions for provider options
interface CloudinaryProviderOptions {
  cloud_name: string
  api_key: string
  api_secret: string
  secure?: boolean
  folder?: string // optional folder prefix
}

type InjectedDependencies = {
  logger: any // using any to avoid importing full Logger type
}

export class CloudinaryFileService extends AbstractFileProviderService {
  protected logger_: any
  protected options_: CloudinaryProviderOptions

  static identifier = "cloudinary"

  constructor({ logger }: InjectedDependencies, options: CloudinaryProviderOptions) {
    super()
    this.logger_ = logger
    this.options_ = options

    if (!options?.cloud_name || !options?.api_key || !options?.api_secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cloudinary provider requires cloud_name, api_key, and api_secret in its options."
      )
    }

    cloudinary.config({
      cloud_name: options.cloud_name,
      api_key: options.api_key,
      api_secret: options.api_secret,
      secure: options.secure ?? true,
    })
  }

  /**
   * Upload a file buffer to Cloudinary.
   */
  async upload(file: any) {
    if (!file || !file.filename) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "No file or filename provided")
    }

    // Convert buffer/string to base64 data URI
    const buffer: Buffer = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, "binary")
    const dataUri = `data:${file.mimeType};base64,${buffer.toString("base64")}`

    const uploadOptions: UploadApiOptions = {
      folder: this.options_.folder,
      public_id: undefined,
      resource_type: "auto",
    }

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions)

    return {
      url: result.secure_url || result.url,
      key: result.public_id,
    }
  }

  /**
   * Delete one or many files on Cloudinary by public_id (fileKey)
   */
  async delete(files: any | any[]) {
    const fileArray = Array.isArray(files) ? files : [files]

    await Promise.all(
      fileArray.map(async (f) => {
        try {
          await cloudinary.uploader.destroy(f.fileKey, { invalidate: true })
        } catch (err) {
          this.logger_?.warn?.(`Failed to delete ${f.fileKey}: ${err?.message || err}`)
        }
      })
    )
  }

  /**
   * For Cloudinary we can just return a normal URL as it already serves files.
   */
  async getPresignedDownloadUrl(fileData: any): Promise<string> {
    if (!fileData?.fileKey) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "fileKey is required")
    }
    return cloudinary.url(fileData.fileKey, { secure: this.options_.secure ?? true })
  }

  /**
   * Download as stream using HTTPS
   */
  async getDownloadStream(fileData: any): Promise<Readable> {
    const url = await this.getPresignedDownloadUrl(fileData)
    const response = await axios.get(url, { responseType: "stream" })
    return response.data as Readable
  }

  /**
   * Download entire file as buffer
   */
  async getAsBuffer(fileData: any): Promise<Buffer> {
    const url = await this.getPresignedDownloadUrl(fileData)
    const response = await axios.get(url, { responseType: "arraybuffer" })
    return Buffer.from(response.data)
  }
}

// Export as ModuleProvider wrapper so Medusa can register the service
import { ModuleProvider, Modules } from "@medusajs/framework/utils"

const services = [CloudinaryFileService]

export default ModuleProvider(Modules.FILE, {
  services,
}) 