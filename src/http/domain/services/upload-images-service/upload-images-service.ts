import { InvalidParamException } from '../../../presentation/exceptions';
import { ImageHandler, Service } from '../../protocols/index';

type UrlUploadResponse = ({
  name: string;
  iconUrl: string;
} | {
  url: string;
})[];

interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export class UploadImagesService implements Service {
  public constructor(private readonly imageHandler: ImageHandler) {}

  public async exec({ files, query, iconMapper }: {
    files: File[],
    query: {
      type?: string
    },
    iconMapper?: { idx: number, name: string }[],
  }): Promise<UrlUploadResponse> {
    const hasIconsAndUrl = query.type === 'commodity' && iconMapper;

    if (hasIconsAndUrl) {
      if (files.length !== iconMapper.length) {
        throw new InvalidParamException('iconMapper and files length');
      }
    }

    const urls: UrlUploadResponse = [];

    for await (const [idx, file] of files.entries()) {
      const findIcon = hasIconsAndUrl
        ? iconMapper?.find((icon: { idx: number, name: string }) => icon.idx === idx)
        : null;

      const uploadResponse = await this.imageHandler.upload({
        fileBuffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
      });

      if (hasIconsAndUrl) {
        if (findIcon) {
          urls.push({
            name: findIcon.name,
            iconUrl: uploadResponse.url,
          });
        }
      } else {
        urls.push({
          url: uploadResponse.url,
        });
      }
    }

    return urls;
  }
}
