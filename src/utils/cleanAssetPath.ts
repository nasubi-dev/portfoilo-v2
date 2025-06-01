/**
 * Obsidian形式の画像パス（![[image.webp]]）を通常のパス（image.webp）に変換する
 */
const cleanAssetPath = (imagePath: string): string => {
  return imagePath.replace(/!\[\[/g, "").replace(/\]\]/g, "");
};

export default cleanAssetPath;
