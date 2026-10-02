export interface Question {
  id: number;
  category: 'knowledge' | 'gold';
  points: number;
  topic: string;
  question: string;
  mathFormula?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip?: string;
}

export const QUESTIONS_POOL: Question[] = [
  {
    id: 1,
    category: 'knowledge',
    points: 10,
    topic: 'Công thức cộng',
    question: 'Công thức cộng nào sau đây đối với hàm số sin là ĐÚNG?',
    mathFormula: '\\sin(a + b) = ?',
    options: [
      '\\sin(a + b) = \\sin a \\cos b + \\cos a \\sin b',
      '\\sin(a + b) = \\sin a \\cos b - \\cos a \\sin b',
      '\\sin(a + b) = \\cos a \\cos b - \\sin a \\sin b',
      '\\sin(a + b) = \\cos a \\cos b + \\sin a \\sin b'
    ],
    correctIndex: 0,
    explanation: 'Theo công thức cộng trong SGK Toán 11: $\\sin(a + b) = \\sin a \\cos b + \\cos a \\sin b$.',
    tip: 'Sin thì sin cos cos sin, dấu cùng một lối (+ vẫn là +).'
  },
  {
    id: 2,
    category: 'knowledge',
    points: 10,
    topic: 'Công thức cộng',
    question: 'Khai triển của biểu thức cos(a - b) là:',
    mathFormula: '\\cos(a - b) = ?',
    options: [
      '\\cos a \\cos b + \\sin a \\sin b',
      '\\cos a \\cos b - \\sin a \\sin b',
      '\\sin a \\cos b - \\cos a \\sin b',
      '\\sin a \\cos b + \\cos a \\sin b'
    ],
    correctIndex: 0,
    explanation: 'Công thức cộng cho cosin: $\\cos(a - b) = \\cos a \\cos b + \\sin a \\sin b$. Đối với hàm cosin, dấu ở hai vế đổi ngược nhau (dấu trừ thành dấu cộng).',
    tip: 'Cos thì cos cos sin sin, coi chừng đổi dấu!'
  },
  {
    id: 3,
    category: 'knowledge',
    points: 10,
    topic: 'Công thức nhân đôi',
    question: 'Khẳng định nào sau đây là SAI về công thức nhân đôi của cos 2a?',
    mathFormula: '\\cos 2a = ?',
    options: [
      '\\cos 2a = 2\\sin a \\cos a',
      '\\cos 2a = \\cos^2 a - \\sin^2 a',
      '\\cos 2a = 2\\cos^2 a - 1',
      '\\cos 2a = 1 - 2\\sin^2 a'
    ],
    correctIndex: 0,
    explanation: '$2\\sin a \\cos a$ là công thức của $\\sin 2a$, KHÔNG PHẢI $\\cos 2a$! Ba dạng đúng của $\\cos 2a$ là: $\\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a$.',
    tip: 'sin 2a = 2 sin a cos a, còn cos 2a có 3 dạng biến đổi.'
  },
  {
    id: 4,
    category: 'knowledge',
    points: 10,
    topic: 'Công thức hạ bậc',
    question: 'Công thức hạ bậc đúng đối với cos² a là:',
    mathFormula: '\\cos^2 a = ?',
    options: [
      '\\cos^2 a = \\frac{1 + \\cos 2a}{2}',
      '\\cos^2 a = \\frac{1 - \\cos 2a}{2}',
      '\\cos^2 a = \\frac{1 + \\sin 2a}{2}',
      '\\cos^2 a = 1 - \\cos 2a'
    ],
    correctIndex: 0,
    explanation: 'Từ $\\cos 2a = 2\\cos^2 a - 1$ ta rút ra công thức hạ bậc: $\\cos^2 a = \\frac{1 + \\cos 2a}{2}$. Còn đối với $\\sin^2 a = \\frac{1 - \\cos 2a}{2}$.',
    tip: 'Cos bình mang dấu cộng (1 + cos 2a)/2, Sin bình mang dấu trừ (1 - cos 2a)/2.'
  },
  {
    id: 5,
    category: 'knowledge',
    points: 10,
    topic: 'Biến đổi tích thành tổng',
    question: 'Chọn đẳng thức ĐÚNG trong các công thức biến đổi tích thành tổng sau:',
    mathFormula: '\\cos a \\cos b = ?',
    options: [
      '\\cos a \\cos b = \\frac{1}{2}[\\cos(a - b) + \\cos(a + b)]',
      '\\cos a \\cos b = \\frac{1}{2}[\\cos(a - b) - \\cos(a + b)]',
      '\\cos a \\cos b = \\frac{1}{2}[\\sin(a + b) + \\sin(a - b)]',
      '\\cos a \\cos b = \\cos(a - b) + \\cos(a + b)'
    ],
    correctIndex: 0,
    explanation: 'Công thức biến đổi tích thành tổng: $\\cos a \\cos b = \\frac{1}{2}[\\cos(a - b) + \\cos(a + b)]$.',
    tip: 'Cos nhân cos bằng nửa tổng hai cos.'
  },
  {
    id: 6,
    category: 'knowledge',
    points: 10,
    topic: 'Biến đổi tổng thành tích',
    question: 'Biến đổi biểu thức sin u + sin v thành tích ta được:',
    mathFormula: '\\sin u + \\sin v = ?',
    options: [
      '2 \\sin\\left(\\frac{u + v}{2}\\right) \\cos\\left(\\frac{u - v}{2}\\right)',
      '2 \\cos\\left(\\frac{u + v}{2}\\right) \\sin\\left(\\frac{u - v}{2}\\right)',
      '2 \\cos\\left(\\frac{u + v}{2}\\right) \\cos\\left(\\frac{u - v}{2}\\right)',
      '-2 \\sin\\left(\\frac{u + v}{2}\\right) \\sin\\left(\\frac{u - v}{2}\\right)'
    ],
    correctIndex: 0,
    explanation: '$\\sin u + \\sin v = 2 \\sin\\left(\\frac{u + v}{2}\\right) \\cos\\left(\\frac{u - v}{2}\\right)$.',
    tip: 'Sin cộng sin bằng 2 sin cos; Sin trừ sin bằng 2 cos sin.'
  },
  {
    id: 7,
    category: 'knowledge',
    points: 10,
    topic: 'Công thức nhân đôi',
    question: 'Cho tan a = 2. Giá trị của tan 2a là bao nhiêu?',
    mathFormula: '\\tan 2a = \\frac{2\\tan a}{1 - \\tan^2 a}',
    options: [
      '-\\frac{4}{3}',
      '\\frac{4}{3}',
      '-\\frac{4}{5}',
      '4'
    ],
    correctIndex: 0,
    explanation: 'Áp dụng công thức: $\\tan 2a = \\frac{2\\tan a}{1 - \\tan^2 a} = \\frac{2 \\times 2}{1 - 2^2} = \\frac{4}{1 - 4} = -\\frac{4}{3}$.',
    tip: 'Chú ý dấu âm do mẫu số 1 - 4 = -3.'
  },
  {
    id: 8,
    category: 'gold',
    points: 20,
    topic: 'Vận dụng: Tính góc đặc biệt',
    question: 'Sử dụng công thức cộng, tính giá trị chính xác của sin 15°:',
    mathFormula: '\\sin 15^\\circ = \\sin(45^\\circ - 30^\\circ)',
    options: [
      '\\frac{\\sqrt{6} - \\sqrt{2}}{4}',
      '\\frac{\\sqrt{6} + \\sqrt{2}}{4}',
      '\\frac{\\sqrt{3} - 1}{2}',
      '\\frac{\\sqrt{2} - 1}{4}'
    ],
    correctIndex: 0,
    explanation: 'Ta có: $\\sin 15^\\circ = \\sin(45^\\circ - 30^\\circ) = \\sin 45^\\circ \\cos 30^\\circ - \\cos 45^\\circ \\sin 30^\\circ = \\frac{\\sqrt{2}}{2} \\cdot \\frac{\\sqrt{3}}{2} - \\frac{\\sqrt{2}}{2} \\cdot \\frac{1}{2} = \\frac{\\sqrt{6} - \\sqrt{2}}{4}$.',
    tip: 'Tách góc 15° = 45° - 30° để dùng các giá trị góc lượng giác đặc biệt.'
  },
  {
    id: 9,
    category: 'gold',
    points: 20,
    topic: 'Vận dụng: Rút gọn biểu thức',
    question: 'Rút gọn biểu thức lượng giác sau:',
    mathFormula: 'A = \\frac{\\sin 2x + \\sin x}{1 + \\cos 2x + \\cos x}',
    options: [
      '\\tan x',
      '\\cot x',
      '\\sin x',
      '\\cos x'
    ],
    correctIndex: 0,
    explanation: 'Tử số $= 2\\sin x \\cos x + \\sin x = \\sin x (2\\cos x + 1)$. Mẫu số $= 2\\cos^2 x + \\cos x = \\cos x (2\\cos x + 1)$. Rút gọn thừa số $(2\\cos x + 1)$ ta được $\\frac{\\sin x}{\\cos x} = \\tan x$.',
    tip: 'Dùng công thức nhân đôi sin 2x = 2sinx cosx và 1 + cos 2x = 2cos²x.'
  },
  {
    id: 10,
    category: 'gold',
    points: 20,
    topic: 'Vận dụng: Tính góc và công thức nhân đôi',
    question: 'Cho sin x = 3/5 với π/2 < x < π. Tính giá trị của cos 2x:',
    mathFormula: '\\cos 2x = 1 - 2\\sin^2 x',
    options: [
      '\\frac{7}{25}',
      '-\\frac{7}{25}',
      '\\frac{24}{25}',
      '-\\frac{24}{25}'
    ],
    correctIndex: 0,
    explanation: 'Áp dụng công thức nhân đôi dạng phụ thuộc sin: $\\cos 2x = 1 - 2\\sin^2 x = 1 - 2\\left(\\frac{3}{5}\\right)^2 = 1 - 2\\left(\\frac{9}{25}\\right) = 1 - \\frac{18}{25} = \\frac{7}{25}$.',
    tip: 'Công thức cos 2x = 1 - 2sin²x giúp giải trực tiếp mà không cần tìm cos x.'
  },
  {
    id: 11,
    category: 'gold',
    points: 20,
    topic: 'Vận dụng cao: Rút gọn tích góc nhân đôi',
    question: 'Tính giá trị của tích P = cos 20° · cos 40° · cos 80°:',
    mathFormula: 'P = \\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ',
    options: [
      '\\frac{1}{8}',
      '\\frac{1}{4}',
      '\\frac{\\sqrt{3}}{8}',
      '\\frac{1}{16}'
    ],
    correctIndex: 0,
    explanation: 'Nhân hai vế với $2\\sin 20^\\circ$: $2\\sin 20^\\circ \\cdot P = (2\\sin 20^\\circ \\cos 20^\\circ)\\cos 40^\\circ \\cos 80^\\circ = \\sin 40^\\circ \\cos 40^\\circ \\cos 80^\\circ = \\frac{1}{2}\\sin 80^\\circ \\cos 80^\\circ = \\frac{1}{4}\\sin 160^\\circ = \\frac{1}{4}\\sin 20^\\circ$. Do đó $P = \\frac{1}{8}$.',
    tip: 'Phương pháp nhân liên hoàn góc nhân đôi với sin(góc nhỏ nhất).'
  }
];

export interface FormulaSummary {
  title: string;
  items: { name: string; latex: string }[];
}

export const FORMULA_SUMMARY: FormulaSummary[] = [
  {
    title: '1. Công thức cộng',
    items: [
      { name: 'sin của tổng', latex: '\\sin(a + b) = \\sin a \\cos b + \\cos a \\sin b' },
      { name: 'sin của hiệu', latex: '\\sin(a - b) = \\sin a \\cos b - \\cos a \\sin b' },
      { name: 'cos của tổng', latex: '\\cos(a + b) = \\cos a \\cos b - \\sin a \\sin b' },
      { name: 'cos của hiệu', latex: '\\cos(a - b) = \\cos a \\cos b + \\sin a \\sin b' },
      { name: 'tan của tổng', latex: '\\tan(a + b) = \\frac{\\tan a + \\tan b}{1 - \\tan a \\tan b}' },
      { name: 'tan của hiệu', latex: '\\tan(a - b) = \\frac{\\tan a - \\tan b}{1 + \\tan a \\tan b}' }
    ]
  },
  {
    title: '2. Công thức nhân đôi & Hạ bậc',
    items: [
      { name: 'sin nhân đôi', latex: '\\sin 2a = 2\\sin a \\cos a' },
      { name: 'cos nhân đôi', latex: '\\cos 2a = \\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a' },
      { name: 'tan nhân đôi', latex: '\\tan 2a = \\frac{2\\tan a}{1 - \\tan^2 a}' },
      { name: 'Hạ bậc sin²', latex: '\\sin^2 a = \\frac{1 - \\cos 2a}{2}' },
      { name: 'Hạ bậc cos²', latex: '\\cos^2 a = \\frac{1 + \\cos 2a}{2}' }
    ]
  },
  {
    title: '3. Biến đổi tích thành tổng',
    items: [
      { name: 'cos × cos', latex: '\\cos a \\cos b = \\frac{1}{2}[\\cos(a - b) + \\cos(a + b)]' },
      { name: 'sin × sin', latex: '\\sin a \\sin b = \\frac{1}{2}[\\cos(a - b) - \\cos(a + b)]' },
      { name: 'sin × cos', latex: '\\sin a \\cos b = \\frac{1}{2}[\\sin(a - b) + \\sin(a + b)]' }
    ]
  },
  {
    title: '4. Biến đổi tổng thành tích',
    items: [
      { name: 'cos + cos', latex: '\\cos u + \\cos v = 2\\cos\\left(\\frac{u+v}{2}\\right)\\cos\\left(\\frac{u-v}{2}\\right)' },
      { name: 'cos - cos', latex: '\\cos u - \\cos v = -2\\sin\\left(\\frac{u+v}{2}\\right)\\sin\\left(\\frac{u-v}{2}\\right)' },
      { name: 'sin + sin', latex: '\\sin u + \\sin v = 2\\sin\\left(\\frac{u+v}{2}\\right)\\cos\\left(\\frac{u-v}{2}\\right)' },
      { name: 'sin - sin', latex: '\\sin u - \\sin v = 2\\cos\\left(\\frac{u+v}{2}\\right)\\sin\\left(\\frac{u-v}{2}\\right)' }
    ]
  }
];
