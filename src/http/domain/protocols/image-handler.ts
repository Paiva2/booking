export interface ImageHandler {
  upload(params: {
    fileName: string,
    fileBuffer: Buffer
    mimeType: string
  }): Promise<{ url: string }>
}
