import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { UploadImagesService } from './upload-images-service';
import { ImageHandler } from '../../protocols';
import { InvalidParamException } from '../../../presentation/exceptions';

const makeImageHandlerStub = () => {
  class ImageHandlerStub implements ImageHandler {
    async upload(params: {
      fileName: string;
      fileBuffer: Buffer;
      mimeType: string;
    }): Promise<{ url: string; }> {
      return { url: 'any_url' };
    }
  }

  return new ImageHandlerStub();
};

interface SutTypes {
  sut: UploadImagesService
  imageHandlerStub: ImageHandler
}

const makeSut = (): SutTypes => {
  const imageHandlerStub = makeImageHandlerStub();
  const sut = new UploadImagesService(imageHandlerStub);

  return {
    sut,
    imageHandlerStub,
  };
};

let sutFactory: SutTypes;

describe('UploadImagesService', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const args = {
      files: [],
      query: {
        type: 'normal',
      },
    };

    await sut.exec(args);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(args);
  });

  test('Should call ImageHandler upload method with correct provided params', async () => {
    const { sut, imageHandlerStub } = sutFactory;

    const spyHandler = vi.spyOn(imageHandlerStub, 'upload');

    const args = {
      files: [{
        fieldname: 'valid_fieldname',
        originalname: 'valid_originalname',
        encoding: 'valid_encoding',
        mimetype: 'valid_mimetype',
        size: 100,
        destination: 'valid_destination',
        filename: 'valid_filename',
        path: 'valid_path',
        buffer: Buffer.from('valid_buffer'),
      }],
      query: {
        type: 'normal',
      },
    };

    await sut.exec(args);

    expect(spyHandler).toHaveBeenCalledOnce();
    expect(spyHandler).toHaveBeenCalledWith({
      fileBuffer: args.files[0].buffer,
      fileName: args.files[0].originalname,
      mimeType: args.files[0].mimetype,
    });
  });

  test('Should throw Exception if type commodity and iconMapper are provided but size dont match with provided files', async () => {
    const { sut } = sutFactory;

    const args = {
      files: [{
        fieldname: 'valid_fieldname',
        originalname: 'valid_originalname',
        encoding: 'valid_encoding',
        mimetype: 'valid_mimetype',
        size: 100,
        destination: 'valid_destination',
        filename: 'valid_filename1',
        path: 'valid_path',
        buffer: Buffer.from('valid_buffer'),
      }],
      query: {
        type: 'commodity',
      },
      iconMapper: [{ idx: 0, name: 'icon1' }, { idx: 1, name: 'icon2' }],
    };

    const expectedException = new InvalidParamException('iconMapper and files length');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should return url created from all files provided - NO COMMODITY AND ICONMAPPER', async () => {
    const { sut } = sutFactory;

    const args = {
      files: [{
        fieldname: 'valid_fieldname',
        originalname: 'valid_originalname',
        encoding: 'valid_encoding',
        mimetype: 'valid_mimetype',
        size: 100,
        destination: 'valid_destination',
        filename: 'valid_filename',
        path: 'valid_path',
        buffer: Buffer.from('valid_buffer'),
      },
      {
        fieldname: 'valid_fieldname',
        originalname: 'valid_originalname',
        encoding: 'valid_encoding',
        mimetype: 'valid_mimetype',
        size: 100,
        destination: 'valid_destination',
        filename: 'valid_filename',
        path: 'valid_path',
        buffer: Buffer.from('valid_buffer'),
      }],
      query: {
        type: 'normal',
      },
    };

    const response = await sut.exec(args);

    expect(response).toEqual([
      {
        url: 'any_url',
      },
      {
        url: 'any_url',
      },
    ]);
  });

  test('Should return url created from all files provided - WITH COMMODITY AND ICONMAPPER', async () => {
    const { sut } = sutFactory;

    const args = {
      files: [{
        fieldname: 'valid_fieldname',
        originalname: 'valid_originalname',
        encoding: 'valid_encoding',
        mimetype: 'valid_mimetype',
        size: 100,
        destination: 'valid_destination',
        filename: 'valid_filename1',
        path: 'valid_path',
        buffer: Buffer.from('valid_buffer'),
      },
      {
        fieldname: 'valid_fieldname',
        originalname: 'valid_originalname',
        encoding: 'valid_encoding',
        mimetype: 'valid_mimetype',
        size: 100,
        destination: 'valid_destination',
        filename: 'valid_filename2',
        path: 'valid_path',
        buffer: Buffer.from('valid_buffer'),
      }],
      query: {
        type: 'commodity',
      },
      iconMapper: [{ idx: 0, name: 'icon1' }, { idx: 1, name: 'icon2' }],
    };

    const response = await sut.exec(args);

    expect(response).toEqual([
      {
        name: 'icon1',
        iconUrl: 'any_url',
      },
      {
        name: 'icon2',
        iconUrl: 'any_url',
      },
    ]);
  });
});
