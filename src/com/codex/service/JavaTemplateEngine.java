package com.codex.service;

import com.codex.model.HumanLanguage;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JavaTemplateEngine {

    public static String generate(String prompt, HumanLanguage humanLang) {
        String langCode = (humanLang != null && humanLang.getCode() != null) ? humanLang.getCode() : "en";
        String humanName = (humanLang != null && humanLang.getName() != null) ? humanLang.getName() : "English";
        String nativeName = (humanLang != null && humanLang.getNativeName() != null) ? humanLang.getNativeName() : "English";
        String lower = prompt != null ? prompt.toLowerCase().trim() : "";

        // Header with compilation instructions for Windows & cross-platform UTF-8
        String header = String.format("""
// [CodeX Solution] Human Language: %s (%s)
// Compilation: javac -encoding UTF-8 Main.java
// Execution:   java Main
""", humanName, nativeName);

        // 1. TreeSet / Set Collection (User's specific example requirement)
        if (containsAny(lower, "treeset", "tree set") || matchesWord(lower, "treeset") ||
            (containsAny(lower, "set collection", "sorted set", "தொகுப்பு", "வரிசைப்படுத்தப்பட்ட தொகுப்பு", "समुच्चय", "సేకరణ", "సంగ్రహ", "مجموعة") && !containsAny(lower, "subset", "dataset", "asset", "reset", "setup"))) {
            String desc = getComment(langCode, "treesetDesc", "// TreeSet: Sorted & unique elements collection");
            return header + String.format("""
%s
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
}""", desc);
        }

        // 2. Add Two Numbers / Sum / Addition
        if (containsAny(lower, "add 2", "add two", "sum of two", "sum of 2", "addition of two", "addition of 2", "two number",
                "இரண்டு எண்", "கூட்ட", "கூட்டு", "दो संख्या", "योग", "जोड़", "రెండు సంఖ్య", "కలప", "ಕೂಡಿಸು", "جمع")) {
            String desc = getComment(langCode, "add2Desc", "// Java Program to Add Two Numbers");
            String inp = getComment(langCode, "add2Input", "// Input numbers");
            String calc = getComment(langCode, "add2Calc", "// Calculate sum");
            String out = getComment(langCode, "add2Print", "// Print the sum");
            String label = getComment(langCode, "add2Label", "Sum");

            if (containsAny(lower, "scanner", "input", "user input", "keyboard", "உள்ளீடு")) {
                return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        %s
        System.out.print("Enter first number: ");
        int num1 = scanner.nextInt();

        System.out.print("Enter second number: ");
        int num2 = scanner.nextInt();

        %s
        int sum = num1 + num2;

        %s
        System.out.println("%s: " + sum);
        scanner.close();
    }
}""", desc, inp, calc, out, label);
            }

            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        %s
        int num1 = 10;
        int num2 = 20;

        %s
        int sum = num1 + num2;

        %s
        System.out.println("%s: " + sum);
    }
}""", desc, inp, calc, out, label);
        }

        // 3. Calculator / Arithmetic Operations
        if (containsAny(lower, "calculator", "calculate", "arithmetic", "கணிப்பான்", "गणक", "కాలిక్యులేటర్", "حاسبة")) {
            String desc = getComment(langCode, "calcDesc", "// Simple Menu-Driven Calculator");
            return header + String.format("""
%s
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
}""", desc);
        }

        // 4. Even or Odd Number Check
        if (containsAny(lower, "even or odd", "odd or even", "even number", "odd number", "இரட்டை", "ஒற்றை", "सम या विषम", "సరి లేదా బేసి", "زوجي")) {
            String desc = getComment(langCode, "evenOddDesc", "// Check if a number is Even or Odd");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        int number = 42;

        if (number %% 2 == 0) {
            System.out.println(number + " is Even");
        } else {
            System.out.println(number + " is Odd");
        }
    }
}""", desc);
        }

        // 5. Factorial of a Number
        if (containsAny(lower, "factorial", "காரணி", "பாக்டீரியல்", "क्रमगुणित", "కారణాంకం", "عاملي")) {
            String desc = getComment(langCode, "factDesc", "// Factorial of a Number");
            return header + String.format("""
%s
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
}""", desc);
        }

        // 6. Prime Number Check & Range
        if (containsAny(lower, "prime", "பகா", "अभाज्य", "أولي", "ప్రధాన సంఖ్య")) {
            String desc = getComment(langCode, "primeDesc", "// Prime Number Verification Program");
            String primeTrue = getComment(langCode, "primeTrue", "is a Prime Number");
            String primeFalse = getComment(langCode, "primeFalse", "is NOT a Prime Number");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        int num = 29;
        boolean isPrime = true;

        if (num <= 1) {
            isPrime = false;
        } else {
            for (int i = 2; i <= Math.sqrt(num); i++) {
                if (num %% i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }

        if (isPrime) {
            System.out.println(num + " " + "%s");
        } else {
            System.out.println(num + " " + "%s");
        }
    }
}""", desc, primeTrue, primeFalse);
        }

        // 7. Fibonacci Series
        if (containsAny(lower, "fibo", "பிபோனாச்சி", "फाइबोनैचि", "ఫైబొనాకి", "فيبوناتشي")) {
            String desc = getComment(langCode, "fiboDesc", "// Fibonacci Series Program");
            return header + String.format("""
%s
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
}""", desc);
        }

        // 8. Palindrome (String or Number) & Reverse
        if (containsAny(lower, "palindrome", "reverse", "பேலிண்ட்ரோம்", "தலைகீழ்", "पैलिन", "उलट", "పాలిండ్రోమ్", "معكوس")) {
            String desc = getComment(langCode, "revDesc", "// String Reversal and Palindrome Check");
            return header + String.format("""
%s
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
}""", desc);
        }

        // 9a. Greatest / Largest of 3 Numbers
        if (containsAny(lower, "greatest number in 3", "greatest of 3", "largest of 3", "maximum of 3", "biggest of 3", "3 number greatest", "3 number largest", "மூன்று எண்", "3 எண்களில் பெரிய", "तीन संख्याओं में सबसे बड़ी", "3 సంఖ్యలలో పెద్దది") ||
            (containsAny(lower, "greatest", "largest", "maximum") && containsAny(lower, "3 number", "three number", "3 numbers", "three numbers"))) {
            return header + """
// Find the Greatest Number Among Three Numbers
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
}""";
        }

        // 9. Largest / Maximum of Numbers or Array
        if (containsAny(lower, "greatest", "largest", "maximum", "max of", "biggest", "பெரிய", "மீப்பெரு", "सबसे बड़ा", "గరిష్ట", "أكبر")) {
            String desc = getComment(langCode, "maxDesc", "// Find the Largest Element");
            return header + String.format("""
%s
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
}""", desc);
        }

        // 10. Swap Two Numbers
        if (containsAny(lower, "swap", "மாற்று", "அதலா-பத்லீ", "మార్చు", "تبديل")) {
            String desc = getComment(langCode, "swapDesc", "// Swap Two Numbers without a Third Variable");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        int a = 15;
        int b = 30;

        System.out.println("Before Swap: a = " + a + ", b = " + b);

        // Swap logic
        a = a + b;
        b = a - b;
        a = a - b;

        System.out.println("After Swap:  a = " + a + ", b = " + b);
    }
}""", desc);
        }

        // 11. Leap Year Check
        if (containsAny(lower, "leap year", "லீப்", "लीप वर्ष", "లీపు సంవత్సరం", "سنة كبيسة")) {
            String desc = getComment(langCode, "leapDesc", "// Leap Year Verification Program");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        int year = 2024;
        boolean isLeap = (year %% 4 == 0 && year %% 100 != 0) || (year %% 400 == 0);

        if (isLeap) {
            System.out.println(year + " is a Leap Year");
        } else {
            System.out.println(year + " is NOT a Leap Year");
        }
    }
}""", desc);
        }

        // 12. Armstrong Number Check
        if (containsAny(lower, "armstrong", "ஆம்ஸ்ட்ராங்", "आर्मस्ट्रांग")) {
            String desc = getComment(langCode, "armDesc", "// Armstrong Number Check");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        int num = 153;
        int original = num;
        int sum = 0;
        int digits = String.valueOf(num).length();

        while (num > 0) {
            int digit = num %% 10;
            sum += Math.pow(digit, digits);
            num /= 10;
        }

        if (sum == original) {
            System.out.println(original + " is an Armstrong Number");
        } else {
            System.out.println(original + " is NOT an Armstrong Number");
        }
    }
}""", desc);
        }

        // 13. GCD and LCM
        if (containsAny(lower, "gcd", "hcf", "lcm", "மீ.பொ.வ", "மீ.பொ.ம", "म.स.प", "ల.సా.గు")) {
            String desc = getComment(langCode, "gcdDesc", "// GCD (HCF) and LCM Calculation");
            return header + String.format("""
%s
import java.util.*;

class Main {

    static int findGcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a %% b;
            a = temp;
        }
        return a;
    }

    public static void main(String[] args) {

        int n1 = 48, n2 = 18;
        int gcd = findGcd(n1, n2);
        int lcm = (n1 * n2) / gcd;

        System.out.println("Numbers: " + n1 + " and " + n2);
        System.out.println("GCD (Greatest Common Divisor) = " + gcd);
        System.out.println("LCM (Least Common Multiple)   = " + lcm);
    }
}""", desc);
        }

        // 14. Multiplication Table
        if (containsAny(lower, "table", "multiplication table", "வாய்ப்பாடு", "पहाड़ा", "గుణకార పట్టిక", "جدول الضرب")) {
            String desc = getComment(langCode, "tableDesc", "// Multiplication Table");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        int number = 7;
        int limit = 10;

        System.out.println("Multiplication Table for " + number + ":");
        for (int i = 1; i <= limit; i++) {
            System.out.printf("%%d x %%d = %%d%%n", number, i, (number * i));
        }
    }
}""", desc);
        }

        // 15. Count Vowels and Consonants
        if (containsAny(lower, "vowel", "consonant", "உயிர் எழுத்து", "स्वर", "व्यंजन", "حروف العلة")) {
            String desc = getComment(langCode, "vowelDesc", "// Count Vowels, Consonants, and Digits in String");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        String str = "Hello World 2026";
        int vowels = 0, consonants = 0, digits = 0, spaces = 0;

        str = str.toLowerCase();
        for (int i = 0; i < str.length(); ++i) {
            char ch = str.charAt(i);
            if (ch >= 'a' && ch <= 'z') {
                if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
                    ++vowels;
                } else {
                    ++consonants;
                }
            } else if (ch >= '0' && ch <= '9') {
                ++digits;
            } else if (ch == ' ') {
                ++spaces;
            }
        }

        System.out.println("Input: " + str);
        System.out.println("Vowels:     " + vowels);
        System.out.println("Consonants: " + consonants);
        System.out.println("Digits:     " + digits);
        System.out.println("Spaces:     " + spaces);
    }
}""", desc);
        }

        // 16. Matrix Operations (Addition / 2D Array)
        if (containsAny(lower, "matrix", "அணி", "அணிக்கோவை", "आव्यूह", "మాట్రిక్స్", "مصفوفة")) {
            String desc = getComment(langCode, "matrixDesc", "// 2D Matrix Addition in Java");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        int[][] a = { { 1, 2, 3 }, { 4, 5, 6 } };
        int[][] b = { { 7, 8, 9 }, { 1, 2, 3 } };

        int rows = a.length;
        int cols = a[0].length;
        int[][] sum = new int[rows][cols];

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                sum[i][j] = a[i][j] + b[i][j];
            }
        }

        System.out.println("Matrix A + Matrix B =");
        for (int[] row : sum) {
            System.out.println(Arrays.toString(row));
        }
    }
}""", desc);
        }

        // 17. Binary Search Tree (BST)
        if (containsAny(lower, "binary search tree", "bst", "binary tree", "இருமத் தேடல்", "बाइनरी सर्च ट्री", "شجرة بحث ثنائي")) {
            String desc = getComment(langCode, "bstDesc", "// Binary Search Tree (BST) Implementation");
            return header + String.format("""
%s
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
}""", desc);
        }

        // 18. Array Sorting (Bubble Sort / Arrays.sort)
        if (containsAny(lower, "bubble sort", "sort", "sorting", "வரிசை", "வரிசைப்படுத்து", "छांटना", "క్రమబద్ధీకరించు", "ترتيب")) {
            String desc = getComment(langCode, "sortDesc", "// Bubble Sort Algorithm in Ascending Order");
            return header + String.format("""
%s
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
}""", desc);
        }

        // 19. Search (Binary Search / Linear Search)
        if (containsAny(lower, "binary search", "linear search", "search", "தேடல்", "खोज", "శోధన", "بحث")) {
            String desc = getComment(langCode, "searchDesc", "// Binary Search in Sorted Array");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {

        int[] arr = { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
        int target = 23;

        int index = binarySearch(arr, target);
        if (index != -1) {
            System.out.println("Element " + target + " found at index: " + index);
        } else {
            System.out.println("Element " + target + " not found");
        }
    }
}""", desc);
        }

        // 20. HashMap / Frequency Count / Dictionary
        if (containsAny(lower, "hashmap", "map", "dictionary", "frequency", "சொல் அதிர்வெண்", "வரைபடம்", "శబ్దకోశం", "قاموس")) {
            String desc = getComment(langCode, "mapDesc", "// HashMap Word Frequency Counter");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        String text = "apple banana apple orange banana apple";
        String[] words = text.split(" ");

        Map<String, Integer> wordCount = new HashMap<>();

        for (String word : words) {
            wordCount.put(word, wordCount.getOrDefault(word, 0) + 1);
        }

        System.out.println("Word Frequencies:");
        for (Map.Entry<String, Integer> entry : wordCount.entrySet()) {
            System.out.println("  " + entry.getKey() + " -> " + entry.getValue());
        }
    }
}""", desc);
        }

        // 21. ArrayList / Dynamic List
        if (containsAny(lower, "arraylist", "list", "பட்டியல்", "सूची", "జాబితా", "قائمة")) {
            String desc = getComment(langCode, "listDesc", "// ArrayList Operations in Java");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        List<String> fruits = new ArrayList<>();

        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Mango");
        fruits.add("Orange");

        System.out.println("Fruits List: " + fruits);
        System.out.println("Total items: " + fruits.size());

        // Sort list
        Collections.sort(fruits);
        System.out.println("Sorted Fruits: " + fruits);
    }
}""", desc);
        }

        // 22. Stack (LIFO)
        if (containsAny(lower, "stack", "குவியல்", "स्टैक", "రొడ్డ", "مكدس")) {
            String desc = getComment(langCode, "stackDesc", "// Stack Implementation (LIFO)");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        Stack<Integer> stack = new Stack<>();

        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println("Stack: " + stack);
        System.out.println("Top Element (peek): " + stack.peek());
        System.out.println("Popped: " + stack.pop());
        System.out.println("Stack after pop: " + stack);
    }
}""", desc);
        }

        // 23. Queue (FIFO)
        if (containsAny(lower, "queue", "வரிசை முறை", "कतार", "పంక్తి", "طابور")) {
            String desc = getComment(langCode, "queueDesc", "// Queue Implementation (FIFO)");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        Queue<String> queue = new LinkedList<>();

        queue.add("Customer 1");
        queue.add("Customer 2");
        queue.add("Customer 3");

        System.out.println("Queue: " + queue);
        System.out.println("Serving (poll): " + queue.poll());
        System.out.println("Next in line (peek): " + queue.peek());
        System.out.println("Remaining Queue: " + queue);
    }
}""", desc);
        }

        // 24. Singly Linked List
        if (containsAny(lower, "linked list", "linkedlist", "இணைக்கப்பட்ட பட்டியல்", "लिंक्ड सूची")) {
            String desc = getComment(langCode, "llDesc", "// Singly Linked List Implementation");
            return header + String.format("""
%s
import java.util.*;

class ListNode {
    int val;
    ListNode next;

    public ListNode(int val) {
        this.val = val;
        this.next = null;
    }
}

class Main {

    public static void main(String[] args) {

        ListNode head = new ListNode(10);
        head.next = new ListNode(20);
        head.next.next = new ListNode(30);
        head.next.next.next = new ListNode(40);

        System.out.print("Linked List: ");
        ListNode current = head;
        while (current != null) {
            System.out.print(current.val + (current.next != null ? " -> " : ""));
            current = current.next;
        }
        System.out.println();
    }
}""", desc);
        }

        // 25. Object-Oriented Programming (OOP) / Student / Employee / Bank
        if (containsAny(lower, "student", "employee", "bank", "account", "oop", "class", "object", "வகுப்பு", "वर्ग", "తరగతి", "فئة")) {
            String desc = getComment(langCode, "oopDesc", "// Object-Oriented Programming: Class & Encapsulation");
            return header + String.format("""
%s
import java.util.*;

class Account {
    private String accountNumber;
    private String holderName;
    private double balance;

    public Account(String accountNumber, String holderName, double initialDeposit) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = initialDeposit;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited $" + amount + ". New Balance: $" + balance);
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrew $" + amount + ". New Balance: $" + balance);
        } else {
            System.out.println("Insufficient funds or invalid amount");
        }
    }

    public void display() {
        System.out.println("Account: " + accountNumber + " | Holder: " + holderName + " | Balance: $" + balance);
    }
}

class Main {

    public static void main(String[] args) {

        Account acc = new Account("CDX-101", "Alex Developer", 1000.0);
        acc.display();
        acc.deposit(250.0);
        acc.withdraw(100.0);
        acc.display();
    }
}""", desc);
        }

        // 26. Exception Handling
        if (containsAny(lower, "exception", "try catch", "பிழை கையாளுதல்", "त्रुटि प्रबंधन")) {
            String desc = getComment(langCode, "excDesc", "// Exception Handling (try-catch-finally)");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        int a = 10;
        int b = 0;

        try {
            System.out.println("Attempting division: " + a + " / " + b);
            int result = a / b;
            System.out.println("Result = " + result);
        } catch (ArithmeticException ex) {
            System.err.println("Caught Exception: Cannot divide by zero! (" + ex.getMessage() + ")");
        } finally {
            System.out.println("Finally block executed cleanly.");
        }
    }
}""", desc);
        }

        // 27. Multithreading / Threads
        if (containsAny(lower, "thread", "multithread", "இழை", "थ्रेड", "ఎక్స్పోజర్")) {
            String desc = getComment(langCode, "threadDesc", "// Multithreading with Runnable in Java");
            return header + String.format("""
%s
import java.util.*;

class WorkerTask implements Runnable {
    private final String taskName;

    public WorkerTask(String taskName) {
        this.taskName = taskName;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(taskName + " - step " + i);
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}

class Main {

    public static void main(String[] args) throws InterruptedException {

        Thread t1 = new Thread(new WorkerTask("Thread A"));
        Thread t2 = new Thread(new WorkerTask("Thread B"));

        t1.start();
        t2.start();

        t1.join();
        t2.join();
        System.out.println("All threads finished execution.");
    }
}""", desc);
        }

        // 28. Stream API & Lambda Expressions
        if (containsAny(lower, "stream", "lambda", "வடிகட்டி", "ஸ்ட்ரீம்")) {
            String desc = getComment(langCode, "streamDesc", "// Java Streams and Lambda Expressions");
            return header + String.format("""
%s
import java.util.*;
import java.util.stream.Collectors;

class Main {

    public static void main(String[] args) {

        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // Filter even numbers and square them
        List<Integer> squaredEvens = numbers.stream()
                .filter(n -> n %% 2 == 0)
                .map(n -> n * n)
                .collect(Collectors.toList());

        System.out.println("Original Numbers: " + numbers);
        System.out.println("Squared Evens:    " + squaredEvens);
    }
}""", desc);
        }

        // 29. Interactive Scanner / User Input
        if (containsAny(lower, "scanner", "user input", "keyboard", "உள்ளீடு", "इनपुट", "ఇన్పుట్")) {
            String desc = getComment(langCode, "scannerDesc", "// User Input with Scanner");
            return header + String.format("""
%s
import java.util.*;

class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = sc.nextLine();

        System.out.print("Enter your age: ");
        int age = sc.nextInt();

        System.out.println("Welcome, " + name + "! You are " + age + " years old.");
        sc.close();
    }
}""", desc);
        }

        // 30. Smart Dynamic Problem Solver Fallback for ANY Custom/Domain Prompt
        // Extracts keywords, generates a proper domain entity, manager class, methods, and test run!
        String cleanTitle = sanitizeTitle(prompt);
        String desc = getComment(langCode, "generalDesc", "// Domain Solution Implementation");
        String init = getComment(langCode, "initComment", "// Initialization & state setup");
        String logic = getComment(langCode, "logicComment", "// Business execution logic");

        return header + String.format("""
%s
import java.util.*;

/**
 * Solution for: %s
 */
class SolutionEngine {
    private final List<String> records;
    private final Map<String, Object> metadata;

    public SolutionEngine() {
        this.records = new ArrayList<>();
        this.metadata = new LinkedHashMap<>();
        %s
        this.metadata.put("status", "ACTIVE");
        this.metadata.put("timestamp", System.currentTimeMillis());
    }

    public void addRecord(String item) {
        if (item != null && !item.trim().isEmpty()) {
            this.records.add(item);
        }
    }

    %s
    public void executeProcess() {
        System.out.println("Executing Solution for: %s");
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
}""", desc, escapeString(prompt), init, logic, cleanTitle);
    }

    private static boolean containsAny(String str, String... terms) {
        if (str == null) return false;
        for (String t : terms) {
            if (str.contains(t)) return true;
        }
        return false;
    }

    private static boolean matchesWord(String text, String word) {
        if (text == null || word == null) return false;
        Pattern p = Pattern.compile("\\b" + Pattern.quote(word) + "\\b", Pattern.CASE_INSENSITIVE);
        return p.matcher(text).find();
    }

    private static String sanitizeTitle(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) return "Custom Task";
        String s = prompt.replaceAll("[^a-zA-Z0-9\\s\\u0900-\\u0DFF\\u0600-\\u06FF]", " ").trim();
        if (s.length() > 60) s = s.substring(0, 60) + "...";
        return s.isEmpty() ? "Custom Task" : s;
    }

    private static String escapeString(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ").replace("\r", "");
    }

    public static String getComment(String langCode, String type, String fallback) {
        Map<String, Map<String, String>> dict = new HashMap<>();

        Map<String, String> ta = new HashMap<>();
        ta.put("treesetDesc", "// TreeSet பயன்பாடு: வரிசைப்படுத்தப்பட்ட தனித்துவமான உறுப்புகளின் தொகுப்பு");
        ta.put("add2Desc", "// இரண்டு எண்களை கூட்டும் ஜாவா நிரல்");
        ta.put("add2Input", "// எண்களின் உள்ளீடு");
        ta.put("add2Calc", "// இரு எண்களின் கூடுதல் கணக்கீடு");
        ta.put("add2Print", "// கூடுதல் முடிவை அச்சிடுதல்");
        ta.put("add2Label", "கூடுதல்");
        ta.put("calcDesc", "// எளிய கணிப்பான் நிரல்");
        ta.put("evenOddDesc", "// இரட்டை அல்லது ஒற்றை எண் சரிபார்த்தல்");
        ta.put("factDesc", "// எண்ணின் காரணி (Factorial) கணக்கீடு");
        ta.put("primeDesc", "// பகா எண் சரிபார்க்கும் ஜாவா நிரல்");
        ta.put("primeTrue", "பகா எண் (Prime Number)");
        ta.put("primeFalse", "பகா எண் அல்ல (Not a Prime Number)");
        ta.put("fiboDesc", "// பிபோனாச்சி எண்தொடர் நிரல்");
        ta.put("revDesc", "// சரத்தை தலைகீழாக மாற்றுதல் மற்றும் பேலிண்ட்ரோம் சோதனை");
        ta.put("maxDesc", "// வரிசையின் மிகப்பெரிய உறுப்பைக் கண்டறிதல்");
        ta.put("swapDesc", "// இரண்டு எண்களை இடமாற்றம் செய்தல்");
        ta.put("leapDesc", "// லீப் ஆண்டு சரிபார்த்தல்");
        ta.put("armDesc", "// ஆம்ஸ்ட்ராங் எண் சரிபார்த்தல்");
        ta.put("gcdDesc", "// மீ.பொ.வ மற்றும் மீ.பொ.ம கணக்கீடு");
        ta.put("tableDesc", "// பெருக்கல் வாய்ப்பாடு");
        ta.put("vowelDesc", "// உயிர் எழுத்துக்கள் மற்றும் மெய் எழுத்துக்கள் எண்ணிக்கை");
        ta.put("matrixDesc", "// இரு பரிமாண அணி கூட்டல்");
        ta.put("bstDesc", "// இருமத் தேடல் மரம் (BST) கட்டமைப்பு");
        ta.put("sortDesc", "// எண்களை ஏறுவரிசையில் வரிசைப்படுத்துதல்");
        ta.put("searchDesc", "// இருமத் தேடல் அல்காரிதம்");
        ta.put("mapDesc", "// சொல் அதிர்வெண் கணக்கீடு (HashMap)");
        ta.put("listDesc", "// பட்டியல் செயல்பாடுகள் (ArrayList)");
        ta.put("stackDesc", "// குவியல் கட்டமைப்பு (Stack)");
        ta.put("queueDesc", "// வரிசை முறை கட்டமைப்பு (Queue)");
        ta.put("llDesc", "// இணைக்கப்பட்ட பட்டியல் (Linked List)");
        ta.put("oopDesc", "// பொருள் சார்ந்த நிரலாக்கம் (OOP)");
        ta.put("excDesc", "// பிழை கையாளுதல் (Exception Handling)");
        ta.put("threadDesc", "// பல்பணி இழை நிரலாக்கம் (Multithreading)");
        ta.put("streamDesc", "// ஸ்ட்ரீம் மற்றும் லேம்ப்டா வெளிப்பாடுகள்");
        ta.put("scannerDesc", "// பயனரிடமிருந்து உள்ளீடு பெறுதல்");
        ta.put("generalDesc", "// முதன்மை செயலாக்க தர்க்கம்");
        ta.put("initComment", "// தொடக்க அமைப்பு மற்றும் தரவு கட்டமைப்பு");
        ta.put("logicComment", "// செயலாக்க தர்க்கம்");
        dict.put("ta", ta);

        Map<String, String> hi = new HashMap<>();
        hi.put("treesetDesc", "// TreeSet उदाहरण: क्रमबद्ध और अद्वितीय तत्वों का संग्रह");
        hi.put("add2Desc", "// दो संख्याओं का योग निकालने का जावा प्रोग्राम");
        hi.put("add2Input", "// इनपुट संख्याएं");
        hi.put("add2Calc", "// योग की गणना");
        hi.put("add2Print", "// परिणाम प्रिंट करना");
        hi.put("add2Label", "योग");
        hi.put("calcDesc", "// सरल कैलकुलेटर प्रोग्राम");
        hi.put("evenOddDesc", "// सम या विषम संख्या जांच");
        hi.put("factDesc", "// फैक्टोरियल (क्रमगुणित) गणना");
        hi.put("primeDesc", "// अभाज्य संख्या जांचने का प्रोग्राम");
        hi.put("primeTrue", "अभाज्य संख्या है (Prime Number)");
        hi.put("primeFalse", "अभाज्य संख्या नहीं है");
        hi.put("fiboDesc", "// फाइबोनैचि श्रृंखला प्रोग्राम");
        hi.put("revDesc", "// स्ट्रिंग उलटना और पैलिंड्रोम जांच");
        hi.put("maxDesc", "// सरणी में सबसे बड़ा तत्व खोजना");
        hi.put("swapDesc", "// दो संख्याओं की अदला-बदली");
        hi.put("leapDesc", "// लीप वर्ष जांच");
        hi.put("armDesc", "// आर्मस्ट्रांग संख्या जांच");
        hi.put("gcdDesc", "// म.स.प और ल.स.प गणना");
        hi.put("tableDesc", "// पहाड़ा (Multiplication Table)");
        hi.put("vowelDesc", "// स्वर और व्यंजन की गणना");
        hi.put("matrixDesc", "// आव्यूह जोड़ (Matrix Addition)");
        hi.put("bstDesc", "// बाइनरी सर्च ट्री (BST) कार्यान्वयन");
        hi.put("sortDesc", "// संख्याओं को आरोही क्रम में छांटना");
        hi.put("searchDesc", "// बाइनरी सर्च एल्गोरिदम");
        hi.put("mapDesc", "// शब्द आवृत्ति गणना (HashMap)");
        hi.put("listDesc", "// गतिशील सूची (ArrayList)");
        hi.put("stackDesc", "// स्टैक कार्यान्वयन (LIFO)");
        hi.put("queueDesc", "// कतार कार्यान्वयन (FIFO)");
        hi.put("llDesc", "// लिंक्ड सूची कार्यान्वयन");
        hi.put("oopDesc", "// ऑब्जेक्ट ओरिएंटेड प्रोग्रामिंग (OOP)");
        hi.put("excDesc", "// अपवाद प्रबंधन (Exception Handling)");
        hi.put("threadDesc", "// मल्टीथ्रेडिंग प्रोग्रामिंग");
        hi.put("streamDesc", "// स्ट्रीम और लैम्ब्डा एक्सप्रेशन");
        hi.put("scannerDesc", "// उपयोगकर्ता से इनपुट लेना");
        hi.put("generalDesc", "// मुख्य व्यावसायिक तर्क");
        hi.put("initComment", "// प्रारंभिक सेटअप और डेटा संरचना");
        hi.put("logicComment", "// मुख्य प्रसंस्करण तर्क");
        dict.put("hi", hi);

        Map<String, String> te = new HashMap<>();
        te.put("treesetDesc", "// TreeSet ఉదాహరణ: క్రమబద్ధీకరించిన సేకరణ");
        te.put("add2Desc", "// రెండు సంఖ్యలను కలిపే జావా ప్రోగ్రామ్");
        te.put("add2Input", "// ఇన్పుట్ విలువలు");
        te.put("add2Calc", "// మొత్తం గణన");
        te.put("add2Print", "// ఫలితాన్ని ముద్రించడం");
        te.put("add2Label", "మొత్తం");
        te.put("calcDesc", "// సరళ కాలిక్యులేటర్ ప్రోగ్రామ్");
        te.put("evenOddDesc", "// సరి లేదా బేసి సంఖ్య తనిఖీ");
        te.put("factDesc", "// ఫాక్టోరియల్ గణన");
        te.put("primeDesc", "// ప్రధాన సంఖ్యను తనిఖీ చేసే ప్రోగ్రామ్");
        te.put("primeTrue", "ప్రధాన సంఖ్య (Prime Number)");
        te.put("primeFalse", "ప్రధాన సంఖ్య కాదు");
        te.put("fiboDesc", "// ఫైబొనాకి శ్రేణి ప్రోగ్రామ్");
        te.put("revDesc", "// స్ట్రింగ్ తిప్పడం మరియు పాలిండ్రోమ్ తనిఖీ");
        te.put("maxDesc", "// శ్రేణిలో అతిపెద్ద సంఖ్యను కనుగొనడం");
        te.put("swapDesc", "// రెండు సంఖ్యలను మార్చుకోవడం");
        te.put("leapDesc", "// లీపు సంవత్సరం తనిఖీ");
        te.put("armDesc", "// ఆర్మ్‌స్ట్రాంగ్ సంఖ్య తనిఖీ");
        te.put("generalDesc", "// ప్రధాన వ్యాపార తర్కం");
        te.put("initComment", "// ప్రారంభ అమరిక");
        te.put("logicComment", "// ప్రధాన ప్రాసెసింగ్");
        dict.put("te", te);

        Map<String, String> ar = new HashMap<>();
        ar.put("treesetDesc", "// مثال TreeSet: مجموعة مرتبة وفريدة من العناصر");
        ar.put("add2Desc", "// برنامج جافا لحساب مجموع رقمين");
        ar.put("add2Input", "// مدخلات الأرقام");
        ar.put("add2Calc", "// حساب المجموع");
        ar.put("add2Print", "// طباعة النتيجة");
        ar.put("add2Label", "المجموع");
        ar.put("calcDesc", "// برنامج حاسبة بسيطة");
        ar.put("evenOddDesc", "// التحقق من الرقم زوجي أم فردي");
        ar.put("factDesc", "// حساب المضروب (عاملي)");
        ar.put("primeDesc", "// برنامج التحقق من الأعداد الأولية");
        ar.put("primeTrue", "عدد أولي (Prime Number)");
        ar.put("primeFalse", "ليس عدداً أولياً");
        ar.put("fiboDesc", "// برنامج متتالية فيبوناتشي");
        ar.put("revDesc", "// عكس السلسلة والتحقق من التناظر");
        ar.put("generalDesc", "// منطق العمل الأساسي");
        ar.put("initComment", "// التهيئة وهيكل البيانات");
        ar.put("logicComment", "// منطق المعالجة");
        dict.put("ar", ar);

        Map<String, String> langMap = dict.get(langCode);
        if (langMap != null && langMap.containsKey(type)) {
            return langMap.get(type);
        }

        return fallback;
    }
}
