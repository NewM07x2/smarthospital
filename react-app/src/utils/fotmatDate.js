/**
 * ISO 8601形式の日付文字列を 'YYYY/MM/DD' 形式にフォーマットします。
 * @param {string} isoString - '2025-10-08T00:00:00.000000Z' のようなISO形式の文字列。
 * @returns {string} - 'YYYY/MM/DD' 形式の文字列。
 */
export const formatDate = (isoString) => {
    if (!isoString) return '';

    // ISO 8601形式の文字列をDateオブジェクトに変換
    // Z (UTC) を含んでいるため、現地時間に変換されずに正確な日付を取得できる
    const date = new Date(isoString);
    
    // YYYY (年) を取得
    const year = date.getFullYear();
    // MM (月) を取得 (getMonth() は 0から始まるため +1)
    const month = String(date.getMonth() + 1).padStart(2, '0');
    // DD (日) を取得
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
};
