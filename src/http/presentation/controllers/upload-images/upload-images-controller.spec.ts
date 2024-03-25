import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { UploadImagesController } from './upload-images-controller';
import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';

const makeUploadImagesServiceStub = () => {
  class UploadImagesServiceStub implements Service {
    async exec(dto: any): Promise<any> {
      return ['imageUrl1', 'imageUrl2'];
    }
  }

  return new UploadImagesServiceStub();
};

interface SutTypes {
  sut: UploadImagesController,
  uploadImagesServiceStub: Service
}

const makeSut = (): SutTypes => {
  const uploadImagesServiceStub = makeUploadImagesServiceStub();
  const sut = new UploadImagesController(uploadImagesServiceStub);

  return {
    sut,
    uploadImagesServiceStub,
  };
};

let sutFactory: SutTypes;

describe('UploadImagesController', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT handle method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const request = {
      files: 'valid_array_of_files',
      query: 'valid_queries',
      body: {
        iconMapper: 'valid_icon_mapper',
      },
    };

    await sut.handle(request);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(request);
  });

  test('Should call SUT dtoCheck method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'dtoCheck');

    const request = {
      files: 'valid_array_of_files',
      query: 'valid_queries',
      body: {
        iconMapper: 'valid_icon_mapper',
      },
    };

    await sut.handle(request);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith({
      files: request.files,
      query: request.query,
      iconMapper: request.body.iconMapper,
    });
  });

  test('Should throw exception if files is not provided', async () => {
    const { sut } = sutFactory;

    const request = {
      files: '',
      query: 'valid_queries',
      body: {
        iconMapper: 'valid_icon_mapper',
      },
    };

    const expectedException = new MissingParamException('files');

    await expect(() => sut.handle(request)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if query type is commodity and iconMapper is not provided', async () => {
    const { sut } = sutFactory;

    const request = {
      files: 'valid_array_of_files',
      query: {
        type: 'commodity',
      },
      body: {
        iconMapper: '',
      },
    };

    const expectedException = new MissingParamException('iconMapper');

    await expect(() => sut.handle(request)).rejects.toStrictEqual(expectedException);
  });

  test('Should parse iconMapper if provided query type is commodity', async () => {
    const { sut, uploadImagesServiceStub } = sutFactory;

    const spyService = vi.spyOn(uploadImagesServiceStub, 'exec');

    const request = {
      files: 'valid_array_of_files',
      query: {
        type: 'commodity',
      },
      body: {
        iconMapper: JSON.stringify([{ idx: 0, name: 'icon' }]),
      },
    };

    await sut.handle(request);

    expect(spyService).toHaveBeenCalledWith(expect.objectContaining(
      { iconMapper: JSON.parse(request.body.iconMapper) },
    ));
  });

  test('Should call Service exec method with correct provided params no iconMapper', async () => {
    const { sut, uploadImagesServiceStub } = sutFactory;

    const spyService = vi.spyOn(uploadImagesServiceStub, 'exec');

    const request = {
      files: 'valid_array_of_files',
      query: {
        type: 'normal',
      },
      body: {
        iconMapper: null,
      },
    };

    await sut.handle(request);

    expect(spyService).toHaveBeenCalledWith({
      files: request.files,
      query: request.query,
      iconMapper: null,
    });
  });

  test('Should call Service exec method with correct provided params with iconMapper', async () => {
    const { sut, uploadImagesServiceStub } = sutFactory;

    const spyService = vi.spyOn(uploadImagesServiceStub, 'exec');

    const request = {
      files: 'valid_array_of_files',
      query: {
        type: 'commodity',
      },
      body: {
        iconMapper: JSON.stringify([{ idx: 0, name: 'icon' }]),
      },
    };

    await sut.handle(request);

    expect(spyService).toHaveBeenCalledWith({
      files: request.files,
      query: request.query,
      iconMapper: JSON.parse(request.body.iconMapper),
    });
  });

  test('Should return 201 and uploaded urls if nothing goes wrong - No iconMapper', async () => {
    const { sut } = sutFactory;

    const request = {
      files: 'valid_array_of_files',
      query: {
        type: 'normal',
      },
      body: {
        iconMapper: '',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      status: 201,
      data: ['imageUrl1', 'imageUrl2'],
    });
  });

  test('Should return 201 and uploaded urls if nothing goes wrong - with iconMapper', async () => {
    const { sut, uploadImagesServiceStub } = sutFactory;

    vi.spyOn(uploadImagesServiceStub, 'exec').mockReturnValueOnce(
      Promise.resolve([{
        name: 'icon1',
        iconUrl: 'iconUrl1',
      }, {
        name: 'icon1',
        iconUrl: 'iconUrl1',
      }]),
    );

    const request = {
      files: 'valid_array_of_files',
      query: {
        type: 'normal',
      },
      body: {
        iconMapper: JSON.stringify([{ idx: 0, name: 'icon' }]),
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      status: 201,
      data: [{
        name: 'icon1',
        iconUrl: 'iconUrl1',
      }, {
        name: 'icon1',
        iconUrl: 'iconUrl1',
      }],
    });
  });
});
