// =============================================
// TRANSLATIONS — Từ điển đa ngôn ngữ
// =============================================

// ── Menu ──
export const translations = {
  vi: {
    subtitle:   'TRÒ CHƠI CHIẾN LƯỢC CỔ XƯA',
    playNew:    '▶ Chơi Mới',
    history:    '📁 Lịch Sử Đấu',
    tutorial:   '📖 Hướng Dẫn',
    stats:      '📊 Thống Kê',
    howtoTitle: 'CÁCH CHƠI',
    howtoLine1: 'Lấy bất kỳ số que từ ',
    howtoEm:    'một hàng',
    howtoLine2: '. Người lấy que ',
    howtoStrong:'cuối cùng thắng',
    howtoEnd:   '.',
    version:    'NIM v1.0 · Niên Luận Cơ Sở',
  },
  en: {
    subtitle:   'THE ANCIENT STRATEGY GAME',
    playNew:    '▶ New Game',
    history:    '📁 Match History',
    tutorial:   '📖 How To Play',
    stats:      '📊 Statistics',
    howtoTitle: 'HOW TO PLAY',
    howtoLine1: 'Remove any number of sticks from ',
    howtoEm:    'one row',
    howtoLine2: '. The player who takes the ',
    howtoStrong:'last stick wins',
    howtoEnd:   '.',
    version:    'NIM v1.0 · Capstone Project',
  },
};

export const getText = (lang = 'vi') => translations[lang] || translations.vi;

// ── Tutorial ──
export const TUTORIAL_STEPS = {
  vi: [
    {
      id:    1,
      icon:  '🎯',
      title: 'NIM là gì?',
      content: `NIM là một trò chơi chiến thuật cổ xưa có từ hàng nghìn năm trước.
        Hai người chơi thay nhau lấy que từ các hàng. Người lấy que cuối cùng sẽ thắng.
        Nghe đơn giản — nhưng ẩn chứa một lý thuyết toán học cực kỳ thú vị!`,
      demo: null,
    },
    {
      id:    2,
      icon:  '📜',
      title: 'Luật chơi cơ bản',
      content: null,
      rules: [
        { icon: '1️⃣', text: 'Mỗi lượt, người chơi chọn MỘT hàng bất kỳ' },
        { icon: '2️⃣', text: 'Lấy ít nhất 1 que, có thể lấy tất cả que trong hàng đó' },
        { icon: '3️⃣', text: 'Không được bỏ lượt và không được lấy từ 2 hàng cùng lúc' },
        { icon: '🏆', text: 'Người lấy que CUỐI CÙNG là người THẮNG' },
        { icon: '🔀', text: 'Biến thể Misère: người lấy que cuối THUA' },
      ],
    },
    {
      id:    3,
      icon:  '🧮',
      title: 'Lý thuyết Nim-Sum',
      content: `Chìa khóa để luôn thắng là tính NIM-SUM — phép XOR (hoặc loại trừ) 
        của tất cả các hàng. Nếu Nim-Sum ≠ 0 sau lượt đi của bạn, bạn đang ở thế THẮNG.
        Nếu Nim-Sum = 0, bạn đang ở thế THUA.`,
      example: {
        piles:   [3, 5, 7],
        binary: [
          { val: 3, bin: '011' },
          { val: 5, bin: '101' },
          { val: 7, bin: '111' },
        ],
        xorResult: { val: 1, bin: '001' },
        rowLabel: 'Hàng',
      },
    },
    {
      id:    4,
      icon:  '♟️',
      title: 'Chiến thuật thắng',
      content: `Khi Nim-Sum ≠ 0, luôn tồn tại một nước đi giúp bạn đưa Nim-Sum về 0.
        Đối thủ dù đi thế nào cũng sẽ làm Nim-Sum ≠ 0 trở lại — và bạn lại
        có thể đưa về 0. Cứ thế cho đến khi tất cả hàng trống.`,
      strategy: [
        { step: 'Tính Nim-Sum của tất cả hàng bằng XOR',        good: true  },
        { step: 'Nếu Nim-Sum = 0: đi bất kỳ, chờ đối thủ sai', good: false },
        { step: 'Nếu Nim-Sum ≠ 0: tìm hàng để đưa Nim-Sum = 0', good: true  },
        { step: 'Sau nước đi của bạn, Nim-Sum luôn = 0',         good: true  },
      ],
    },
    {
      id:    5,
      icon:  '💡',
      title: 'Ví dụ thực tế',
      content: `Giả sử có 3 hàng: [1, 3, 5]. Nim-Sum = 1 XOR 3 XOR 5 = 7 ≠ 0.
        Bạn cần lấy từ hàng nào đó để Nim-Sum = 0. 
        Thử hàng 3 (có 5 que): 5 XOR 7 = 2 — cần giữ lại 2 que, lấy đi 3 que.
        Kiểm tra: 1 XOR 3 XOR 2 = 0 ✅`,
      tip: 'Dùng nút 💡 Gợi ý trong game để xem nước đi tối ưu bất cứ lúc nào!',
    },
  ],
  en: [
    {
      id:    1,
      icon:  '🎯',
      title: 'What is NIM?',
      content: `NIM is an ancient strategy game dating back thousands of years.
        Two players take turns removing sticks from rows. The player who takes the last stick wins.
        Sounds simple — but it hides a fascinating piece of mathematical theory!`,
      demo: null,
    },
    {
      id:    2,
      icon:  '📜',
      title: 'Basic Rules',
      content: null,
      rules: [
        { icon: '1️⃣', text: 'On each turn, a player picks ONE row' },
        { icon: '2️⃣', text: 'Remove at least 1 stick, up to the entire row' },
        { icon: '3️⃣', text: 'You cannot skip a turn or take from two rows at once' },
        { icon: '🏆', text: 'The player who takes the LAST stick WINS' },
        { icon: '🔀', text: 'Misère variant: taking the last stick means you LOSE' },
      ],
    },
    {
      id:    3,
      icon:  '🧮',
      title: 'Nim-Sum Theory',
      content: `The key to always winning is calculating the NIM-SUM — the XOR operation
        across all rows. If Nim-Sum ≠ 0 after your move, you are in a WINNING position.
        If Nim-Sum = 0, you are in a LOSING position.`,
      example: {
        piles:   [3, 5, 7],
        binary: [
          { val: 3, bin: '011' },
          { val: 5, bin: '101' },
          { val: 7, bin: '111' },
        ],
        xorResult: { val: 1, bin: '001' },
        rowLabel: 'Row',
      },
    },
    {
      id:    4,
      icon:  '♟️',
      title: 'Winning Strategy',
      content: `When Nim-Sum ≠ 0, there is always a move that brings Nim-Sum back to 0.
        No matter what your opponent does, they will make Nim-Sum ≠ 0 again — and you
        can bring it back to 0. This repeats until all rows are empty.`,
      strategy: [
        { step: 'Calculate the Nim-Sum of all rows using XOR',         good: true  },
        { step: 'If Nim-Sum = 0: play anything, wait for a mistake',   good: false },
        { step: 'If Nim-Sum ≠ 0: find a row to bring Nim-Sum to 0',    good: true  },
        { step: 'After your move, Nim-Sum is always 0',                 good: true  },
      ],
    },
    {
      id:    5,
      icon:  '💡',
      title: 'A Real Example',
      content: `Suppose there are 3 rows: [1, 3, 5]. Nim-Sum = 1 XOR 3 XOR 5 = 7 ≠ 0.
        You need to take from a row to bring Nim-Sum to 0.
        Try row 3 (5 sticks): 5 XOR 7 = 2 — keep 2 sticks, remove 3.
        Check: 1 XOR 3 XOR 2 = 0 ✅`,
      tip: 'Use the 💡 Hint button in-game to see the optimal move at any time!',
    },
  ],
};

export const getTutorialSteps = (lang = 'vi') => TUTORIAL_STEPS[lang] || TUTORIAL_STEPS.vi;

export const TUTORIAL_UI = {
  vi: {
    back:      '← Quay lại',
    title:     'HƯỚNG DẪN CHƠI',
    prev:      '← Trước',
    next:      'Tiếp →',
    start:     '▶ Bắt đầu chơi!',
    rowLabel:  'Hàng',
    valueCol:  'Giá trị',
    binCol:    'Nhị phân',
    xorLabel:  'XOR',
    nimSumWin: ' ≠ 0 → Có nước đi thắng! ✅',
    nimSumLose:' = 0 → Đang ở thế thua ⚠️',
  },
  en: {
    back:      '← Back',
    title:     'HOW TO PLAY',
    prev:      '← Prev',
    next:      'Next →',
    start:     '▶ Start Playing!',
    rowLabel:  'Row',
    valueCol:  'Value',
    binCol:    'Binary',
    xorLabel:  'XOR',
    nimSumWin: ' ≠ 0 → Winning move exists! ✅',
    nimSumLose:' = 0 → You are losing ⚠️',
  },
};

export const getTutorialUI = (lang = 'vi') => TUTORIAL_UI[lang] || TUTORIAL_UI.vi;

// ── Setup Page ──
export const SETUP_UI = {
  vi: {
    menu:            '🏠 Menu',
    title:           'THIẾT LẬP GAME',
    historyBtn:       '📁 Lịch Sử Đấu',
    themeLabel:       'Chủ đề',
    gameMode:         '⚔ CHẾ ĐỘ CHƠI',
    modePvp:          'Người vs Người',
    modePvc:          'Người vs Máy',
    modeAivai:        'Máy vs Máy',
    playerNames:      '👤 TÊN NGƯỜI CHƠI',
    you:              'Bạn',
    ai:               'AI',
    aiDifficulty:     '🧠 ĐỘ KHÓ AI',
    botConfig:        '🤖 CẤU HÌNH HAI BOT',
    bot1:             '◆ Bot 1',
    bot2:             '◆ Bot 2',
    nameLabel:        'Tên',
    difficultyLabel:  'Độ khó',
    diffEasy:         'Dễ',
    diffMedium:       'Vừa',
    diffHard:         'Khó',
    variant:          '🔀 BIẾN THỂ',
    misereLabel1:     'Misère — que cuối ',
    misereStrong:     'thua',
    countdownTitle:   '⏱ ĐẾM NGƯỢC',
    countdownLabel:   'Giới hạn thời gian/lượt',
    pilesConfig:      '🪵 CẤU HÌNH HÀNG QUE',
    randomBtn:        '🎲 Ngẫu nhiên',
    rowLabel:         'Hàng',
    addRow:           '+ Thêm hàng',
    resumeBtn:        '↩ Quay Lại Trận (Lượt #',
    startBtn:         '▶ BẮT ĐẦU GAME',
    confirmTitle:     '⚠️ Bắt đầu ván mới?',
    confirmDesc1:     'Bạn đang có một trận chưa kết thúc (Lượt #',
    confirmDesc2:     '). Bắt đầu ván mới sẽ ',
    confirmDescStrong:'hủy tiến trình hiện tại',
    confirmDescEnd:   ' nếu chưa lưu.',
    cancel:           'Hủy',
    confirmNewGame:   '▶ Bắt Đầu Ván Mới',
    presets: {
      classic:  'Tiêu Chuẩn',
      easy:     'Người Mới',
      advanced: 'Nâng Cao',
      chaos:    'Hỗn Loạn',
    },
  },
  en: {
    menu:            '🏠 Menu',
    title:           'GAME SETUP',
    historyBtn:       '📁 Match History',
    themeLabel:       'Theme',
    gameMode:         '⚔ GAME MODE',
    modePvp:          'Player vs Player',
    modePvc:          'Player vs AI',
    modeAivai:        'AI vs AI',
    playerNames:      '👤 PLAYER NAMES',
    you:              'You',
    ai:               'AI',
    aiDifficulty:     '🧠 AI DIFFICULTY',
    botConfig:        '🤖 BOT CONFIGURATION',
    bot1:             '◆ Bot 1',
    bot2:             '◆ Bot 2',
    nameLabel:        'Name',
    difficultyLabel:  'Difficulty',
    diffEasy:         'Easy',
    diffMedium:       'Medium',
    diffHard:         'Hard',
    variant:          '🔀 VARIANT',
    misereLabel1:     'Misère — last stick ',
    misereStrong:     'loses',
    countdownTitle:   '⏱ COUNTDOWN',
    countdownLabel:   'Limit time per turn',
    pilesConfig:      '🪵 PILE CONFIGURATION',
    randomBtn:        '🎲 Randomize',
    rowLabel:         'Row',
    addRow:           '+ Add Row',
    resumeBtn:        '↩ Resume Match (Turn #',
    startBtn:         '▶ START GAME',
    confirmTitle:     '⚠️ Start a new game?',
    confirmDesc1:     'You have an unfinished match (Turn #',
    confirmDesc2:     '). Starting a new game will ',
    confirmDescStrong:'discard current progress',
    confirmDescEnd:   ' if not saved.',
    cancel:           'Cancel',
    confirmNewGame:   '▶ Start New Game',
    presets: {
      classic:  'Classic 3-5-7',
      easy:     'Easy Start',
      advanced: 'Advanced',
      chaos:    'Chaos Mode',
    },
  },
};

export const getSetupUI = (lang = 'vi') => SETUP_UI[lang] || SETUP_UI.vi;

// ── Game Page ──
export const GAME_UI = {
  vi: {
    menu:          '🏠 Menu',
    setup:         '← Thiết lập',
    modePvp:       'Người vs Người',
    modePvcPrefix: 'vs AI · ',
    modeAivai:     '🤖 Máy vs Máy',
    misereBadge:   'Misère',
    turnLabel:     'Lượt #',
    save:          '💾 Lưu',
    historyBtn:    '📁 Lịch sử',
    undo:          '↩ Undo',
    saveTitle:     '💾 Đặt tên cho ván',
    saveCancel:    'Hủy',
    saveConfirm:   '💾 Lưu',
    thinking:      ' đang suy nghĩ...',
    turnOf:        'Lượt của',
    nimSumTitle:   'Nim-Sum (XOR)',
    nimSumLose:    '⚠️ Thế thua — không có nước thắng',
    nimSumWin:     '✅ Có nước đi thắng tồn tại',
    hint:          '💡 Gợi ý',
    restart:       '↺ Chơi lại',
    newMatch:      '↺ Ván mới',
    savedToast:    'Đã lưu ván!',
    saveFailToast: 'Lưu thất bại!',
    undoToast:     'Đã hoàn tác nước đi',
    themeToast:    'Đã đổi chủ đề!',
    continueToast: 'Đã tải ván!',
    hintLose:      '⚠️ Bạn đang ở thế thua! Hãy cầu đối thủ mắc sai lầm.',
    hintWinPrefix: '💡 Gợi ý: Lấy',
    hintWinMid:    'que từ hàng',
    you:           'Bạn',
    aiDefaultName: 'Máy',
  },
  en: {
    menu:          '🏠 Menu',
    setup:         '← Setup',
    modePvp:       'Player vs Player',
    modePvcPrefix: 'vs AI · ',
    modeAivai:     '🤖 AI vs AI',
    misereBadge:   'Misère',
    turnLabel:     'Turn #',
    save:          '💾 Save',
    historyBtn:    '📁 History',
    undo:          '↩ Undo',
    saveTitle:     '💾 Name this save',
    saveCancel:    'Cancel',
    saveConfirm:   '💾 Save',
    thinking:      ' is thinking...',
    turnOf:        "Turn:",
    nimSumTitle:   'Nim-Sum (XOR)',
    nimSumLose:    '⚠️ Losing position — no winning move',
    nimSumWin:     '✅ A winning move exists',
    hint:          '💡 Hint',
    restart:       '↺ Restart',
    newMatch:      '↺ New Match',
    savedToast:    'Game saved!',
    saveFailToast: 'Save failed!',
    undoToast:     'Move undone',
    themeToast:    'Theme changed!',
    continueToast: 'Game loaded!',
    hintLose:      "⚠️ You're in a losing position! Hope your opponent makes a mistake.",
    hintWinPrefix: '💡 Hint: Take',
    hintWinMid:    'sticks from row',
    you:           'You',
    aiDefaultName: 'AI',
  },
};

export const getGameUI = (lang = 'vi') => GAME_UI[lang] || GAME_UI.vi;

// ── AI vs AI Controls ──
export const AIVAI_UI = {
  vi: {
    title:      '🤖 AI vs AI',
    movesDone:  'nước đã đi',
    speedLabel: 'Tốc độ:',
    speedSlow:  '🐢 Chậm',
    speedNormal:'▶ Bình thường',
    speedFast:  '⚡ Nhanh',
    pause:      '⏸ Tạm dừng',
    play:       '▶ Tự chơi',
    step:       '⏭ Từng bước',
    reset:      '↺ Reset',
    note:       'Quan sát AI áp dụng thuật toán Sprague-Grundy để học chiến thuật tối ưu',
  },
  en: {
    title:      '🤖 AI vs AI',
    movesDone:  'moves played',
    speedLabel: 'Speed:',
    speedSlow:  '🐢 Slow',
    speedNormal:'▶ Normal',
    speedFast:  '⚡ Fast',
    pause:      '⏸ Pause',
    play:       '▶ Auto Play',
    step:       '⏭ Step',
    reset:      '↺ Reset',
    note:       'Watch the AI apply the Sprague-Grundy algorithm to learn optimal strategy',
  },
};

export const getAivaiUI = (lang = 'vi') => AIVAI_UI[lang] || AIVAI_UI.vi;

// ── History Modal ──
export const HISTORY_UI = {
  vi: {
    title:        '📁 Lịch Sử Đấu',
    clearAll:     '🗑 Xóa tất cả',
    confirmClear: '⚠ Xác nhận?',
    filterAll:    'Tất cả',
    filterInProgress: '🔄 Đã lưu',
    filterFinished:   '✅ Đã xong',
    emptyTitle:   'Chưa có ván nào',
    emptyInProgress: 'Ấn 💾 trong game để lưu ván đang dở',
    emptyFinished:   'Chơi xong một ván sẽ tự động lưu vào đây',
    badgeInProgress: '🔄 Đang dở',
    badgeFinished:   '✅ Đã xong',
    turnLabel:    'Lượt',
    won:          'thắng',
    timeout:      '⏱ Hết giờ',
    turns:        'lượt',
    continueBtn:  '▶ Tiếp tục',
    replayBtn:    '↺ Chơi lại',
    modePvp:      '👥 PvP',
    modePvc:      '🤖 vs AI',
    modeAivai:    '🤖🤖 AI vs AI',
    you:          '👤 Bạn',
    ai:           '🤖 Máy',
    bot1:         'Bot 1',
    bot2:         'Bot 2',
  },
  en: {
    title:        '📁 Match History',
    clearAll:     '🗑 Clear All',
    confirmClear: '⚠ Confirm?',
    filterAll:    'All',
    filterInProgress: '🔄 Saved',
    filterFinished:   '✅ Finished',
    emptyTitle:   'No matches yet',
    emptyInProgress: 'Press 💾 in-game to save an in-progress match',
    emptyFinished:   'Finishing a match will save it here automatically',
    badgeInProgress: '🔄 In Progress',
    badgeFinished:   '✅ Finished',
    turnLabel:    'Turn',
    won:          'won',
    timeout:      '⏱ Timeout',
    turns:        'turns',
    continueBtn:  '▶ Continue',
    replayBtn:    '↺ Replay',
    modePvp:      '👥 PvP',
    modePvc:      '🤖 vs AI',
    modeAivai:    '🤖🤖 AI vs AI',
    you:          '👤 You',
    ai:           '🤖 AI',
    bot1:         'Bot 1',
    bot2:         'Bot 2',
  },
};

export const getHistoryUI = (lang = 'vi') => HISTORY_UI[lang] || HISTORY_UI.vi;

// ── Theme labels ──
export const THEME_LABELS = {
  vi: {
    default:   '🎮 Mặc định',
    christmas: '🎄 Giáng Sinh',
    halloween: '🎃 Halloween',
    summer:    '☀️ Mùa Hè',
  },
  en: {
    default:   '🎮 Default',
    christmas: '🎄 Christmas',
    halloween: '🎃 Halloween',
    summer:    '☀️ Summer',
  },
};

export const getThemeLabel = (themeKey, lang = 'vi') =>
  (THEME_LABELS[lang] || THEME_LABELS.vi)[themeKey] || themeKey;

// ── Theme Selector UI ──
export const THEME_SELECTOR_UI = {
  vi: { themeLabel: '🎨 Chủ đề' },
  en: { themeLabel: '🎨 Theme'  },
};

export const getThemeSelectorUI = (lang = 'vi') => THEME_SELECTOR_UI[lang] || THEME_SELECTOR_UI.vi;

// ── GameOverModal ──
export const GAMEOVER_UI = {
  vi: {
    aiWonLabel:     'MÁY THẮNG',
    botWonLabel:    'BOT THẮNG',
    humanWonLabel:  'NGƯỜI THẮNG',
    aiWonMsg:       'AI đã tính toán hoàn hảo! Thử lại nhé.',
    aivaiMsg1:      '',
    aivaiMsg2:      ' đã chiến thắng! Xem lại nước đi để học chiến thuật.',
    humanMsg1:      'Chúc mừng ',
    humanMsg2:      '! Chiến lược xuất sắc!',
    playAgain:      '↺ Chơi Lại',
    menu:           '⌂ Menu',
  },
  en: {
    aiWonLabel:     'AI WINS',
    botWonLabel:    'BOT WINS',
    humanWonLabel:  'WINNER',
    aiWonMsg:       'The AI calculated perfectly! Try again.',
    aivaiMsg1:      '',
    aivaiMsg2:      ' has won! Review the moves to learn the strategy.',
    humanMsg1:      'Congratulations ',
    humanMsg2:      '! Excellent strategy!',
    playAgain:      '↺ Play Again',
    menu:           '⌂ Menu',
  },
};

export const getGameOverUI = (lang = 'vi') => GAMEOVER_UI[lang] || GAMEOVER_UI.vi;

// ── Stats Page ──
export const STATS_UI = {
  vi: {
    back:           '← Quay lại',
    title:          'THỐNG KÊ',
    confirmClear:   '⚠️ Xác nhận xóa?',
    clearHistory:   '🗑 Xóa lịch sử',
    filterAll:      'Tất cả',
    filterPvp:      '👥 Người vs Người',
    filterPvc:      '🤖 vs Máy',
    filterAivai:    '🤖🤖 Máy vs Máy',
    gamesPlayed:    'Ván đã chơi',
    winRate:        'Tỉ lệ thắng',
    avgTurns:       'Lượt trung bình',
    avgTime:        'Thời gian TB',
    listHeader:     'LỊCH SỬ VÁN ĐÃ CHƠI',
    matchesSuffix:  'ván',
    emptyTitle:     'Chưa có ván nào được ghi lại',
    emptyNote:      'Chơi xong một ván sẽ tự động lưu vào đây',
    won:            'thắng',
    turnsSuffix:    'lượt',
    modePvp:        'Người vs Người',
    modePvc:        'vs Máy',
    modeAivai:      'Máy vs Máy',
    you:            '👤 Bạn',
    ai:             '🤖 Máy',
    bot1:           'Bot 1',
    bot2:           'Bot 2',
    p1:             '👤 P1',
    p2:             '👤 P2',
  },
  en: {
    back:           '← Back',
    title:          'STATISTICS',
    confirmClear:   '⚠️ Confirm delete?',
    clearHistory:   '🗑 Clear History',
    filterAll:      'All',
    filterPvp:      '👥 Player vs Player',
    filterPvc:      '🤖 vs AI',
    filterAivai:    '🤖🤖 AI vs AI',
    gamesPlayed:    'Games Played',
    winRate:        'Win Rate',
    avgTurns:       'Avg. Turns',
    avgTime:        'Avg. Time',
    listHeader:     'MATCH HISTORY',
    matchesSuffix:  'matches',
    emptyTitle:     'No matches recorded yet',
    emptyNote:      'Finishing a match will save it here automatically',
    won:            'won',
    turnsSuffix:    'turns',
    modePvp:        'Player vs Player',
    modePvc:        'vs AI',
    modeAivai:      'AI vs AI',
    you:            '👤 You',
    ai:             '🤖 AI',
    bot1:           'Bot 1',
    bot2:           'Bot 2',
    p1:             '👤 P1',
    p2:             '👤 P2',
  },
};

export const getStatsUI = (lang = 'vi') => STATS_UI[lang] || STATS_UI.vi;

// ── Move History ──
export const MOVEHISTORY_UI = {
  vi: {
    title:    'LỊCH SỬ NƯỚC ĐI',
    empty:    'Chưa có nước đi nào',
    took:     'lấy',
    fromRow:  'từ hàng',
  },
  en: {
    title:    'MOVE HISTORY',
    empty:    'No moves yet',
    took:     'took',
    fromRow:  'from row',
  },
};

export const getMoveHistoryUI = (lang = 'vi') => MOVEHISTORY_UI[lang] || MOVEHISTORY_UI.vi;

// ── Sound Settings ──
export const SOUND_UI = {
  vi: {
    panelTitle:    '🎵 ÂM THANH',
    soundLabel:    'Âm thanh',
    musicLabel:    'Nhạc',
    sfxLabel:      'Hiệu ứng',
    masterTitle:   'Toàn bộ âm thanh',
    masterDesc:    'Bật/tắt tất cả âm thanh',
    musicTitle:    'Nhạc nền',
    musicDesc:     'Nhạc theo từng chủ đề',
    sfxTitle:      'Hiệu ứng âm thanh',
    sfxDesc:       'Tiếng click, thắng, thua',
    popupTitle:    '🎵 Âm Thanh',
    triggerTooltip:'Cài đặt âm thanh',
  },
  en: {
    panelTitle:    '🎵 SOUND',
    soundLabel:    'Sound',
    musicLabel:    'Music',
    sfxLabel:      'Effects',
    masterTitle:   'All Sounds',
    masterDesc:    'Turn all sounds on/off',
    musicTitle:    'Background Music',
    musicDesc:     'Music per theme',
    sfxTitle:      'Sound Effects',
    sfxDesc:       'Click, win, lose sounds',
    popupTitle:    '🎵 Sound',
    triggerTooltip:'Sound settings',
  },
};

export const getSoundUI = (lang = 'vi') => SOUND_UI[lang] || SOUND_UI.vi;