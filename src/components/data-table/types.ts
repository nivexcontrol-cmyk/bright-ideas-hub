import * as React from "react";

export type SortDirection = "asc" | "desc" | null;

export interface DataTableColumn<T> {
  /** Chave estável da coluna. Usada em aria-sort e no controle interno de ordenação. */
  id: string;
  /** Cabeçalho exibido na tabela. */
  header: string;
  /** Rótulo curto usado no modo de cards (mobile). Se ausente, usa `header`. */
  mobileLabel?: string;
  /** Extrai o valor bruto para busca e ordenação. */
  accessor: (row: T) => string | number;
  /** Renderização customizada da célula. Se ausente, usa o valor de `accessor`. */
  cell?: (row: T) => React.ReactNode;
  /** Se true, permite ordenação por essa coluna. Padrão: true. */
  sortable?: boolean;
}

export interface DataTableRowAction<T> {
  /** Identificador estável usado como key. */
  id: string;
  /** Rótulo acessível do botão (usado como aria-label). */
  label: (row: T) => string;
  /** Texto visível do botão. */
  children: React.ReactNode;
  onClick: (row: T) => void;
}

export interface DataTableProps<T> {
  /** Legenda semântica (usada em <caption> visualmente oculto). */
  caption: string;
  columns: DataTableColumn<T>[];
  data: T[];
  /** Função que devolve a chave única de cada linha. */
  getRowId: (row: T) => string;
  /** Ativa a busca textual local. Padrão: true. */
  searchable?: boolean;
  /** Placeholder do campo de busca. */
  searchPlaceholder?: string;
  /** Ações por linha (renderizadas na última coluna). */
  rowActions?: DataTableRowAction<T>[];
  /** Tamanho da página. Padrão: 10. */
  pageSize?: number;
  /** Componente exibido quando não há registros após filtro/base. */
  emptyState?: React.ReactNode;
  /** Prefixo de ids de teste; útil para múltiplas tabelas na mesma página. */
  testIdPrefix?: string;
}
