const statesGmt = {
  AC: '-03', // Acre
  AL: '-03', // Alagoas
  AP: '-03', // Amapá
  AM: '-04', // Amazonas
  BA: '-03', // Bahia
  CE: '-03', // Ceará
  DF: '-03', // Distrito Federal
  ES: '-03', // Espírito Santo
  GO: '-03', // Goiás
  MA: '-03', // Maranhão
  MT: '-04', // Mato Grosso
  MS: '-04', // Mato Grosso do Sul
  MG: '-03', // Minas Gerais
  PA: '-03', // Pará
  PB: '-03', // Paraíba
  PR: '-03', // Paraná
  PE: '-03', // Pernambuco
  PI: '-03', // Piauí
  RJ: '-03', // Rio de Janeiro
  RN: '-03', // Rio Grande do Norte
  RS: '-03', // Rio Grande do Sul
  RO: '-04', // Rondônia
  RR: '-04', // Roraima
  SC: '-03', // Santa Catarina
  SP: '-03', // São Paulo
  SE: '-03', // Sergipe
  TO: '-03', // Tocantins
};

export function dateConverterGmt(originalDate: string, state: string) {
  const date = new Date(originalDate);

  const adjustedDate = new Date(
    date.getTime()
  + Number(statesGmt[state as keyof typeof statesGmt])
  * 60 * 60 * 1000,
  );

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  const formattedDate = formatter.format(adjustedDate);

  return formattedDate;
}
