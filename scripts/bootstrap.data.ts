export const users = [
  {
    nameId: "mallikarjun-reddy",
    name: "Dr. Mallikarjun Reddy",
    email: "mallikarjun.reddy@iiits.in",
    role: "owner",
  },
  {
    nameId: "himangshu-sharma",
    name: "Dr. Himangshu Sharma",
    email: "himangshu.sharma@iiits.in",
    role: "admin",
  },
  {
    nameId: "pavan-kumar",
    name: "Dr. Pavan Kumar BN",
    email: "pavan.kumar@iiits.in",
    role: "admin",
  },
  {
    nameId: "aahnik-daw",
    name: "Aahnik Daw",
    email: "aahnik.daw@iiits.in",
    role: "member",
  },
  {
    nameId: "saurabh-pal",
    name: "Saurabh Pal",
    email: "saurabh.pal@iiits.in",
    role: "member",
  },
  {
    nameId: "aryan-sharma",
    name: "Aryan Sharma",
    email: "aryan.sharma@iiits.in",
    role: "member",
  },
  {
    nameId: "srinath-krishna",
    name: "Srinath Krishna Kumar",
    email: "srinath.krishna@iiits.in",
    role: "member",
  },
];

export const organization = {
  nameId: "iiit-sri-city",
  name: "IIIT Sri City",
  about: "International Institute of Information Technology, Sri City",
};

export const contests = [
  {
    nameId: "mid-1-evaluation",
    name: "Mid-1 Evaluation",
    description:
      "First mid-semester evaluation covering basic data structures and algorithms",
    rules:
      "Duration: 2 hours\nAllowed Languages: Python, C++, Java\nInternet access not allowed",
    startTime: new Date("2024-03-15T10:00:00"),
    endTime: new Date("2024-03-15T12:00:00"),
  },
  {
    nameId: "mid-2-evaluation",
    name: "Mid-2 Evaluation",
    description:
      "Second mid-semester evaluation focusing on advanced algorithms",
    rules:
      "Duration: 2 hours\nAllowed Languages: Python, C++, Java\nInternet access not allowed",
    startTime: new Date("2024-04-20T10:00:00"),
    endTime: new Date("2024-04-20T12:00:00"),
  },
  {
    nameId: "end-term-evaluation",
    name: "End-term Evaluation",
    description: "Final evaluation covering all topics from the semester",
    rules:
      "Duration: 10 hours\nAllowed Languages: Python, C++, Java\nInternet access not allowed",
    startTime: new Date("2024-05-07T10:00:00"),
    endTime: new Date("2024-05-07T20:00:00"),
  },
  {
    nameId: "practice-evaluation",
    name: "Practice Evaluation",
    description: "Practice session for upcoming evaluations",
    rules:
      "Duration: 2 hours\nAllowed Languages: Python, C++, Java\nInternet access allowed for documentation",
    startTime: new Date("2024-05-14T10:00:00"),
    endTime: new Date("2024-05-14T12:00:00"),
  },
  {
    nameId: "lab-exam",
    name: "Lab Exam",
    description: "Practical examination focusing on implementation skills",
    rules:
      "Duration: 3 hours\nAllowed Languages: Python, C++, Java\nInternet access allowed for documentation",
    startTime: new Date("2024-05-21T10:00:00"),
    endTime: new Date("2024-05-21T13:00:00"),
  },
];

export const problems = [
  {
    code: "two-sum",
    title: "Two Sum",
    description: `# Two Sum

## Problem Statement
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

## Input Format
First line contains n, the size of array
Second line contains n space-separated integers
Third line contains target

## Output Format
Print two space-separated integers representing the indices

## Constraints
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists

## Example
### Input
\`\`\`
4
2 7 11 15
9
\`\`\`

### Output
\`\`\`
0 1
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1", kind: "example" },
      { input: "3\n3 2 4\n6", output: "1 2", kind: "example" },
      { input: "2\n3 3\n6", output: "0 1", kind: "test" },
    ],
  },
  {
    code: "valid-parentheses",
    title: "Valid Parentheses",
    description: `# Valid Parentheses

## Problem Statement
Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

## Input Format
A single line containing the string s

## Output Format
Print "true" if valid, "false" otherwise

## Constraints
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'

## Example
### Input
\`\`\`
()
\`\`\`

### Output
\`\`\`
true
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "()", output: "true", kind: "example" },
      { input: "()[]{}", output: "true", kind: "example" },
      { input: "(]", output: "false", kind: "test" },
    ],
  },
  {
    code: "merge-sorted-arrays",
    title: "Merge Sorted Arrays",
    description: `# Merge Sorted Arrays

## Problem Statement
Merge two sorted arrays nums1 and nums2 into a single sorted array.

## Input Format
First line contains n, size of first array
Second line contains n space-separated integers
Third line contains m, size of second array
Fourth line contains m space-separated integers

## Output Format
Print the merged sorted array

## Constraints
- 1 <= n, m <= 10^4
- -10^9 <= nums1[i], nums2[i] <= 10^9

## Example
### Input
\`\`\`
3
1 2 3
3
2 5 6
\`\`\`

### Output
\`\`\`
1 2 2 3 5 6
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "3\n1 2 3\n3\n2 5 6", output: "1 2 2 3 5 6", kind: "example" },
      { input: "1\n1\n0\n", output: "1", kind: "example" },
      { input: "0\n\n1\n1", output: "1", kind: "test" },
    ],
  },
  {
    code: "binary-search",
    title: "Binary Search",
    description: `# Binary Search

## Problem Statement
Given a sorted array of integers nums and a target value, return the index of target in nums, or -1 if not found.

## Input Format
First line contains n, size of array
Second line contains n space-separated integers
Third line contains target

## Output Format
Print the index of target, or -1 if not found

## Constraints
- 1 <= nums.length <= 10^4
- -10^9 <= nums[i], target <= 10^9
- nums is sorted in ascending order

## Example
### Input
\`\`\`
6
-1 0 3 5 9 12
9
\`\`\`

### Output
\`\`\`
4
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "6\n-1 0 3 5 9 12\n9", output: "4", kind: "example" },
      { input: "6\n-1 0 3 5 9 12\n2", output: "-1", kind: "example" },
      { input: "1\n5\n5", output: "0", kind: "test" },
    ],
  },
  {
    code: "reverse-linked-list",
    title: "Reverse Linked List",
    description: `# Reverse Linked List

## Problem Statement
Given the head of a singly linked list, reverse the list and return the new head.

## Input Format
First line contains n, number of nodes
Second line contains n space-separated integers representing node values

## Output Format
Print the reversed linked list values

## Constraints
- 0 <= n <= 5000
- -5000 <= Node.val <= 5000

## Example
### Input
\`\`\`
5
1 2 3 4 5
\`\`\`

### Output
\`\`\`
5 4 3 2 1
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "5\n1 2 3 4 5", output: "5 4 3 2 1", kind: "example" },
      { input: "2\n1 2", output: "2 1", kind: "example" },
      { input: "0\n", output: "", kind: "test" },
    ],
  },
  {
    code: "valid-palindrome",
    title: "Valid Palindrome",
    description: `# Valid Palindrome

## Problem Statement
Given a string s, return true if it is a palindrome, or false otherwise.

## Input Format
A single line containing string s

## Output Format
Print "true" if palindrome, "false" otherwise

## Constraints
- 1 <= s.length <= 2 * 10^5
- s consists only of printable ASCII characters

## Example
### Input
\`\`\`
A man, a plan, a canal: Panama
\`\`\`

### Output
\`\`\`
true
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      {
        input: "A man, a plan, a canal: Panama",
        output: "true",
        kind: "example",
      },
      { input: "race a car", output: "false", kind: "example" },
      { input: " ", output: "true", kind: "test" },
    ],
  },
  {
    code: "climbing-stairs",
    title: "Climbing Stairs",
    description: `# Climbing Stairs

## Problem Statement
You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

## Input Format
A single integer n

## Output Format
Print the number of distinct ways to climb n stairs

## Constraints
- 1 <= n <= 45

## Example
### Input
\`\`\`
3
\`\`\`

### Output
\`\`\`
3
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "3", output: "3", kind: "example" },
      { input: "2", output: "2", kind: "example" },
      { input: "1", output: "1", kind: "test" },
    ],
  },
  {
    code: "best-time-to-buy-sell",
    title: "Best Time to Buy and Sell Stock",
    description: `# Best Time to Buy and Sell Stock

## Problem Statement
Given an array prices where prices[i] is the price of a given stock on the ith day, find the maximum profit you can achieve.

## Input Format
First line contains n, size of array
Second line contains n space-separated integers

## Output Format
Print the maximum profit

## Constraints
- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^4

## Example
### Input
\`\`\`
6
7 1 5 3 6 4
\`\`\`

### Output
\`\`\`
5
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "6\n7 1 5 3 6 4", output: "5", kind: "example" },
      { input: "5\n7 6 4 3 1", output: "0", kind: "example" },
      { input: "2\n1 2", output: "1", kind: "test" },
    ],
  },
  {
    code: "maximum-subarray",
    title: "Maximum Subarray",
    description: `# Maximum Subarray

## Problem Statement
Find the contiguous subarray with the largest sum and return its sum.

## Input Format
First line contains n, size of array
Second line contains n space-separated integers

## Output Format
Print the sum of the maximum subarray

## Constraints
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4

## Example
### Input
\`\`\`
9
-2 1 -3 4 -1 2 1 -5 4
\`\`\`

### Output
\`\`\`
6
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", kind: "example" },
      { input: "1\n1", output: "1", kind: "example" },
      { input: "5\n5 4 -1 7 8", output: "23", kind: "test" },
    ],
  },
  {
    code: "house-robber",
    title: "House Robber",
    description: `# House Robber

## Problem Statement
Given an array of integers nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

## Input Format
First line contains n, number of houses
Second line contains n space-separated integers

## Output Format
Print the maximum amount that can be robbed

## Constraints
- 1 <= nums.length <= 100
- 0 <= nums[i] <= 400

## Example
### Input
\`\`\`
4
1 2 3 1
\`\`\`

### Output
\`\`\`
4
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "4\n1 2 3 1", output: "4", kind: "example" },
      { input: "5\n2 7 9 3 1", output: "12", kind: "example" },
      { input: "2\n2 1", output: "2", kind: "test" },
    ],
  },
  {
    code: "word-break",
    title: "Word Break",
    description: `# Word Break

## Problem Statement
Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.

## Input Format
First line contains string s
Second line contains n, number of words
Next n lines contain words

## Output Format
Print "true" if possible, "false" otherwise

## Constraints
- 1 <= s.length <= 300
- 1 <= wordDict.length <= 1000
- 1 <= wordDict[i].length <= 20

## Example
### Input
\`\`\`
leetcode
2
leet
code
\`\`\`

### Output
\`\`\`
true
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "leetcode\n2\nleet\ncode", output: "true", kind: "example" },
      {
        input: "applepenapple\n2\napple\npen",
        output: "true",
        kind: "example",
      },
      { input: "catsandog\n3\ncats\ndog\nsand", output: "false", kind: "test" },
    ],
  },
  {
    code: "coin-change",
    title: "Coin Change",
    description: `# Coin Change

## Problem Statement
Given an array of coins and an amount, return the minimum number of coins needed to make up that amount.

## Input Format
First line contains n, number of coins
Second line contains n space-separated integers
Third line contains amount

## Output Format
Print the minimum number of coins needed, or -1 if impossible

## Constraints
- 1 <= coins.length <= 12
- 1 <= coins[i] <= 2^31 - 1
- 0 <= amount <= 10^4

## Example
### Input
\`\`\`
3
1 2 5
11
\`\`\`

### Output
\`\`\`
3
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "3\n1 2 5\n11", output: "3", kind: "example" },
      { input: "1\n2\n3", output: "-1", kind: "example" },
      { input: "1\n1\n0", output: "0", kind: "test" },
    ],
  },
  {
    code: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    description: `# Longest Increasing Subsequence

## Problem Statement
Given an array of integers, find the length of the longest strictly increasing subsequence.

## Input Format
First line contains n, size of array
Second line contains n space-separated integers

## Output Format
Print the length of longest increasing subsequence

## Constraints
- 1 <= nums.length <= 2500
- -10^4 <= nums[i] <= 10^4

## Example
### Input
\`\`\`
8
10 9 2 5 3 7 101 18
\`\`\`

### Output
\`\`\`
4
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "8\n10 9 2 5 3 7 101 18", output: "4", kind: "example" },
      { input: "6\n0 1 0 3 2 3", output: "4", kind: "example" },
      { input: "1\n7", output: "1", kind: "test" },
    ],
  },
  {
    code: "word-ladder",
    title: "Word Ladder",
    description: `# Word Ladder

## Problem Statement
Given two words beginWord and endWord, and a dictionary wordList, return the length of the shortest transformation sequence.

## Input Format
First line contains beginWord
Second line contains endWord
Third line contains n, size of wordList
Next n lines contain words

## Output Format
Print the length of shortest sequence, or 0 if impossible

## Constraints
- 1 <= beginWord.length <= 10
- endWord.length == beginWord.length
- 1 <= wordList.length <= 5000
- wordList[i].length == beginWord.length

## Example
### Input
\`\`\`
hit
cog
6
hot
dot
dog
lot
log
cog
\`\`\`

### Output
\`\`\`
5
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      {
        input: "hit\ncog\n6\nhot\ndot\ndog\nlot\nlog\ncog",
        output: "5",
        kind: "example",
      },
      {
        input: "hit\ncog\n6\nhot\ndot\ndog\nlot\nlog",
        output: "0",
        kind: "example",
      },
      { input: "hit\nhit\n1\nhit", output: "1", kind: "test" },
    ],
  },
  {
    code: "course-schedule",
    title: "Course Schedule",
    description: `# Course Schedule

## Problem Statement
Given the total number of courses and a list of prerequisite pairs, determine if it is possible to finish all courses.

## Input Format
First line contains n, number of courses
Second line contains m, number of prerequisites
Next m lines contain two space-separated integers

## Output Format
Print "true" if possible, "false" otherwise

## Constraints
- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000
- prerequisites[i].length == 2

## Example
### Input
\`\`\`
4
4
1 0
2 0
3 1
3 2
\`\`\`

### Output
\`\`\`
true
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "4\n4\n1 0\n2 0\n3 1\n3 2", output: "true", kind: "example" },
      { input: "2\n2\n1 0\n0 1", output: "false", kind: "example" },
      { input: "1\n0\n", output: "true", kind: "test" },
    ],
  },
  {
    code: "redundant-connection",
    title: "Redundant Connection",
    description: `# Redundant Connection

## Problem Statement
Given a graph that started as a tree with n nodes labeled from 1 to n, find the edge that can be removed to make the graph a tree.

## Input Format
First line contains n, number of nodes
Second line contains m, number of edges
Next m lines contain two space-separated integers

## Output Format
Print the edge that can be removed

## Constraints
- n == edges.length
- 3 <= n <= 1000
- edges[i].length == 2
- 1 <= edges[i][0] < edges[i][1] <= n

## Example
### Input
\`\`\`
3
3
1 2
1 3
2 3
\`\`\`

### Output
\`\`\`
2 3
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      { input: "3\n3\n1 2\n1 3\n2 3", output: "2 3", kind: "example" },
      {
        input: "5\n5\n1 2\n2 3\n3 4\n1 4\n1 5",
        output: "1 4",
        kind: "example",
      },
      { input: "2\n2\n1 2\n1 2", output: "1 2", kind: "test" },
    ],
  },
  {
    code: "word-search",
    title: "Word Search",
    description: `# Word Search

## Problem Statement
Given an m x n grid of characters board and a string word, return true if word exists in the grid.

## Input Format
First line contains m and n, dimensions of grid
Next m lines contain n characters each
Last line contains word

## Output Format
Print "true" if word exists, "false" otherwise

## Constraints
- m == board.length
- n == board[i].length
- 1 <= m, n <= 6
- 1 <= word.length <= 15

## Example
### Input
\`\`\`
3 4
A B C E
S F C S
A D E E
ABCCED
\`\`\`

### Output
\`\`\`
true
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      {
        input: "3 4\nA B C E\nS F C S\nA D E E\nABCCED",
        output: "true",
        kind: "example",
      },
      {
        input: "3 4\nA B C E\nS F C S\nA D E E\nSEE",
        output: "true",
        kind: "example",
      },
      {
        input: "3 4\nA B C E\nS F C S\nA D E E\nABCB",
        output: "false",
        kind: "test",
      },
    ],
  },
  {
    code: "number-of-islands",
    title: "Number of Islands",
    description: `# Number of Islands

## Problem Statement
Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.

## Input Format
First line contains m and n, dimensions of grid
Next m lines contain n characters each (0 or 1)

## Output Format
Print the number of islands

## Constraints
- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 300
- grid[i][j] is '0' or '1'

## Example
### Input
\`\`\`
4 5
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
\`\`\`

### Output
\`\`\`
3
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      {
        input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1",
        output: "3",
        kind: "example",
      },
      { input: "3 3\n1 1 1\n1 1 1\n1 1 1", output: "1", kind: "example" },
      { input: "1 1\n0", output: "0", kind: "test" },
    ],
  },
  {
    code: "surrounded-regions",
    title: "Surrounded Regions",
    description: `# Surrounded Regions

## Problem Statement
Given an m x n matrix board containing 'X' and 'O', capture all regions that are 4-directionally surrounded by 'X'.

## Input Format
First line contains m and n, dimensions of board
Next m lines contain n characters each (X or O)

## Output Format
Print the modified board

## Constraints
- m == board.length
- n == board[i].length
- 1 <= m, n <= 200
- board[i][j] is 'X' or 'O'

## Example
### Input
\`\`\`
4 4
X X X X
X O O X
X X O X
X O X X
\`\`\`

### Output
\`\`\`
X X X X
X X X X
X X X X
X O X X
\`\`\``,
    allowedLanguages: ["python", "cpp", "java"],
    testCases: [
      {
        input: "4 4\nX X X X\nX O O X\nX X O X\nX O X X",
        output: "X X X X\nX X X X\nX X X X\nX O X X",
        kind: "example",
      },
      { input: "1 1\nO", output: "O", kind: "example" },
      { input: "2 2\nO O\nO O", output: "O O\nO O", kind: "test" },
    ],
  },
];
