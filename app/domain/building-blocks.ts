export type Primitive<Tag extends string, T> = T & { readonly __brand: Tag }

export type Result<T, E> = Ok<T> | Err<E>
export type Ok<T> = { readonly ok: true; readonly value: T }
export type Err<E> = { readonly ok: false; readonly error: E }
export type AsyncResult<T, E> = Promise<Result<T, E>>
export const ok = <T>(value: T): Ok<T> => ({ ok: true, value })
export const err = <E>(error: E): Err<E> => ({ ok: false, error })

/** ワークフローの状態を、同じ形の別の型と区別する。（例: 検証済みの入力） */
declare const state: unique symbol
export type State<Tag extends string, T> = T & { readonly [state]: Tag }

/** 
 * 少なくとも1つの要素を持つ配列
 * 失敗の理由の一覧に使い、「理由のない失敗」を型で作れなくする。
 */
export type NonEmptyArray<T> = readonly [T, ...T[]]
