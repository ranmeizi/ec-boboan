import axois from "@/utils/Request/mock";
import * as PokemonDto from "./pokemon.dto";

export async function getPokemonEgg(): Res.data<PokemonDto.PokemonEggDto> {
  try {
    const res = await axois.get("/pokemon/egg.json");
    return res.data.data;
  } catch (e) {
    return [];
  }
}

export async function getPokemonList(
  params: PokemonDto.GetPokemonEggParams
): Res.page<PokemonDto.PokemonListDto> {
  try {
    const res = await axois.get("/pokemon/list.json", { params });
    return res.data.data;
  } catch (e) {
    return {
      list: [],
      total: 0,
      pageSize: 0,
      pageNumber: 0,
    };
  }
}

export { PokemonDto as dto };
