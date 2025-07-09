import { Readable } from 'node:stream';
import fs from 'node:fs';
import { transformService } from '../../src/services/transform';
import { Vector3 } from '../../src/typings';

jest.mock('node:fs');
const mockedFs = jest.mocked(fs);

describe('Transform Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly transform vector-like lines and keep other lines as is', async () => {
    const inputFileContent = [
      '# some comment',
      'v  1  2  3',
      'v  -1  -2  -3',
      'vt 0.5 0.5',
      'vn  0  1  0',
      'f 1/1/1 2/2/1 3/3/1',
    ].join('\n');

    const scale: Vector3 = { x: 2, y: 3, z: 4 };
    const offset: Vector3 = { x: 1, y: 1, z: 1 };
    const expectedOutputContent = [
      '# some comment\n',
      'v  3  7  13\n',
      'v  -1  -5  -11\n',
      'vt 0.5 0.5\n',
      'vn  1  4  1\n',
      'f 1/1/1 2/2/1 3/3/1\n',
    ].join('');

    const mockReadStream = Readable.from(inputFileContent);
    mockedFs.createReadStream.mockReturnValue(mockReadStream as fs.ReadStream);

    const generator = transformService.transform('dummy/path.obj', scale, offset);

    let result = '';
    for await (const chunk of generator) {
      result += chunk;
    }
    expect(result).toBe(expectedOutputContent);
    expect(mockedFs.createReadStream).toHaveBeenCalledWith('dummy/path.obj');
  });

  it('should handle an empty file', async () => {
    const inputFileContent = '';
    const scale: Vector3 = { x: 1, y: 1, z: 1 };
    const offset: Vector3 = { x: 0, y: 0, z: 0 };

    const mockReadStream = Readable.from(inputFileContent);
    mockedFs.createReadStream.mockReturnValue(mockReadStream as fs.ReadStream);
    const generator = transformService.transform('dummy/empty.obj', scale, offset);
    let result = '';
    for await (const chunk of generator) {
      result += chunk;
    }
    expect(result).toBe('');
  });
});