
export interface Subtopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  subtopics: Subtopic[];
}

export const dsaTopics: Topic[] = [
  {
    id: "complexity",
    name: "Time and Space Complexity",
    icon: "🧠",
    subtopics: [
      { id: "big-o", name: "Big O, Big Ω, Big Θ", completed: false },
      { id: "time-complexity", name: "Time Complexity of basic operations", completed: false },
      { id: "space-complexity", name: "Space Complexity", completed: false },
      { id: "best-worst-avg", name: "Best, Worst, Average Cases", completed: false },
      { id: "amortized", name: "Amortized Analysis", completed: false }
    ]
  },
  {
    id: "mathematics",
    name: "Mathematics for DSA",
    icon: "🧮",
    subtopics: [
      { id: "prime-sieve", name: "Prime Numbers & Sieve of Eratosthenes", completed: false },
      { id: "gcd-lcm", name: "GCD, LCM (Euclidean Algorithm)", completed: false },
      { id: "modular-arithmetic", name: "Modular Arithmetic", completed: false },
      { id: "fast-exponentiation", name: "Fast Exponentiation", completed: false },
      { id: "bit-manipulation-math", name: "Bit Manipulation", completed: false }
    ]
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    icon: "🔣",
    subtopics: [
      { id: "bitwise-ops", name: "AND, OR, XOR, NOT, Shift", completed: false },
      { id: "power-of-2", name: "Check if a number is power of 2", completed: false },
      { id: "count-set-bits", name: "Count set bits", completed: false },
      { id: "bit-masking", name: "Bit masking", completed: false },
      { id: "xor-trick", name: "XOR trick for finding odd occurring element", completed: false }
    ]
  },
  {
    id: "recursion-backtracking",
    name: "Recursion and Backtracking",
    icon: "📚",
    subtopics: [
      { id: "basic-recursion", name: "Basic recursion problems (factorial, Fibonacci)", completed: false },
      { id: "recursion-tree", name: "Recursion Tree and Stack space", completed: false },
      { id: "n-queens-sudoku", name: "Backtracking: N-Queens, Sudoku Solver", completed: false },
      { id: "subsets-permutations", name: "Subsets, Permutations, Combination Sum", completed: false }
    ]
  },
  {
    id: "arrays",
    name: "Arrays",
    icon: "📦",
    subtopics: [
      { id: "array-basics", name: "Traversal, Insertion, Deletion", completed: false },
      { id: "sorting-searching", name: "Searching & Sorting (Bubble, Selection, Insertion, Merge, Quick)", completed: false },
      { id: "kadane-algorithm", name: "Kadane's Algorithm", completed: false },
      { id: "prefix-sum", name: "Prefix Sum Array", completed: false },
      { id: "sliding-window", name: "Sliding Window Technique", completed: false },
      { id: "two-pointers", name: "Two Pointers Approach", completed: false },
      { id: "binary-search", name: "Binary Search & Variants", completed: false }
    ]
  },
  {
    id: "strings",
    name: "Strings",
    icon: "🧵",
    subtopics: [
      { id: "palindromes-anagram", name: "Palindromes, Anagram", completed: false },
      { id: "pattern-matching", name: "Pattern Matching (Naive, KMP, Rabin-Karp)", completed: false },
      { id: "stringbuilder", name: "StringBuilder in Java", completed: false },
      { id: "substring-generation", name: "Substring generation", completed: false },
      { id: "longest-common-prefix", name: "Longest Common Prefix", completed: false },
      { id: "longest-substring", name: "Longest Repeating/Non-Repeating Substring", completed: false }
    ]
  },
  {
    id: "linked-list",
    name: "Linked List",
    icon: "📊",
    subtopics: [
      { id: "singly-linked", name: "Singly Linked List", completed: false },
      { id: "doubly-linked", name: "Doubly Linked List", completed: false },
      { id: "circular-linked", name: "Circular Linked List", completed: false },
      { id: "reverse-linked", name: "Reverse a Linked List", completed: false },
      { id: "detect-loop", name: "Detect Loop (Floyd's Cycle)", completed: false },
      { id: "merge-sorted", name: "Merge Two Sorted Lists", completed: false },
      { id: "intersection-point", name: "Intersection Point of Two Lists", completed: false }
    ]
  },
  {
    id: "stacks-queues",
    name: "Stacks and Queues",
    icon: "📍",
    subtopics: [
      { id: "stack-implementation", name: "Stack: Using Arrays/Linked List", completed: false },
      { id: "infix-postfix", name: "Infix to Postfix/Prefix", completed: false },
      { id: "balanced-parentheses", name: "Balanced Parentheses", completed: false },
      { id: "stock-span", name: "Stock Span Problem", completed: false },
      { id: "next-greater", name: "Next Greater Element", completed: false },
      { id: "queue-implementation", name: "Queue: Using Arrays/Linked List", completed: false },
      { id: "circular-queue", name: "Circular Queue", completed: false },
      { id: "deque", name: "Deque (Double-Ended Queue)", completed: false },
      { id: "sliding-window-max", name: "Sliding Window Maximum (Deque)", completed: false },
      { id: "priority-queue", name: "Priority Queue / Min-Heap / Max-Heap", completed: false }
    ]
  },
  {
    id: "trees",
    name: "Trees",
    icon: "🌳",
    subtopics: [
      { id: "binary-tree-bst", name: "Binary Tree, Binary Search Tree (BST)", completed: false },
      { id: "tree-traversals", name: "Tree Traversals: Inorder, Preorder, Postorder (Recursive/Iterative)", completed: false },
      { id: "level-order", name: "Level Order Traversal (BFS)", completed: false },
      { id: "height-diameter", name: "Height, Diameter of Tree", completed: false },
      { id: "lca", name: "LCA (Lowest Common Ancestor)", completed: false },
      { id: "balanced-tree", name: "Balanced Binary Tree", completed: false },
      { id: "serialize-deserialize", name: "Serialize and Deserialize Tree", completed: false },
      { id: "trie", name: "Trie (Prefix Tree)", completed: false }
    ]
  },
  {
    id: "hashing",
    name: "Hashing",
    icon: "🔗",
    subtopics: [
      { id: "hashmap-hashset", name: "HashMap, HashSet in Java", completed: false },
      { id: "frequency-counter", name: "Frequency Counter", completed: false },
      { id: "group-anagrams", name: "Group Anagrams", completed: false },
      { id: "longest-consecutive", name: "Longest Consecutive Sequence", completed: false },
      { id: "subarray-sum-k", name: "Subarray Sum Equals K", completed: false },
      { id: "distinct-elements", name: "Count Distinct Elements in Window", completed: false }
    ]
  },
  {
    id: "heaps",
    name: "Heaps / Priority Queues",
    icon: "🧭",
    subtopics: [
      { id: "heap-basics", name: "Max-Heap / Min-Heap using PriorityQueue", completed: false },
      { id: "heapify-operations", name: "Heapify, Insertion, Deletion", completed: false },
      { id: "k-largest-smallest", name: "K Largest/Smallest Elements", completed: false },
      { id: "median-stream", name: "Median in Stream", completed: false },
      { id: "top-k-frequent", name: "Top K Frequent Elements", completed: false },
      { id: "heap-sort", name: "HeapSort", completed: false }
    ]
  },
  {
    id: "sliding-window-two-pointers",
    name: "Sliding Window & Two Pointers",
    icon: "🔁",
    subtopics: [
      { id: "max-sum-subarray", name: "Maximum Sum Subarray of Size K", completed: false },
      { id: "k-distinct-chars", name: "Longest Substring with K Distinct Characters", completed: false },
      { id: "container-water", name: "Container With Most Water", completed: false },
      { id: "minimum-window", name: "Minimum Window Substring", completed: false },
      { id: "remove-duplicates", name: "Remove Duplicates from Sorted Array", completed: false }
    ]
  },
  {
    id: "searching-sorting",
    name: "Searching & Sorting Algorithms",
    icon: "📈",
    subtopics: [
      { id: "linear-binary-search", name: "Linear & Binary Search", completed: false },
      { id: "merge-quick-heap", name: "Merge Sort, Quick Sort, Heap Sort", completed: false },
      { id: "counting-bucket-radix", name: "Counting Sort, Bucket Sort, Radix Sort", completed: false },
      { id: "order-statistics", name: "Order Statistics (Kth smallest/largest)", completed: false },
      { id: "rotated-array-search", name: "Search in Rotated Sorted Array", completed: false },
      { id: "binary-search-answer", name: "Binary Search on Answer (Optimization)", completed: false }
    ]
  },
  {
    id: "greedy",
    name: "Greedy Algorithms",
    icon: "🔄",
    subtopics: [
      { id: "activity-selection", name: "Activity Selection Problem", completed: false },
      { id: "fractional-knapsack", name: "Fractional Knapsack", completed: false },
      { id: "huffman-coding", name: "Huffman Coding", completed: false },
      { id: "job-sequencing", name: "Job Sequencing Problem", completed: false },
      { id: "minimum-platforms", name: "Minimum Platforms", completed: false },
      { id: "greedy-graphs", name: "Greedy for Graphs (Prim's Algorithm)", completed: false }
    ]
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming (DP)",
    icon: "🧩",
    subtopics: [
      { id: "memoization-tabulation", name: "Memoization and Tabulation", completed: false },
      { id: "knapsack-01", name: "0/1 Knapsack", completed: false },
      { id: "subset-sum", name: "Subset Sum, Partition Equal Subset", completed: false },
      { id: "lcs", name: "Longest Common Subsequence", completed: false },
      { id: "lis", name: "Longest Increasing Subsequence", completed: false },
      { id: "matrix-chain", name: "Matrix Chain Multiplication", completed: false },
      { id: "edit-distance", name: "Edit Distance", completed: false },
      { id: "dp-trees", name: "DP on Trees", completed: false }
    ]
  },
  {
    id: "graph-algorithms",
    name: "Graph Algorithms",
    icon: "🔗",
    subtopics: [
      { id: "graph-representation", name: "Representations: Adjacency List / Matrix", completed: false },
      { id: "bfs-dfs", name: "BFS and DFS", completed: false },
      { id: "connected-components", name: "Connected Components", completed: false },
      { id: "cycle-detection", name: "Cycle Detection (Directed/Undirected)", completed: false },
      { id: "topological-sort", name: "Topological Sort", completed: false },
      { id: "dijkstra", name: "Dijkstra's Algorithm", completed: false },
      { id: "bellman-ford", name: "Bellman-Ford Algorithm", completed: false },
      { id: "floyd-warshall", name: "Floyd-Warshall Algorithm", completed: false },
      { id: "mst-algorithms", name: "MST: Kruskal's and Prim's", completed: false },
      { id: "union-find", name: "Union-Find (DSU)", completed: false }
    ]
  },
  {
    id: "advanced-ds",
    name: "Advanced Data Structures",
    icon: "🌀",
    subtopics: [
      { id: "segment-tree", name: "Segment Tree (Range Queries)", completed: false },
      { id: "fenwick-tree", name: "Fenwick Tree (Binary Indexed Tree)", completed: false },
      { id: "dsu-advanced", name: "Disjoint Set Union (DSU)", completed: false },
      { id: "sparse-table", name: "Sparse Table", completed: false },
      { id: "trie-advanced", name: "Trie (Prefix Tree)", completed: false },
      { id: "avl-red-black", name: "AVL / Red-Black Trees (Theory)", completed: false },
      { id: "kmp-automaton", name: "KMP Automaton", completed: false }
    ]
  },
  {
    id: "miscellaneous",
    name: "Miscellaneous & Interview Patterns",
    icon: "🧠",
    subtopics: [
      { id: "divide-conquer", name: "Divide and Conquer", completed: false },
      { id: "meet-middle", name: "Meet in the Middle", completed: false },
      { id: "two-pointer-vs-binary", name: "Two Pointer vs Binary Search", completed: false },
      { id: "monotonic-stack", name: "Monotonic Stack/Queue", completed: false },
      { id: "matrix-problems", name: "Matrix Problems (Spiral, Search, Rotate)", completed: false },
      { id: "flood-fill", name: "Flood Fill Algorithm", completed: false },
      { id: "backtracking-vs-dp", name: "Backtracking vs DP", completed: false }
    ]
  }
];
