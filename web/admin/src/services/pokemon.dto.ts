export type GetPokemonEggParams = undefined;
export type PokemonEggDto = string[];

//
export type GetPokemonListParams = {
  pageNum: number;
  pageSize: number;
};

//
export type PokemonListDto = {
  id: string;
  name: string;
  pic: string;
  cryUrl: string;
  nature: string;
  type: string;
  character: string;
  desc: string;
};
