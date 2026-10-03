/** Formato que o painel recebe da API. */

export interface AdminPhoto {
  file: string;
  alt: string;
  /** Caminho público no site, para mostrar a miniatura. */
  src: string;
  bytes: number;
}

export interface AdminProject {
  id: string;
  nome: string;
  tipo: string;
  photos: AdminPhoto[];
}

export interface ErroDaApi {
  erro?: string;
}
