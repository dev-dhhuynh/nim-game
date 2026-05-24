// =============================================
// THUẬT TOÁN CHÍNH CỦA GAME NIM
// =============================================

/**
 * Tính Nim-Sum = XOR tất cả các hàng
 * Ví dụ: piles = [3, 5, 7]
 * => 3 XOR 5 XOR 7 = 1
 */
export const calcNimSum = (piles) => {
  return piles.reduce((xor, n) => xor ^ n, 0);
};

/**
 * Kiểm tra game kết thúc chưa
 * Game kết thúc khi tất cả hàng đều = 0
 */
export const isGameOver = (piles) => {
  return piles.every((p) => p === 0);
};

/**
 * AI chọn nước đi NGẪU NHIÊN
 * Dùng khi AI đang ở thế thua (nimSum = 0)
 */
export const calcRandomMove = (piles) => {
  // Lọc ra những hàng còn que
  const nonEmpty = piles
    .map((count, i) => ({ count, i }))
    .filter(({ count }) => count > 0);

  if (nonEmpty.length === 0) return null;

  // Chọn ngẫu nhiên một hàng
  const { count, i } = nonEmpty[Math.floor(Math.random() * nonEmpty.length)];

  // Lấy ngẫu nhiên 1 đến hết que trong hàng đó
  const removeCount = Math.floor(Math.random() * count) + 1;

  return { pileIndex: i, removeCount };
};

/**
 * AI chọn nước đi TỐI ƯU theo lý thuyết Sprague-Grundy
 * Nguyên tắc: tìm hàng mà sau khi lấy sẽ làm nimSum = 0
 */
export const calcBestMove = (piles) => {
  const nimSum = calcNimSum(piles);

  // Nếu nimSum = 0 nghĩa là đang thua, đi ngẫu nhiên thôi
  if (nimSum === 0) {
    return calcRandomMove(piles);
  }

  // Duyệt từng hàng để tìm nước đi thắng
  for (let i = 0; i < piles.length; i++) {
    const target = piles[i] ^ nimSum; // số que cần giữ lại
    if (target < piles[i]) {
      return {
        pileIndex: i,
        removeCount: piles[i] - target, // số que cần lấy
        isOptimal: true,
      };
    }
  }

  return calcRandomMove(piles);
};

/**
 * AI đi theo từng MỨC ĐỘ KHÓ
 * easy:   80% ngẫu nhiên, 20% tối ưu
 * medium: 50% ngẫu nhiên, 50% tối ưu
 * hard:   100% tối ưu
 */
export const calcAIMove = (piles, difficulty = 'hard') => {
  if (difficulty === 'easy') {
    return Math.random() < 0.8
      ? calcRandomMove(piles)
      : calcBestMove(piles);
  }

  if (difficulty === 'medium') {
    return Math.random() < 0.5
      ? calcBestMove(piles)
      : calcRandomMove(piles);
  }

  // hard
  return calcBestMove(piles);
};

/**
 * Sinh trạng thái game NGẪU NHIÊN
 * minPiles, maxPiles: số hàng tối thiểu/tối đa
 * maxStones: số que tối đa mỗi hàng
 */
export const generateRandomPiles = (
  minPiles = 2,
  maxPiles = 5,
  maxStones = 12
) => {
  const numPiles =
    Math.floor(Math.random() * (maxPiles - minPiles + 1)) + minPiles;

  return Array.from(
    { length: numPiles },
    () => Math.floor(Math.random() * maxStones) + 1
  );
};

/**
 * Các cấu hình có sẵn (preset)
 */
export const PRESETS = {
  classic:  { piles: [3, 5, 7],        label: 'Classic 3-5-7' },
  easy:     { piles: [1, 3, 5],        label: 'Easy Start'    },
  advanced: { piles: [5, 7, 9, 11],    label: 'Advanced'      },
  chaos:    { piles: [2, 4, 6, 8, 10], label: 'Chaos Mode'    },
};

/**
 * Áp dụng nước đi, trả về piles mới
 */
export const applyMove = (piles, pileIndex, removeCount) => {
  const newPiles = [...piles];
  newPiles[pileIndex] = newPiles[pileIndex] - removeCount;
  return newPiles;
};

/**
 * Gợi ý nước đi cho người chơi
 */
export const getHint = (piles) => {
  const nimSum = calcNimSum(piles);

  if (nimSum === 0) {
    return {
      type: 'losing',
      message: '⚠️ Bạn đang ở thế thua! Hãy cầu đối thủ mắc sai lầm.',
    };
  }

  const move = calcBestMove(piles);
  return {
    type: 'winning',
    message: `💡 Gợi ý: Lấy ${move.removeCount} que từ hàng ${move.pileIndex + 1}`,
    move,
  };
};