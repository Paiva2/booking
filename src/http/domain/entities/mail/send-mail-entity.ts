export interface SendMailEntity {
  to: string,
  subject:string,
  text: string
  html?: string
}
