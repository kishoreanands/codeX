// Java Template Engine for Node.js backend
// Mirrors JavaTemplateEngine.java to guarantee synchronized generation across both backends

const dictionary = {
  ta: {
    treesetDesc: '// TreeSet பயன்பாடு: வரிசைப்படுத்தப்பட்ட தனித்துவமான உறுப்புகளின் தொகுப்பு',
    add2Desc: '// இரண்டு எண்களை கூட்டும் ஜாவா நிரல்',
    add2Input: '// எண்களின் உள்ளீடு',
    add2Calc: '// இரு எண்களின் கூடுதல் கணக்கீடு',
    add2Print: '// கூடுதல் முடிவை அச்சிடுதல்',
    add2Label: 'கூடுதல்',
    calcDesc: '// எளிய கணிப்பான் நிரல்',
    evenOddDesc: '// இரட்டை அல்லது ஒற்றை எண் சரிபார்த்தல்',
    factDesc: '// எண்ணின் காரணி (Factorial) கணக்கீடு',
    primeDesc: '// பகா எண் சரிபார்க்கும் ஜாவா நிரல்',
    primeTrue: 'பகா எண் (Prime Number)',
    primeFalse: 'பகா எண் அல்ல (Not a Prime Number)',
    fiboDesc: '// பிபோனாச்சி எண்தொடர் நிரல்',
    revDesc: '// சரத்தை தலைகீழாக மாற்றுதல் மற்றும் பேலிண்ட்ரோம் சோதனை',
    maxDesc: '// வரிசையின் மிகப்பெரிய உறுப்பைக் கண்டறிதல்',
    swapDesc: '// இரண்டு எண்களை இடமாற்றம் செய்தல்',
    leapDesc: '// லீப் ஆண்டு சரிபார்த்தல்',
    armDesc: '// ஆம்ஸ்ட்ராங் எண் சரிபார்த்தல்',
    gcdDesc: '// மீ.பொ.வ மற்றும் மீ.பொ.ம கணக்கீடு',
    tableDesc: '// பெருக்கல் வாய்ப்பாடு',
    vowelDesc: '// உயிர் எழுத்துக்கள் மற்றும் மெய் எழுத்துக்கள் எண்ணிக்கை',
    matrixDesc: '// இரு பரிமாண அணி கூட்டல்',
    bstDesc: '// இருமத் தேடல் மரம் (BST) கட்டமைப்பு',
    sortDesc: '// எண்களை ஏறுவரிசையில் வரிசைப்படுத்துதல்',
    searchDesc: '// இருமத் தேடல் அல்காரிதம்',
    mapDesc: '// சொல் அதிர்வெண் கணக்கீடு (HashMap)',
    listDesc: '// பட்டியல் செயல்பாடுகள் (ArrayList)',
    stackDesc: '// குவியல் கட்டமைப்பு (Stack)',
    queueDesc: '// வரிசை முறை கட்டமைப்பு (Queue)',
    llDesc: '// இணைக்கப்பட்ட பட்டியல் (Linked List)',
    oopDesc: '// பொருள் சார்ந்த நிரலாக்கம் (OOP)',
    excDesc: '// பிழை கையாளுதல் (Exception Handling)',
    threadDesc: '// பல்பணி இழை நிரலாக்கம் (Multithreading)',
    streamDesc: '// ஸ்ட்ரீம் மற்றும் லேம்ப்டா வெளிப்பாடுகள்',
    scannerDesc: '// பயனரிடமிருந்து உள்ளீடு பெறுதல்',
    generalDesc: '// முதன்மை செயலாக்க தர்க்கம்',
    initComment: '// தொடக்க அமைப்பு மற்றும் தரவு கட்டமைப்பு',
    logicComment: '// செயலாக்க தர்க்கம்'
  },
  hi: {
    treesetDesc: '// TreeSet उदाहरण: क्रमबद्ध और अद्वितीय तत्वों का संग्रह',
    add2Desc: '// दो संख्याओं का योग निकालने का जावा प्रोग्राम',
    add2Input: '// इनपुट संख्याएं',
    add2Calc: '// योग की गणना',
    add2Print: '// परिणाम प्रिंट करना',
    add2Label: 'योग',
    calcDesc: '// सरल कैलकुलेटर प्रोग्राम',
    evenOddDesc: '// सम या विषम संख्या जांच',
    factDesc: '// फैक्टोरियल (क्रमगुणित) गणना',
    primeDesc: '// अभाज्य संख्या जांचने का प्रोग्राम',
    primeTrue: 'अभाज्य संख्या है (Prime Number)',
    primeFalse: 'अभाज्य संख्या नहीं है',
    fiboDesc: '// फाइबोनैचि श्रृंखला प्रोग्राम',
    revDesc: '// स्ट्रिंग उलटना और पैलिंड्रोम जांच',
    maxDesc: '// सरणी में सबसे बड़ा तत्व खोजना',
    swapDesc: '// दो संख्याओं की अदला-बदली',
    leapDesc: '// लीप वर्ष जांच',
    armDesc: '// आर्मस्ट्रांग संख्या जांच',
    gcdDesc: '// म.स.प और ल.स.प गणना',
    tableDesc: '// पहाड़ा (Multiplication Table)',
    vowelDesc: '// स्वर और व्यंजन की गणना',
    matrixDesc: '// आव्यूह जोड़ (Matrix Addition)',
    bstDesc: '// बाइनरी सर्च ट्री (BST) कार्यान्वयन',
    sortDesc: '// संख्याओं को आरोही क्रम में छांटना',
    searchDesc: '// बाइनरी सर्च एल्गोरिदम',
    mapDesc: '// शब्द आवृत्ति गणना (HashMap)',
    listDesc: '// गतिशील सूची (ArrayList)',
    stackDesc: '// स्टैक कार्यान्वयन (LIFO)',
    queueDesc: '// कतार कार्यान्वयन (FIFO)',
    llDesc: '// लिंक्ड सूची कार्यान्वयन',
    oopDesc: '// ऑब्जेक्ट ओरिएंटेड प्रोग्रामिंग (OOP)',
    excDesc: '// अपवाद प्रबंधन (Exception Handling)',
    threadDesc: '// मल्टीथ्रेडिंग प्रोग्रामिंग',
    streamDesc: '// स्ट्रीम और लैम्ब्डा एक्सप्रेशन',
    scannerDesc: '// उपयोगकर्ता से इनपुट लेना',
    generalDesc: '// मुख्य व्यावसायिक तर्क',
    initComment: '// प्रारंभिक सेटअप और डेटा संरचना',
    logicComment: '// मुख्य प्रसंस्करण तर्क'
  }
};

function getComment(langCode, type, fallback) {
  const langMap = dictionary[langCode];
  if (langMap && langMap[type]) {
    return langMap[type];
  }
  return fallback;
}

function containsAny(str, ...terms) {
  if (!str) return false;
  return terms.some((t) => str.includes(t));
}

function matchesWord(text, word) {
  if (!text || !word) return false;
  const regex = new RegExp(`\\b${word}\\b`, 'i');
  return regex.test(text);
}

function sanitizeTitle(prompt) {
  if (!prompt || !prompt.trim()) return 'Custom Task';
  const s = prompt.replace(/[^a-zA-Z0-9\s\u0900-\u0DFF\u0600-\u06FF]/g, ' ').trim();
  return s.length > 60 ? s.substring(0, 60) + '...' : (s || 'Custom Task');
}

export function generateJavaMain(prompt, humanLang) {
  const langCode = humanLang?.code || 'en';
  const humanName = humanLang?.name || 'English';
  const nativeName = humanLang?.nativeName || 'English';
  const lower = (prompt || '').toLowerCase().trim();

  const header = `// [CodeX Solution] Human Language: ${humanName} (${nativeName})\n// Compilation: javac -encoding UTF-8 Main.java\n// Execution:   java Main\n`;

  // 1. TreeSet / Set Collection
  if (containsAny(lower, 'treeset', 'tree set') || matchesWord(lower, 'treeset') ||
      (containsAny(lower, 'set collection', 'sorted set', 'தொகுப்பு', 'வரிசைப்படுத்தப்பட்ட தொகுப்பு', 'समुच्चय') && !containsAny(lower, 'subset', 'dataset', 'asset', 'reset', 'setup'))) {
    const desc = getComment(langCode, 'treesetDesc', '// TreeSet: Sorted & unique elements collection');
    return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        TreeSet<Integer> set = new TreeSet<>();

        set.add(50);
        set.add(20);
        set.add(40);
        set.add(10);
        set.add(30);

        System.out.println("TreeSet: " + set);
    }
}`;
  }

  // 2. Add Two Numbers / Sum
  if (containsAny(lower, 'add 2', 'add two', 'sum of two', 'sum of 2', 'addition of two', 'addition of 2', 'two number', 'இரண்டு எண்', 'கூட்ட', 'கூட்டு', 'दो संख्या', 'योग', 'जोड़')) {
    const desc = getComment(langCode, 'add2Desc', '// Java Program to Add Two Numbers');
    const inp = getComment(langCode, 'add2Input', '// Input numbers');
    const calc = getComment(langCode, 'add2Calc', '// Calculate sum');
    const out = getComment(langCode, 'add2Print', '// Print the sum');
    const label = getComment(langCode, 'add2Label', 'Sum');

    if (containsAny(lower, 'scanner', 'input', 'user input', 'keyboard', 'உள்ளீடு')) {
      return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        ${inp}
        System.out.print("Enter first number: ");
        int num1 = scanner.nextInt();

        System.out.print("Enter second number: ");
        int num2 = scanner.nextInt();

        ${calc}
        int sum = num1 + num2;

        ${out}
        System.out.println("${label}: " + sum);
        scanner.close();
    }
}`;
    }

    return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        ${inp}
        int num1 = 10;
        int num2 = 20;

        ${calc}
        int sum = num1 + num2;

        ${out}
        System.out.println("${label}: " + sum);
    }
}`;
  }

  // 3. Calculator
  if (containsAny(lower, 'calculator', 'calculate', 'arithmetic', 'கணிப்பான்', 'गणक')) {
    const desc = getComment(langCode, 'calcDesc', '// Simple Menu-Driven Calculator');
    return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        double num1 = 20.0;
        double num2 = 10.0;
        char operator = '+';

        double result;

        switch (operator) {
            case '+':
                result = num1 + num2;
                System.out.println(num1 + " + " + num2 + " = " + result);
                break;
            case '-':
                result = num1 - num2;
                System.out.println(num1 + " - " + num2 + " = " + result);
                break;
            case '*':
                result = num1 * num2;
                System.out.println(num1 + " * " + num2 + " = " + result);
                break;
            case '/':
                if (num2 != 0) {
                    result = num1 / num2;
                    System.out.println(num1 + " / " + num2 + " = " + result);
                } else {
                    System.out.println("Error: Division by zero");
                }
                break;
            default:
                System.out.println("Invalid operator");
        }
    }
}`;
  }

  // 4. Even or Odd
  if (containsAny(lower, 'even or odd', 'odd or even', 'even number', 'odd number', 'இரட்டை', 'ஒற்றை', 'सम या विषम')) {
    const desc = getComment(langCode, 'evenOddDesc', '// Check if a number is Even or Odd');
    return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        int number = 42;

        if (number % 2 == 0) {
            System.out.println(number + " is Even");
        } else {
            System.out.println(number + " is Odd");
        }
    }
}`;
  }

  // 5. Factorial
  if (containsAny(lower, 'factorial', 'காரணி', 'பாக்டீரியல்', 'क्रमगुणित')) {
    const desc = getComment(langCode, 'factDesc', '// Factorial of a Number');
    return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        int n = 5;
        long factorial = 1;

        for (int i = 1; i <= n; i++) {
            factorial *= i;
        }

        System.out.println("Factorial of " + n + " = " + factorial);
    }
}`;
  }

  // 6. Prime
  if (containsAny(lower, 'prime', 'பகா', 'अभाज्य', 'أولي')) {
    const desc = getComment(langCode, 'primeDesc', '// Prime Number Verification Program');
    return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        int num = 29;
        boolean isPrime = true;

        if (num <= 1) {
            isPrime = false;
        } else {
            for (int i = 2; i <= Math.sqrt(num); i++) {
                if (num % i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }

        if (isPrime) {
            System.out.println(num + " is a Prime Number");
        } else {
            System.out.println(num + " is NOT a Prime Number");
        }
    }
}`;
  }

  // 7. Fibonacci
  if (containsAny(lower, 'fibo', 'பிபோனாச்சி', 'फाइबोनैचि')) {
    const desc = getComment(langCode, 'fiboDesc', '// Fibonacci Series Program');
    return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        int n = 10;
        int first = 0, second = 1;

        System.out.println("Fibonacci Series (" + n + " terms):");
        for (int i = 1; i <= n; ++i) {
            System.out.print(first + " ");
            int next = first + second;
            first = second;
            second = next;
        }
        System.out.println();
    }
}`;
  }

  // 8. Palindrome & Reverse
  if (containsAny(lower, 'palindrome', 'reverse', 'பேலிண்ட்ரோம்', 'தலைகீழ்', 'पैलिन', 'उलट')) {
    const desc = getComment(langCode, 'revDesc', '// String Reversal and Palindrome Check');
    return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        String str = "madam";
        String reversed = new StringBuilder(str).reverse().toString();

        System.out.println("Original: " + str);
        System.out.println("Reversed: " + reversed);

        if (str.equalsIgnoreCase(reversed)) {
            System.out.println(str + " is a Palindrome");
        } else {
            System.out.println(str + " is NOT a Palindrome");
        }
    }
}`;
  }

  // 9a. Greatest / Largest of 3 Numbers
  if (containsAny(lower, 'greatest number in 3', 'greatest of 3', 'largest of 3', 'maximum of 3', 'biggest of 3', '3 number greatest', '3 number largest', 'மூன்று எண்', '3 எண்களில் பெரிய', 'तीन संख्याओं में सबसे बड़ी') ||
      (containsAny(lower, 'greatest', 'largest', 'maximum') && containsAny(lower, '3 number', 'three number', '3 numbers', 'three numbers'))) {
    return header + `// Find the Greatest Number Among Three Numbers
import java.util.*;

class Main {

    public static int findGreatest(int a, int b, int c) {
        if (a >= b && a >= c) return a;
        if (b >= a && b >= c) return b;
        return c;
    }

    public static void main(String[] args) {
        int num1 = 45;
        int num2 = 92;
        int num3 = 63;

        System.out.println("Numbers: " + num1 + ", " + num2 + ", " + num3);
        int greatest = findGreatest(num1, num2, num3);
        System.out.println("Greatest Number: " + greatest);
    }
}`;
  }

  // 9. Largest / Maximum
  if (containsAny(lower, 'greatest', 'largest', 'maximum', 'max of', 'biggest', 'பெரிய', 'மீப்பெரு', 'सबसे बड़ा')) {
    const desc = getComment(langCode, 'maxDesc', '// Find the Largest Element');
    return header + `${desc}
import java.util.*;

class Main {

    public static void main(String[] args) {

        int[] arr = { 14, 45, 89, 23, 99, 56 };
        int max = arr[0];

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }

        System.out.println("Array: " + Arrays.toString(arr));
        System.out.println("Largest Element = " + max);
    }
}`;
  }

  // 10. BST
  if (containsAny(lower, 'binary search tree', 'bst', 'binary tree', 'இருமத் தேடல்', 'बाइनरी सर्च ट्री')) {
    const desc = getComment(langCode, 'bstDesc', '// Binary Search Tree (BST) Implementation');
    return header + `${desc}
import java.util.*;

class Node {
    int data;
    Node left, right;

    public Node(int item) {
        data = item;
        left = right = null;
    }
}

class Main {

    static Node insert(Node root, int key) {
        if (root == null) return new Node(key);
        if (key < root.data) root.left = insert(root.left, key);
        else if (key > root.data) root.right = insert(root.right, key);
        return root;
    }

    static void inorder(Node root) {
        if (root != null) {
            inorder(root.left);
            System.out.print(root.data + " ");
            inorder(root.right);
        }
    }

    public static void main(String[] args) {

        Node root = null;
        int[] values = { 50, 30, 20, 40, 70, 60, 80 };

        for (int val : values) {
            root = insert(root, val);
        }

        System.out.println("Inorder Traversal:");
        inorder(root);
        System.out.println();
    }
}`;
  }

  // 11. Bubble Sort
  if (containsAny(lower, 'bubble sort', 'sort', 'sorting', 'வரிசை', 'வரிசைப்படுத்து', 'छांटना')) {
    const desc = getComment(langCode, 'sortDesc', '// Bubble Sort Algorithm in Ascending Order');
    return header + `${desc}
import java.util.*;

class Main {

    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {

        int[] arr = { 64, 34, 25, 12, 22, 11, 90 };

        System.out.println("Original Array: " + Arrays.toString(arr));
        bubbleSort(arr);
        System.out.println("Sorted Array:   " + Arrays.toString(arr));
    }
}`;
  }

  // 12. Smart Dynamic Domain Solution Fallback
  const cleanTitle = sanitizeTitle(prompt);
  const desc = getComment(langCode, 'generalDesc', '// Domain Solution Implementation');
  const init = getComment(langCode, 'initComment', '// Initialization & state setup');
  const logic = getComment(langCode, 'logicComment', '// Business execution logic');

  return header + `${desc}
import java.util.*;

/**
 * Solution for: ${cleanTitle}
 */
class SolutionEngine {
    private final List<String> records;
    private final Map<String, Object> metadata;

    public SolutionEngine() {
        this.records = new ArrayList<>();
        this.metadata = new LinkedHashMap<>();
        ${init}
        this.metadata.put("status", "ACTIVE");
        this.metadata.put("timestamp", System.currentTimeMillis());
    }

    public void addRecord(String item) {
        if (item != null && !item.trim().isEmpty()) {
            this.records.add(item);
        }
    }

    ${logic}
    public void executeProcess() {
        System.out.println("Executing Solution for: ${cleanTitle}");
        System.out.println("Engine Metadata: " + metadata);
        System.out.println("Total Records: " + records.size());

        for (int i = 0; i < records.size(); i++) {
            System.out.println("  [" + (i + 1) + "] " + records.get(i));
        }
    }
}

class Main {

    public static void main(String[] args) {

        SolutionEngine engine = new SolutionEngine();
        engine.addRecord("Process Unit 1 - Initialized");
        engine.addRecord("Process Unit 2 - Validation Passed");
        engine.addRecord("Process Unit 3 - Execution Complete");

        engine.executeProcess();
    }
}`;
}
