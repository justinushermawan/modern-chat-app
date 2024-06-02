export class SendMessageDTO {
  user?: string;
  content: string;
  parentId?: string;
  files?: {
    fileName: string;
    data: string;
  }[];
}
