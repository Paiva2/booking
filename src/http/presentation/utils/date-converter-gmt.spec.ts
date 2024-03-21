import { describe, expect, test } from 'vitest';
import { dateConverterGmt } from '.';

describe('dateConverterGmt', () => {
  test('should convert correctly a date to provided GMT -3', () => {
    const randomDate = '2024-03-21T10:00:00.304Z';
    const userState = 'SP';

    const dateConverted = dateConverterGmt(randomDate, userState);

    expect(dateConverted).toEqual('21/03/2024, 07:00:00');
  });

  test('should convert correctly a date to provided GMT -4', () => {
    const randomDate = '2024-03-21T10:00:00.304Z';
    const userState = 'AM';

    const dateConverted = dateConverterGmt(randomDate, userState);

    expect(dateConverted).toEqual('21/03/2024, 06:00:00');
  });
});
