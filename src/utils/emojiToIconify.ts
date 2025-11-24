/**
 * 絵文字をIconifyのTwemoji名に変換する
 * 絵文字のUnicodeコードポイントを16進数に変換してIconifyの命名規則に従う
 *
 * 例: 🍆 -> "twemoji:eggplant"
 *      ⭐ -> "twemoji:star"
 *
 * @param emoji - 変換する絵文字文字列
 * @returns Iconifyのアイコン名（pack:name形式）
 */
export function emojiToIconify(emoji: string | null): string {
  if (!emoji) {
    return "twemoji:eggplant"; // デフォルト: 🍆
  }

  // 絵文字の最初の文字を取得（複数の絵文字が含まれている場合は最初のものを使用）
  const char = [...emoji][0];

  // UnicodeコードポイントをIconifyのTwemoji命名規則に変換
  // 例: U+1F346 (🍆) -> "1f346"
  const codePoints = [];
  for (const c of char) {
    codePoints.push(c.codePointAt(0)?.toString(16));
  }

  const iconName = codePoints.filter(Boolean).join("-");
  return `twemoji:${iconName}`;
}
