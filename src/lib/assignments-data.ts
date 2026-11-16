// ─────────────────────────────────────────────────────────────────────────────
// Hardcoded Assignment Library
// ─────────────────────────────────────────────────────────────────────────────

export interface AssignmentFile {
  name: string;
  content: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "bug-fix" | "code-review";
  language: string;
  estimatedTime: string;
  files: AssignmentFile[];
  solutions?: AssignmentFile[]; // Clean reference solution for students to view
  instructions: string;
  hints: string[];
  evaluationCriteria: string[];
  bugCount?: number;
  maxScore: number;
}

export const ASSIGNMENTS: Assignment[] = [
  // ─── 1. Bug Fix: Calculator ──────────────────────────────────────────────
  {
    id: "bug-fix-calculator",
    title: "🐛 Fix the Calculator",
    description:
      "A simple calculator that doesn't work properly. Find and fix the 4 bugs to make it functional!",
    difficulty: "beginner",
    type: "bug-fix",
    language: "HTML / CSS / JavaScript",
    estimatedTime: "20 mins",
    bugCount: 4,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
This calculator has **4 bugs** that prevent it from working correctly.

### What's broken:
1. The display doesn't show numbers when you click buttons
2. The addition operation gives wrong results
3. The clear button doesn't work
4. The equals button throws an error

### Your Task:
- Read through the code carefully
- Read through each function and inspect logic carefully
- Fix each bug
- Test your fixes mentally

### Scoring:
- Each bug fixed correctly = **2.5 points**
- Total: **10 points**`,
    hints: [
      "Check how the display element is being selected — is the ID correct?",
      "Look at how numbers are concatenated to the display — string vs number issue?",
      "The clear function references a variable — does that variable exist?",
      "The eval() function needs proper input — what is it receiving?",
    ],
    evaluationCriteria: [
      "getElementById uses the correct ID 'display' (not 'Display' or 'screen')",
      "Numbers are appended using string concatenation (display.value += num) not addition",
      "clearDisplay function correctly sets display.value to empty string ''",
      "calculate function uses display.value (not display.text or display.innerHTML)",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator">
        <input type="text" id="display" readonly>
        <div class="buttons">
            <button onclick="appendNumber('7')">7</button>
            <button onclick="appendNumber('8')">8</button>
            <button onclick="appendNumber('9')">9</button>
            <button onclick="appendOperator('+')">+</button>
            <button onclick="appendNumber('4')">4</button>
            <button onclick="appendNumber('5')">5</button>
            <button onclick="appendNumber('6')">6</button>
            <button onclick="appendOperator('-')">-</button>
            <button onclick="appendNumber('1')">1</button>
            <button onclick="appendNumber('2')">2</button>
            <button onclick="appendNumber('3')">3</button>
            <button onclick="appendOperator('*')">×</button>
            <button onclick="appendNumber('0')">0</button>
            <button onclick="appendOperator('.')">.</button>
            <button onclick="calculate()">=</button>
            <button onclick="clearDisplay()">C</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        content: `.calculator {
    max-width: 300px;
    margin: 50px auto;
    padding: 20px;
    border: 2px solid #333;
    border-radius: 10px;
    background: #222;
}

#display {
    width: 100%;
    height: 50px;
    font-size: 24px;
    text-align: right;
    padding: 5px 10px;
    margin-bottom: 10px;
    border: 1px solid #555;
    border-radius: 5px;
    background: #111;
    color: #0f0;
    box-sizing: border-box;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

button {
    padding: 15px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    background: #444;
    color: white;
    cursor: pointer;
}

button:hover {
    background: #666;
}`,
      },
      {
        name: "script.js",
        content: `// Calculator JavaScript
// There are 4 bugs in this code. Find and fix them!

// Hint: Compare this with what's in the HTML file
var screen = document.getElementById('Screen');

// This function adds a number to the display
function appendNumber(num) {
    // Hint: What operator would you use to add text to the end of existing text?
    screen.value = num;
}

// This function adds an operator (+, -, *, .)
function appendOperator(op) {
    screen.value += op;
}

// This function clears the display
function clearDisplay() {
    // Hint: Look at line 7 — what did we name it?
    display.value = '';
}

// This function calculates the result
function calculate() {
    try {
        // Hint: For an <input> element, how do you get what the user typed?
        var result = eval(screen.innerHTML);
        screen.value = result;
    } catch (e) {
        screen.value = 'Error';
    }
}`,
      },
    ],
    solutions: [
      {
            "name": "script.js",
            "content": "// Corrected Calculator JavaScript\n// 1. Correct element ID 'display'\nvar screen = document.getElementById('display');\n\n// 2. Append digit string to screen value\nfunction appendNumber(num) {\n    screen.value += num;\n}\n\n// 3. Append math operator\nfunction appendOperator(op) {\n    screen.value += op;\n}\n\n// 4. Correctly clear the screen\nfunction clearDisplay() {\n    screen.value = '';\n}\n\n// 5. Evaluate value directly\nfunction calculate() {\n    try {\n        var result = eval(screen.value);\n        screen.value = result;\n    } catch (e) {\n        screen.value = 'Error';\n    }\n}"
      }
],
  },

  // ─── 2. Bug Fix: To-Do List ──────────────────────────────────────────────
  {
    id: "bug-fix-todo",
    title: "🐛 Fix the To-Do List",
    description:
      "A to-do list app where adding and deleting tasks is broken. Fix the 3 bugs!",
    difficulty: "beginner",
    type: "bug-fix",
    language: "HTML / JavaScript",
    estimatedTime: "15 mins",
    bugCount: 3,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
This to-do list has **3 bugs**. Tasks can't be added or deleted properly.

### What's broken:
1. Clicking "Add" doesn't add the task
2. The task text always shows "undefined"
3. Delete buttons don't remove the right task

### Your Task:
- Read the JavaScript code
- Find and fix the errors in each function
- Make the to-do list fully functional`,
    hints: [
      "How do you get the value from an input element in JavaScript?",
      "Check the variable name — is 'taskText' being used consistently?",
      "When removing a child element, you need the parent first — which element is the parent?",
    ],
    evaluationCriteria: [
      "Input value is retrieved using .value property (not .text or .innerText)",
      "The variable name for task text is used consistently (taskInput.value not taskValue.value)",
      "removeChild is called on the correct parent element (taskList, not document.body)",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 40px auto; padding: 20px; }
        h1 { color: #333; }
        #taskInput { padding: 8px; width: 250px; border: 1px solid #ccc; border-radius: 4px; }
        #addBtn { padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
        #addBtn:hover { background: #45a049; }
        #taskList { list-style: none; padding: 0; margin-top: 20px; }
        #taskList li { padding: 10px; background: #f9f9f9; margin: 5px 0; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
        .deleteBtn { background: #ff4444; color: white; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; }
        .deleteBtn:hover { background: #cc0000; }
    </style>
</head>
<body>
    <h1>📝 My To-Do List</h1>
    <div>
        <input type="text" id="taskInput" placeholder="Enter a new task...">
        <button id="addBtn" onclick="addTask()">Add</button>
    </div>
    <ul id="taskList"></ul>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "script.js",
        content: `// To-Do List JavaScript
// There are 3 bugs. Find and fix them!

var taskInput = document.getElementById('taskInput');
var taskList = document.getElementById('taskList');

function addTask() {
    // Hint: An input element has a .value property that contains the text
    var taskText = taskInput;

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    var li = document.createElement('li');

    // Hint: Look at line 11 — what variable name did you use?
    li.textContent = task;

    // Create delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'deleteBtn';
    deleteBtn.onclick = function() {
        // Hint: The <li> elements live inside the <ul> element. What variable holds the <ul>?
        document.body.removeChild(li);
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    taskInput.value = '';
}`,
      },
    ],
    solutions: [
      {
            "name": "script.js",
            "content": "// Corrected To-Do List JavaScript\nvar taskInput = document.getElementById('taskInput');\nvar taskList = document.getElementById('taskList');\n\nfunction addTask() {\n    // 1. Get string value from input element\n    var taskText = taskInput.value.trim();\n\n    if (taskText === '') {\n        alert('Please enter a task!');\n        return;\n    }\n\n    var li = document.createElement('li');\n    // 2. Assign taskText properly\n    li.textContent = taskText;\n\n    var deleteBtn = document.createElement('button');\n    deleteBtn.textContent = 'Delete';\n    deleteBtn.className = 'deleteBtn';\n    deleteBtn.onclick = function() {\n        // 3. Remove from parent taskList\n        taskList.removeChild(li);\n    };\n\n    li.appendChild(deleteBtn);\n    taskList.appendChild(li);\n    taskInput.value = '';\n}"
      }
],
  },

  // ─── 3. Bug Fix: CSS Flexbox Layout ──────────────────────────────────────
  {
    id: "bug-fix-css-layout",
    title: "🐛 Fix the Broken Layout",
    description:
      "A profile card layout using CSS Flexbox is completely broken. Fix the 4 CSS bugs!",
    difficulty: "beginner",
    type: "bug-fix",
    language: "CSS",
    estimatedTime: "15 mins",
    bugCount: 4,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
A profile card should be centered on the page with items stacked vertically. But the CSS has **4 bugs**.

### What's broken:
1. The card is stuck in the top-left corner (should be centered)
2. Items inside the card are in a row (should be in a column)
3. The avatar image is huge (should be 100px)
4. The text color is invisible (same as background)

### Your Task:
- Find and fix the CSS styling issues
- Don't change the HTML`,
    hints: [
      "To center with flexbox, you need justify-content AND align-items on the container",
      "flex-direction: row puts items side by side. What value stacks them vertically?",
      "Width and height both need to be set for the avatar",
      "If background is white, what color should the text NOT be?",
    ],
    evaluationCriteria: [
      "Body has both justify-content: center and align-items: center for centering",
      "Card uses flex-direction: column (not row) to stack items vertically",
      "Avatar img has width and height set to 100px (or similar reasonable size)",
      "Text color is changed from white to a visible color (like #333 or black)",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Card</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="card">
        <img class="avatar" src="https://i.pravatar.cc/150" alt="Profile Picture">
        <h2 class="name">Alex Johnson</h2>
        <p class="bio">Full-stack developer who loves building things with code.</p>
        <div class="stats">
            <div class="stat">
                <strong>142</strong>
                <span>Projects</span>
            </div>
            <div class="stat">
                <strong>1.2k</strong>
                <span>Followers</span>
            </div>
            <div class="stat">
                <strong>89</strong>
                <span>Following</span>
            </div>
        </div>
    </div>
</body>
</html>`,
      },
      {
        name: "style.css",
        content: `/* Profile Card Styles */
/* There are 4 CSS bugs. Fix them! */

body {
    margin: 0;
    min-height: 100vh;
    display: flex;
       Hint: Flexbox needs justify-content and align-items set to 'center' */
    justify-content: flex-start;
    align-items: flex-start;
    background: #f0f2f5;
    font-family: Arial, sans-serif;
}

.card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    display: flex;
       Hint: flex-direction has two main values: 'row' and ??? */
    flex-direction: row;
    align-items: center;
    gap: 12px;
    max-width: 320px;
       Hint: The background is white. What color should text be so you can read it? */
    color: white;
}

.avatar {
       Hint: Set both width AND height to something like 100px. Also border-radius: 50% makes it a circle. */
    border-radius: 50%;
}

.name {
    margin: 0;
    font-size: 22px;
}

.bio {
    margin: 0;
    font-size: 14px;
    text-align: center;
    opacity: 0.7;
}

.stats {
    display: flex;
    gap: 24px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eee;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
}

.stat strong {
    font-size: 18px;
}`,
      },
    ],
    solutions: [
      {
            "name": "style.css",
            "content": "/* Corrected Profile Card Styles */\nbody {\n    margin: 0;\n    min-height: 100vh;\n    display: flex;\n    /* 1. Center card in viewport */\n    justify-content: center;\n    align-items: center;\n    background: #f0f2f5;\n    font-family: Arial, sans-serif;\n}\n\n.card {\n    background: white;\n    border-radius: 16px;\n    padding: 30px;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n    display: flex;\n    /* 2. Vertical column layout */\n    flex-direction: column;\n    align-items: center;\n    gap: 12px;\n    max-width: 320px;\n    /* 3. Dark visible text color */\n    color: #1e293b;\n}\n\n.avatar {\n    /* 4. Set explicit avatar dimensions */\n    width: 100px;\n    height: 100px;\n    border-radius: 50%;\n    object-fit: cover;\n}\n\n.name {\n    margin: 0;\n    font-size: 22px;\n}\n\n.bio {\n    margin: 0;\n    font-size: 14px;\n    text-align: center;\n    opacity: 0.7;\n}\n\n.stats {\n    display: flex;\n    gap: 24px;\n    margin-top: 16px;\n    padding-top: 16px;\n    border-top: 1px solid #eee;\n}\n\n.stat {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    font-size: 14px;\n}\n\n.stat strong {\n    font-size: 18px;\n}"
      }
],
  },

  // ─── 4. Code Review: Login Form ──────────────────────────────────────────
  {
    id: "code-review-login",
    title: "🔍 Review the Login Form",
    description:
      "This login form works, but has serious bad practices. Identify and explain 4 problems!",
    difficulty: "intermediate",
    type: "code-review",
    language: "HTML / JavaScript",
    estimatedTime: "20 mins",
    maxScore: 10,
    instructions: `## 🎯 Your Mission
This login form technically works, but it has **4 bad practices** that a professional developer would never allow.

### What to look for:
1. **Security issues** — Is sensitive data handled safely?
2. **Accessibility** — Can everyone use this form?
3. **Code quality** — Is the code clean and maintainable?
4. **User experience** — Is the form user-friendly?

### Your Task:
Write a **code review** in the review.txt file. For each issue:
1. **What's wrong** (one sentence)
2. **Why it's bad** (explain the consequence)
3. **How to fix it** (describe the fix — don't write the code!)

### Scoring:
- Each well-identified issue = **2.5 points**
- Must explain both the problem AND why it matters`,
    hints: [
      "Look at how the password is being handled — is it visible? Is it stored?",
      "Are there any labels for screen readers?",
      "Check if the form has proper validation",
      "Look at the hardcoded credentials — would you do this in a real app?",
    ],
    evaluationCriteria: [
      "Identifies that the password is hardcoded in JavaScript (security issue - anyone can see it in source code)",
      "Identifies missing accessibility: no <label> elements linked to inputs (screen readers can't identify fields)",
      "Identifies that password input uses type='text' instead of type='password' (password is visible on screen)",
      "Identifies that form uses alert() for feedback instead of proper UI elements, and/or no proper form validation",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
        .login-box { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 300px; }
        .login-box h2 { margin-top: 0; text-align: center; }
        input { width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 14px; }
        button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 10px; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>🔐 Login</h2>
        <input type="text" id="username" placeholder="Username">
        <input type="text" id="password" placeholder="Password">
        <button onclick="login()">Sign In</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "script.js",
        content: `// Login Form JavaScript
// This code WORKS, but has several bad practices.
// Your job: REVIEW it and explain what's wrong and why.

// The correct credentials
var correctUsername = "admin";
var correctPassword = "password123";

function login() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;

    if (user === correctUsername && pass === correctPassword) {
        alert('Login successful! Welcome, ' + user + '!');
        window.location.href = '/dashboard';
    } else {
        alert('Wrong username or password! Try again.');
    }
}`,
      },
      {
        name: "review.txt",
        content: `CODE REVIEW — Login Form
========================

Instructions: For each issue you find, write:
1. What's wrong (one sentence)
2. Why it's bad (explain the consequence)
3. How to fix it (describe the approach)

Find at least 4 issues.

─────────────────────────────────

Issue 1:
What's wrong: 
Why it's bad: 
How to fix it: 

─────────────────────────────────

Issue 2:
What's wrong: 
Why it's bad: 
How to fix it: 

─────────────────────────────────

Issue 3:
What's wrong: 
Why it's bad: 
How to fix it: 

─────────────────────────────────

Issue 4:
What's wrong: 
Why it's bad: 
How to fix it: 
`,
      },
    ],
    solutions: [
      {
            "name": "review.txt",
            "content": "CODE REVIEW — Login Form (Model Solution)\n=========================================\n\nIssue 1:\nWhat's wrong: Passwords and credentials are hardcoded directly in client-side JavaScript.\nWhy it's bad: Anyone can inspect page source code or dev tools and instantly steal the admin credentials.\nHow to fix it: Authenticate against a secure backend server endpoint over HTTPS using hashed passwords.\n\nIssue 2:\nWhat's wrong: Password input element uses type=\"text\" instead of type=\"password\".\nWhy it's bad: Passwords appear in plain text on screen, making them vulnerable to shoulder surfing.\nHow to fix it: Change the input tag attribute to type=\"password\" so entered text is masked.\n\nIssue 3:\nWhat's wrong: Inputs lack semantic <label> tags and accessible names.\nWhy it's bad: Screen readers and assistive technologies cannot tell users which field is for username and which is for password.\nHow to fix it: Add <label for=\"username\"> and <label for=\"password\"> tags linked to corresponding input IDs.\n\nIssue 4:\nWhat's wrong: Uses browser window.alert() popups instead of inline error/success messages.\nWhy it's bad: alert() blocks browser thread execution, prevents modern responsive UI design, and provides poor UX.\nHow to fix it: Render friendly inline toast notifications or text alert containers within the form container."
      }
],
  },

  // ─── 5. Bug Fix: Counter App ──────────────────────────────────────────────
  {
    id: "bug-fix-counter",
    title: "🐛 Fix the Counter App",
    description:
      "A click counter with increment, decrement, and reset — but 3 bugs prevent it from working.",
    difficulty: "beginner",
    type: "bug-fix",
    language: "HTML / JavaScript",
    estimatedTime: "10 mins",
    bugCount: 3,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
A simple counter app with +1, -1, and reset buttons. It has **3 bugs**.

### What's broken:
1. The counter display always shows "NaN"
2. The decrement button increases instead of decreasing
3. The reset button doesn't reset to 0

### Your Task:
- Fix the bugs in \`script.js\`
- The counter should start at 0, go up with +, down with -, and reset with R`,
    hints: [
      "NaN appears when you try to do math on something that's not a number. How is 'count' initialized?",
      "Check the operator in the decrement function — is it + or -?",
      "What value should count be set to in the reset function?",
    ],
    evaluationCriteria: [
      "count is initialized as a number (var count = 0) not as a string",
      "decrement function uses subtraction (count-- or count -= 1 or count = count - 1)",
      "reset function sets count to 0 (not null, undefined, or empty string)",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Click Counter</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: white; }
        .counter-app { text-align: center; }
        h1 { font-size: 16px; opacity: 0.7; text-transform: uppercase; letter-spacing: 2px; }
        .count-display { font-size: 80px; font-weight: bold; margin: 20px 0; }
        .buttons { display: flex; gap: 12px; justify-content: center; }
        button { padding: 12px 24px; font-size: 20px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
        button:hover { background: rgba(255,255,255,0.2); }
        .minus { color: #ff6b6b; border-color: #ff6b6b; }
        .plus { color: #51cf66; border-color: #51cf66; }
        .reset { color: #ffd43b; border-color: #ffd43b; }
    </style>
</head>
<body>
    <div class="counter-app">
        <h1>Click Counter</h1>
        <div class="count-display" id="countDisplay">0</div>
        <div class="buttons">
            <button class="minus" onclick="decrement()">−1</button>
            <button class="reset" onclick="resetCount()">↺</button>
            <button class="plus" onclick="increment()">+1</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "script.js",
        content: `// Click Counter
// There are 3 bugs. Find and fix them!

var display = document.getElementById('countDisplay');

// Hint: What happens when you try to add 1 to the text "zero"?
var count = "zero";

function increment() {
    count++;
    display.textContent = count;
}

function decrement() {
    // Hint: The decrement button should make the number go DOWN
    count++;
    display.textContent = count;
}

function resetCount() {
    // Hint: What number represents "nothing" or "start over"?
    count = null;
    display.textContent = count;
}`,
      },
    ],
    solutions: [
      {
            "name": "script.js",
            "content": "// Corrected Counter State\nvar display = document.getElementById('countDisplay');\n\n// 1. Initial count must be a numeric integer\nvar count = 0;\n\nfunction increment() {\n    count++;\n    display.textContent = count;\n}\n\nfunction decrement() {\n    // 2. Decrement subtracts 1\n    count--;\n    display.textContent = count;\n}\n\nfunction resetCount() {\n    // 3. Reset resets count to 0\n    count = 0;\n    display.textContent = count;\n}"
      }
],
  },

  // ─── 6. Code Review: Array Functions ─────────────────────────────────────
  {
    id: "code-review-arrays",
    title: "🔍 Review the Array Functions",
    description:
      "These JavaScript array utility functions work but are poorly written. Find 4 bad practices!",
    difficulty: "intermediate",
    type: "code-review",
    language: "JavaScript",
    estimatedTime: "20 mins",
    maxScore: 10,
    instructions: `## 🎯 Your Mission
These array helper functions technically produce correct results, but they use **4 anti-patterns** (bad coding habits).

### What to look for:
1. **Unnecessary complexity** — Is there a simpler way?
2. **Wrong tool for the job** — Are the right array methods being used?
3. **Variable naming** — Are names clear and descriptive?
4. **Code repetition** — Is anything repeated unnecessarily?

### Your Task:
Write your review in \`review.txt\`. For each issue:
1. Name the function with the problem
2. What's the anti-pattern
3. What would be better and why`,
    hints: [
      "JavaScript has built-in methods like .find(), .filter(), .reduce() — are they being used?",
      "Variable names like 'x', 'temp', 'arr' don't tell you what they hold",
      "A for loop that builds a boolean could be replaced with a single method call",
      "Using var instead of let/const is an outdated practice",
    ],
    evaluationCriteria: [
      "Identifies that findItem uses a manual loop instead of the built-in .find() method",
      "Identifies poor variable naming (x, arr, temp are not descriptive)",
      "Identifies that hasItem manually loops to check existence when .includes() or .some() exists",
      "Identifies code duplication or that getEvens/getOdds could use .filter() instead of a manual for loop",
    ],
    files: [
      {
        name: "utils.js",
        content: `// Array Utility Functions
// These all WORK correctly, but they're poorly written.
// Find the anti-patterns and bad practices!

// Find an item in the array by name
function findItem(arr, name) {
    var temp = null;
    for (var x = 0; x < arr.length; x++) {
        if (arr[x].name === name) {
            temp = arr[x];
            break;
        }
    }
    return temp;
}

// Check if array contains an item
function hasItem(arr, item) {
    var found = false;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            found = true;
        }
    }
    return found;
}

// Get only even numbers from array
function getEvens(arr) {
    var temp = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0) {
            temp.push(arr[i]);
        }
    }
    return temp;
}

// Get only odd numbers from array
function getOdds(arr) {
    var temp = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] % 2 !== 0) {
            temp.push(arr[i]);
        }
    }
    return temp;
}

// Calculate average of numbers
function calcAvg(arr) {
    var t = 0;
    for (var i = 0; i < arr.length; i++) {
        t = t + arr[i];
    }
    return t / arr.length;
}`,
      },
      {
        name: "review.txt",
        content: `CODE REVIEW — Array Utility Functions
======================================

Instructions: Find at least 4 anti-patterns/bad practices.
For each, write:
1. Which function has the problem
2. What's wrong (the anti-pattern)
3. What would be better and why

─────────────────────────────────

Issue 1:
Function: 
Anti-pattern: 
Better approach: 

─────────────────────────────────

Issue 2:
Function: 
Anti-pattern: 
Better approach: 

─────────────────────────────────

Issue 3:
Function: 
Anti-pattern: 
Better approach: 

─────────────────────────────────

Issue 4:
Function: 
Anti-pattern: 
Better approach: 
`,
      },
    ],
    solutions: [
      {
            "name": "review.txt",
            "content": "CODE REVIEW — Array Utility Functions (Model Solution)\n======================================================\n\nIssue 1:\nFunction: findItem\nAnti-pattern: Manual for-loop with temporary state variable.\nBetter approach: Use native Array.prototype.find(): return arr.find(item => item.name === name) || null;\n\nIssue 2:\nFunction: hasItem\nAnti-pattern: Iterating entire array even after finding item.\nBetter approach: Use native Array.prototype.includes() for primitive arrays or .some(): return arr.includes(item);\n\nIssue 3:\nFunction: getEvens & getOdds\nAnti-pattern: Duplicate manual loop logic with push.\nBetter approach: Use Array.prototype.filter(): return arr.filter(num => num % 2 === 0);\n\nIssue 4:\nFunction: General / calcAvg\nAnti-pattern: Use of legacy 'var' and single-letter variables (t, x).\nBetter approach: Use const/let and descriptive names or Array.prototype.reduce() to compute sums cleanly."
      }
],
  },

  // ─── 7. Bug Fix: Form Validation ─────────────────────────────────────────
  {
    id: "bug-fix-form-validation",
    title: "🐛 Fix the Registration Form",
    description:
      "A registration form with email and password validation that has 4 bugs. Fix them all!",
    difficulty: "intermediate",
    type: "bug-fix",
    language: "HTML / JavaScript",
    estimatedTime: "20 mins",
    bugCount: 4,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
A registration form validates email and password but has **4 bugs**.

### What's broken:
1. Email validation accepts anything (even "hello")
2. Password length check is wrong
3. Error messages don't show up
4. Form submits even when validation fails

### Your Task:
- Fix the validation logic in \`script.js\`
- The form should only submit when both fields are valid`,
    hints: [
      "To check if something contains '@', use the .includes() method",
      "Password should be at LEAST 8 characters — is the comparison operator correct?",
      "Check if the error element is being selected with the right ID",
      "What should a validation function return when it fails? true or false?",
    ],
    evaluationCriteria: [
      "Email validation checks for '@' symbol using includes('@') or indexOf('@')",
      "Password validation uses >= 8 (not > 8 or < 8) for minimum length",
      "Error element is correctly selected using the matching ID from HTML",
      "validateForm returns false when validation fails (to prevent form submission)",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Form</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f8f9fa; }
        .form-container { background: white; padding: 32px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); width: 360px; }
        h2 { margin-top: 0; color: #333; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #555; }
        input { width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
        input:focus { border-color: #4dabf7; outline: none; }
        .error { color: #e03131; font-size: 12px; margin-top: 4px; display: none; }
        .error.show { display: block; }
        button { width: 100%; padding: 12px; background: #4dabf7; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; margin-top: 8px; }
        button:hover { background: #339af0; }
        .success { color: #2f9e44; font-size: 14px; text-align: center; margin-top: 12px; display: none; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>📝 Create Account</h2>
        <form onsubmit="return validateForm()">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="text" id="email" placeholder="you@example.com">
                <p class="error" id="emailError">Please enter a valid email</p>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="At least 8 characters">
                <p class="error" id="passwordError">Password must be at least 8 characters</p>
            </div>
            <button type="submit">Register</button>
            <p class="success" id="successMsg">✅ Account created!</p>
        </form>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "script.js",
        content: `// Registration Form Validation
// There are 4 bugs. Find and fix them!

function validateForm() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Hint: Look at the HTML — what is the ID of the email error paragraph?
    var emailError = document.getElementById('email_error');

    var passwordError = document.getElementById('passwordError');
    var successMsg = document.getElementById('successMsg');
    var isValid = true;

    // Reset
    emailError.classList.remove('show');
    passwordError.classList.remove('show');
    successMsg.style.display = 'none';

    // Hint: Every email must contain an '@' symbol. How do you check if a string contains something?
    if (email.length > 0) {
        // This just checks if the email is not empty — that's not enough!
        // "hello" would pass but it's not a valid email
    } else {
        emailError.classList.add('show');
        isValid = false;
    }

    // Hint: Password should be at LEAST 8 characters. "At least 8" means 8 or more.
    if (password.length > 8) {
        // This requires 9+ characters instead of 8+
    } else {
        passwordError.classList.add('show');
        isValid = false;
    }

    if (isValid) {
        successMsg.style.display = 'block';
    }

    // Hint: If isValid is false, the form should NOT submit. What should you return?
    return true;
}`,
      },
    ],
    solutions: [
      {
            "name": "script.js",
            "content": "// Corrected Registration Form Validation\nfunction validateForm() {\n    var email = document.getElementById('email').value.trim();\n    var password = document.getElementById('password').value;\n\n    // 1. Correct element ID matching HTML\n    var emailError = document.getElementById('emailError');\n    var passwordError = document.getElementById('passwordError');\n    var successMsg = document.getElementById('successMsg');\n    var isValid = true;\n\n    emailError.classList.remove('show');\n    passwordError.classList.remove('show');\n    successMsg.style.display = 'none';\n\n    // 2. Check for @ symbol\n    if (email.includes('@') && email.length > 3) {\n    } else {\n        emailError.classList.add('show');\n        isValid = false;\n    }\n\n    // 3. At least 8 characters (>= 8)\n    if (password.length >= 8) {\n    } else {\n        passwordError.classList.add('show');\n        isValid = false;\n    }\n\n    if (isValid) {\n        successMsg.style.display = 'block';\n    }\n\n    // 4. Return false to prevent submission if invalid\n    return isValid;\n}"
      }
],
  },

  // ─── 8. Bug Fix: Color Changer ───────────────────────────────────────────
  {
    id: "bug-fix-color-changer",
    title: "🐛 Fix the Color Changer",
    description:
      "An interactive page where clicking buttons changes the background color. 3 bugs to fix!",
    difficulty: "beginner",
    type: "bug-fix",
    language: "HTML / JavaScript",
    estimatedTime: "10 mins",
    bugCount: 3,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
Click a button → background color changes. Simple! But 3 bugs break it.

### What's broken:
1. Clicking any button throws an error in the console
2. The random color function generates invalid colors
3. The color name display doesn't update

### Your Task:
- Fix the \`script.js\` bugs
- Each button should change the background to its color
- The "Random" button should pick a random color`,
    hints: [
      "Check how the body element is being accessed — is there a typo?",
      "A hex color code needs exactly 6 characters after the #. Check the loop.",
      "Look at what property is being used to display text — textContent or value?",
    ],
    evaluationCriteria: [
      "document.body is used correctly (not documnt.body or document.bod)",
      "Random color hex loop runs 6 times (not 3 or some other number) to generate valid 6-digit hex",
      "Color name is displayed using textContent (not value, since it's a span/div not an input)",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Color Changer</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; transition: background-color 0.5s ease; }
        h1 { color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .color-display { color: white; font-size: 24px; margin: 20px 0; text-shadow: 0 1px 3px rgba(0,0,0,0.3); }
        .buttons { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        button { padding: 12px 24px; border: 2px solid white; border-radius: 25px; font-size: 16px; cursor: pointer; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.3); transition: transform 0.2s; }
        button:hover { transform: scale(1.1); }
        .red { background: #e74c3c; }
        .blue { background: #3498db; }
        .green { background: #2ecc71; }
        .purple { background: #9b59b6; }
        .random { background: #333; }
    </style>
</head>
<body>
    <h1>🎨 Color Changer</h1>
    <div class="color-display">Current: <span id="colorName">None</span></div>
    <div class="buttons">
        <button class="red" onclick="changeColor('#e74c3c', 'Red')">Red</button>
        <button class="blue" onclick="changeColor('#3498db', 'Blue')">Blue</button>
        <button class="green" onclick="changeColor('#2ecc71', 'Green')">Green</button>
        <button class="purple" onclick="changeColor('#9b59b6', 'Purple')">Purple</button>
        <button class="random" onclick="randomColor()">🎲 Random</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "script.js",
        content: `// Color Changer
// There are 3 bugs. Find and fix them!

var colorName = document.getElementById('colorName');

function changeColor(color, name) {
    // Hint: Check the spelling carefully — JavaScript is case-sensitive!
    documnt.body.style.backgroundColor = color;

    // Hint: <span> is not an <input>, so it doesn't have a .value property
    colorName.value = name;
}

function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    // Hint: Change the loop to run 6 times instead of 3
    for (var i = 0; i < 3; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    changeColor(color, color);
}`,
      },
    ],
    solutions: [
      {
            "name": "script.js",
            "content": "var colorName = document.getElementById('colorName');\n\nfunction changeColor(color, name) {\n    // 1. Fix typo: document.body\n    document.body.style.backgroundColor = color;\n    // 2. Use textContent for span element\n    colorName.textContent = name;\n}\n\nfunction randomColor() {\n    var letters = '0123456789ABCDEF';\n    var color = '#';\n    // 3. Loop 6 times for full 6-digit hex code\n    for (var i = 0; i < 6; i++) {\n        color += letters[Math.floor(Math.random() * 16)];\n    }\n    changeColor(color, color);\n}"
      }
],
  },

  // ─── 9. Bug Fix: Digital Clock & Dark Mode ────────────────────────────────
  {
    id: "bug-fix-digital-clock",
    title: "⏰ Fix the Digital Clock & Theme",
    description:
      "A glowing digital clock with theme toggle. Fix 3 bugs to display real time with leading zeroes!",
    difficulty: "beginner",
    type: "bug-fix",
    language: "HTML / CSS / JavaScript",
    estimatedTime: "15 mins",
    bugCount: 3,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
A digital clock displays current hours, minutes, and seconds, with a Dark/Light toggle. It currently has **3 bugs**.

### What's broken:
1. Seconds show as single digits without leading zeroes (e.g., '9' instead of '09').
2. The clock never updates automatically — it remains frozen at initial time.
3. Dark mode toggle button doesn't switch the theme class.

### Your Task:
- Inspect \`script.js\` and fix the bugs.
- Verify in Live Preview that the clock ticks every second.`,
    hints: [
      "To update every second, which browser timer function should you call? setTimeout or setInterval?",
      "To pad a number with a leading zero if under 10: (num < 10 ? '0' + num : num) or .padStart(2, '0').",
      "Look at classList methods: does .toggle() exist, or is there a typo?",
    ],
    evaluationCriteria: [
      "Clock updates every second using setInterval(updateClock, 1000)",
      "Minutes and seconds are padded with leading zeros when less than 10",
      "Theme toggle works by adding/toggling the 'dark' or 'light' class correctly on document.body",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Digital Clock</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="dark">
    <div class="clock-container">
        <button id="themeBtn" onclick="toggleTheme()">☀️ Light Mode</button>
        <div class="time-box">
            <span id="hours">00</span>:<span id="minutes">00</span>:<span id="seconds">00</span>
            <span id="ampm">AM</span>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        content: `body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Courier New', monospace;
    transition: background 0.3s, color 0.3s;
}

body.dark {
    background: #0f172a;
    color: #38bdf8;
}

body.light {
    background: #f8fafc;
    color: #0284c7;
}

.clock-container {
    text-align: center;
    padding: 30px 40px;
    border-radius: 16px;
    background: rgba(0, 0, 0, 0.2);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.time-box {
    font-size: 48px;
    font-weight: bold;
    letter-spacing: 2px;
    margin-top: 15px;
}

#ampm {
    font-size: 20px;
    margin-left: 8px;
}

#themeBtn {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid currentColor;
    background: transparent;
    color: inherit;
    cursor: pointer;
}`,
      },
      {
        name: "script.js",
        content: `// Digital Clock
// 3 bugs to fix!

function updateClock() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();

    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;

    // When seconds = 5, it shows '5' instead of '05'.
    // Fix: Pad them with a '0' if they are less than 10.
    var formattedMinutes = m;
    var formattedSeconds = s;

    document.getElementById('hours').textContent = h;
    document.getElementById('minutes').textContent = formattedMinutes;
    document.getElementById('seconds').textContent = formattedSeconds;
    document.getElementById('ampm').textContent = ampm;
}

// Hint: What function calls updateClock repeatedly every second?
updateClock();
// setTimeout(updateClock, 1000); // Only runs once!

function toggleTheme() {
    // Hint: The method is toggle, not togle
    document.body.classList.togle('light');
    var isLight = document.body.classList.contains('light');
    document.getElementById('themeBtn').textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
}`,
      },
    ],
    solutions: [
      {
            "name": "script.js",
            "content": "function updateClock() {\n    var now = new Date();\n    var h = now.getHours();\n    var m = now.getMinutes();\n    var s = now.getSeconds();\n\n    var ampm = h >= 12 ? 'PM' : 'AM';\n    h = h % 12;\n    h = h ? h : 12;\n\n    // 1. Pad single digits with leading zeroes\n    var formattedMinutes = m < 10 ? '0' + m : m;\n    var formattedSeconds = s < 10 ? '0' + s : s;\n\n    document.getElementById('hours').textContent = h;\n    document.getElementById('minutes').textContent = formattedMinutes;\n    document.getElementById('seconds').textContent = formattedSeconds;\n    document.getElementById('ampm').textContent = ampm;\n}\n\nupdateClock();\n// 2. Update every second continuously\nsetInterval(updateClock, 1000);\n\nfunction toggleTheme() {\n    // 3. Correct method: toggle\n    document.body.classList.toggle('light');\n    var isLight = document.body.classList.contains('light');\n    document.getElementById('themeBtn').textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';\n}"
      }
],
  },

  // ─── 10. Bug Fix: Quiz Game ──────────────────────────────────────────────
  {
    id: "bug-fix-quiz-app",
    title: "🧠 Fix the Interactive Quiz",
    description:
      "A 3-question trivia quiz. Fix 3 bugs in score calculation and moving to the next question!",
    difficulty: "intermediate",
    type: "bug-fix",
    language: "HTML / JavaScript",
    estimatedTime: "20 mins",
    bugCount: 3,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
A web quiz gives score feedback at the end. Fix **3 bugs** preventing questions from advancing and score from counting.

### What's broken:
1. Clicking options always marks them as wrong even when correct.
2. The current question index isn't incremented.
3. Final score shows as undefined.`,
    hints: [
      "Check the strict equality comparison in checkAnswer() — is it comparing index with text or number?",
      "Remember to increment currentQuestionIndex after an answer.",
      "Look at how the final score text is interpolated.",
    ],
    evaluationCriteria: [
      "Correct answers match question.correctIndex properly",
      "currentQuestionIndex increments when an option is selected",
      "Final score is calculated and displayed accurately out of total questions",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html>
<head>
    <title>Code Quiz</title>
    <style>
        body { font-family: sans-serif; background: #e2e8f0; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;}
        .quiz-card { background:white; padding:24px; border-radius:12px; width:340px; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
        .option-btn { width:100%; margin:8px 0; padding:10px; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer; background:#f8fafc; text-align:left; }
        .option-btn:hover { background:#e2e8f0; }
        #result { text-align:center; font-size:20px; font-weight:bold; color:#10b981; }
    </style>
</head>
<body>
    <div class="quiz-card">
        <h3 id="question">Question</h3>
        <div id="options"></div>
        <div id="result"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "script.js",
        content: `var questions = [
    { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Language", "Hyperlinks Text Mark"],
    solutions: [
      {
            "name": "script.js",
            "content": "var questions = [\n    { q: \"What does HTML stand for?\", options: [\"Hyper Text Markup Language\", \"Home Tool Language\", \"Hyperlinks Text Mark\"], correct: 0 },\n    { q: \"Which keyword creates a variable in JS?\", options: [\"var\", \"define\", \"allocate\"], correct: 0 },\n    { q: \"What tag links CSS in HTML?\", options: [\"<script>\", \"<link>\", \"<style-src>\"], correct: 1 }\n];\n\nvar currentIndex = 0;\nvar score = 0;\n\nfunction loadQuestion() {\n    if (currentIndex >= questions.length) {\n        document.getElementById('question').style.display = 'none';\n        document.getElementById('options').style.display = 'none';\n        // 3. Fixed variable name to score\n        document.getElementById('result').textContent = \"Quiz Done! Score: \" + score + \"/\" + questions.length;\n        return;\n    }\n\n    var q = questions[currentIndex];\n    document.getElementById('question').textContent = q.q;\n    var opts = document.getElementById('options');\n    opts.innerHTML = '';\n\n    q.options.forEach(function(optText, idx) {\n        var btn = document.createElement('button');\n        btn.className = 'option-btn';\n        btn.textContent = optText;\n        btn.onclick = function() { checkAnswer(idx); };\n        opts.appendChild(btn);\n    });\n}\n\nfunction checkAnswer(chosenIndex) {\n    // 1. Check against correct question property\n    if (chosenIndex === questions[currentIndex].correct) {\n        score++;\n    }\n    // 2. Advance question index\n    currentIndex++;\n    loadQuestion();\n}\n\nloadQuestion();"
      }
], correct: 0 },
    { q: "Which keyword creates a variable in JS?", options: ["var", "define", "allocate"], correct: 0 },
    { q: "What tag links CSS in HTML?", options: ["<script>", "<link>", "<style-src>"], correct: 1 }
];

var currentIndex = 0;
var score = 0;

function loadQuestion() {
    if (currentIndex >= questions.length) {
        document.getElementById('question').style.display = 'none';
        document.getElementById('options').style.display = 'none';
        document.getElementById('result').textContent = "Quiz Done! Score: " + userScore + "/" + questions.length;
        return;
    }

    var q = questions[currentIndex];
    document.getElementById('question').textContent = q.q;
    var opts = document.getElementById('options');
    opts.innerHTML = '';

    q.options.forEach(function(optText, idx) {
        var btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = optText;
        btn.onclick = function() { checkAnswer(idx); };
        opts.appendChild(btn);
    });
}

function checkAnswer(chosenIndex) {
    // Hint: Currently comparing with wrong property
    if (chosenIndex === questions[currentIndex].answer) {
        score++;
    }

    // Hint: What happens to currentIndex before calling loadQuestion()?
    loadQuestion();
}

loadQuestion();`,
      },
    ],
  },

  // ─── 11. Bug Fix: Rock Paper Scissors ────────────────────────────────────
  {
    id: "bug-fix-rock-paper-scissors",
    title: "✊ Fix Rock Paper Scissors Game",
    description:
      "A classic Rock-Paper-Scissors game against the computer. Fix the game rules logic and score updates!",
    difficulty: "beginner",
    type: "bug-fix",
    language: "HTML / JavaScript",
    estimatedTime: "15 mins",
    bugCount: 3,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
Play Rock, Paper, Scissors against the computer. There are **3 bugs** in winner determination and score display.

### What's broken:
1. Rock vs Scissors incorrectly awards a point to Computer.
2. Tie results give a point to Player.
3. Computer choice index calculation is out of range.`,
    hints: [
      "In Rock Paper Scissors: Rock beats Scissors, Scissors beats Paper, Paper beats Rock.",
      "Check Math.floor(Math.random() * choices.length).",
      "Check the condition for ties (playerChoice === computerChoice).",
    ],
    evaluationCriteria: [
      "Computer random selection generates valid index between 0 and 2",
      "Tie condition does not increment either player or computer score",
      "Rock vs Scissors correctly identifies player as winner",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html>
<head>
    <title>Rock Paper Scissors</title>
    <style>
        body { font-family: sans-serif; text-align: center; background: #fafafa; padding-top: 40px; }
        .choices button { font-size: 32px; padding: 12px 20px; margin: 10px; cursor: pointer; border-radius: 12px; border: 2px solid #ddd; background: white; }
        .choices button:hover { background: #f0f0f0; }
        .scoreboard { font-size: 20px; font-weight: bold; margin: 20px; }
        #message { font-size: 18px; color: #4b5563; min-height: 24px; }
    </style>
</head>
<body>
    <h1>✊ Rock Paper Scissors ✌️</h1>
    <div class="choices">
        <button onclick="play('rock')">🪨</button>
        <button onclick="play('paper')">📄</button>
        <button onclick="play('scissors')">✂️</button>
    </div>
    <div class="scoreboard">
        Player: <span id="pScore">0</span> | Computer: <span id="cScore">0</span>
    </div>
    <p id="message">Pick a move to start!</p>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "script.js",
        content: `var pScore = 0;
var cScore = 0;
var choices = ['rock', 'paper', 'scissors'];

function play(player) {
    // Hint: choices has length 3, so multiply by 3 or choices.length
    var computer = choices[Math.floor(Math.random() * 4)];

    var msg = document.getElementById('message');

    // Currently ties award a player point!
    if (player === computer) {
        pScore++;
        msg.textContent = "It's a Tie! Both picked " + player;
    } else if (
        (player === 'rock' && computer === 'paper') || // Wait, does rock beat paper?
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        pScore++;
        msg.textContent = "You win! " + player + " beats " + computer;
    } else {
        cScore++;
        msg.textContent = "Computer wins! " + computer + " beats " + player;
    }

    document.getElementById('pScore').textContent = pScore;
    document.getElementById('cScore').textContent = cScore;
}`,
      },
    ],
    solutions: [
      {
            "name": "script.js",
            "content": "var pScore = 0;\nvar cScore = 0;\nvar choices = ['rock', 'paper', 'scissors'];\n\nfunction play(player) {\n    // 1. Valid range 0-2 (multiply by 3 or choices.length)\n    var computer = choices[Math.floor(Math.random() * choices.length)];\n\n    var msg = document.getElementById('message');\n\n    // 2. Ties do not award points\n    if (player === computer) {\n        msg.textContent = \"It's a Tie! Both picked \" + player;\n    } else if (\n        // 3. Correct win conditions for player\n        (player === 'rock' && computer === 'scissors') ||\n        (player === 'paper' && computer === 'rock') ||\n        (player === 'scissors' && computer === 'paper')\n    ) {\n        pScore++;\n        msg.textContent = \"You win! \" + player + \" beats \" + computer;\n    } else {\n        cScore++;\n        msg.textContent = \"Computer wins! \" + computer + \" beats \" + player;\n    }\n\n    document.getElementById('pScore').textContent = pScore;\n    document.getElementById('cScore').textContent = cScore;\n}"
      }
],
  },

  // ─── 12. Bug Fix: Password Generator ─────────────────────────────────────
  {
    id: "bug-fix-password-generator",
    title: "🔐 Fix the Random Password Generator",
    description:
      "A utility to generate secure passwords with custom length and symbols. Fix 3 bugs!",
    difficulty: "intermediate",
    type: "bug-fix",
    language: "HTML / JavaScript",
    estimatedTime: "15 mins",
    bugCount: 3,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
A tool to generate random strong passwords. Fix **3 bugs** so it generates passwords of the exact chosen length and copies them properly.

### What's broken:
1. Generated password length is fixed instead of reading user input.
2. Numbers/symbols characters aren't included when checkboxes are checked.
3. The Copy to Clipboard button throws an error.`,
    hints: [
      "Convert length input string value to number with parseInt().",
      "Check if checkbox.checked is true before appending symbol characters.",
      "Use navigator.clipboard.writeText(text) to copy safely.",
    ],
    evaluationCriteria: [
      "Password length correctly reads from document.getElementById('length').value",
      "Characters pool conditionally appends symbols based on checkbox state",
      "Password is copied to clipboard using navigator.clipboard API",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html>
<head>
    <title>Password Generator</title>
    <style>
        body { font-family: sans-serif; background: #0f172a; color: white; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; }
        .box { background: #1e293b; padding: 24px; border-radius: 12px; width: 320px; }
        input[type="text"] { width: 100%; padding: 10px; font-size: 16px; font-family: monospace; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #38bdf8; box-sizing: border-box; }
        .btn { width: 100%; padding: 10px; margin-top: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .btn-gen { background: #38bdf8; color: #0f172a; }
        .btn-copy { background: #334155; color: white; }
        .row { margin: 12px 0; font-size: 14px; display: flex; justify-content: space-between; }
    </style>
</head>
<body>
    <div class="box">
        <h3>🔑 PassGen</h3>
        <input type="text" id="passDisplay" readonly placeholder="Click Generate">
        <div class="row">
            <label>Length:</label>
            <input type="number" id="length" value="12" min="6" max="30" style="width:60px">
        </div>
        <div class="row">
            <label>Include Symbols (!@#$):</label>
            <input type="checkbox" id="symbols" checked>
        </div>
        <button class="btn btn-gen" onclick="generatePass()">Generate Password</button>
        <button class="btn btn-copy" onclick="copyPass()">Copy to Clipboard</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "script.js",
        content: `function generatePass() {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var symbols = "!@#$%^&*()_+~";

    var includeSymbols = document.getElementById('symbols');
    if (includeSymbols) {
        chars += symbols;
    }

    // Hint: Read parseInt(document.getElementById('length').value)
    var len = 8;

    var password = "";
    for (var i = 0; i < len; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById('passDisplay').value = password;
}

function copyPass() {
    var text = document.getElementById('passDisplay').value;
    // Hint: navigator.clipboard.writeText(text)
    navigator.clipbord.writeText(text).then(function() {
        alert("Copied!");
    });
}`,
      },
    ],
    solutions: [
      {
            "name": "script.js",
            "content": "function generatePass() {\n    var chars = \"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\";\n    var symbols = \"!@#$%^&*()_+~\";\n\n    var includeSymbols = document.getElementById('symbols');\n    // 1. Check .checked property\n    if (includeSymbols && includeSymbols.checked) {\n        chars += symbols;\n    }\n\n    // 2. Read user numeric value from input\n    var len = parseInt(document.getElementById('length').value) || 12;\n\n    var password = \"\";\n    for (var i = 0; i < len; i++) {\n        password += chars.charAt(Math.floor(Math.random() * chars.length));\n    }\n\n    document.getElementById('passDisplay').value = password;\n}\n\nfunction copyPass() {\n    var text = document.getElementById('passDisplay').value;\n    // 3. Fix typo in clipboard API: navigator.clipboard\n    navigator.clipboard.writeText(text).then(function() {\n        alert(\"Copied to clipboard!\");\n    });\n}"
      }
],
  },

  // ─── 13. Bug Fix: Filterable Search List ──────────────────────────────────
  {
    id: "bug-fix-search-filter",
    title: "🔍 Fix the Dynamic Search Filter",
    description:
      "A fast student/user search filter that matches names dynamically as you type. Fix 3 bugs!",
    difficulty: "intermediate",
    type: "bug-fix",
    language: "HTML / JavaScript",
    estimatedTime: "15 mins",
    bugCount: 3,
    maxScore: 10,
    instructions: `## 🎯 Your Mission
As you type in the search box, the items list should filter in real time. Fix **3 bugs** in event listening and case-insensitive comparison.

### What's broken:
1. Typing does not trigger any filter event.
2. Search is case-sensitive, so 'john' doesn't match 'John'.
3. Items that do not match are not hidden properly.`,
    hints: [
      "Use the 'input' or 'keyup' event on the input box.",
      "Convert both search term and item text to lowercase with .toLowerCase().",
      "To hide non-matching items, set style.display = 'none', otherwise 'block'.",
    ],
    evaluationCriteria: [
      "Search input has an event listener for 'input' or 'keyup'",
      "Comparison uses .toLowerCase() on both query and item text",
      "Non-matching items are hidden (display = 'none') and matching items shown (display = '')",
    ],
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html>
<head>
    <title>Search Filter</title>
    <style>
        body { font-family: sans-serif; max-width: 360px; margin: 40px auto; }
        #search { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 14px; box-sizing: border-box; }
        ul { list-style: none; padding: 0; margin-top: 15px; }
        li { padding: 10px; border-bottom: 1px solid #eee; }
    </style>
</head>
<body>
    <h2>User Directory</h2>
    <input type="text" id="search" placeholder="Type name to filter...">
    <ul id="userList">
        <li>Emma Watson</li>
        <li>John Doe</li>
        <li>Sophia Miller</li>
        <li>Alex Turner</li>
        <li>Daniel Craig</li>
        <li>Michael Scott</li>
    </ul>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "script.js",
        content: `var searchInput = document.getElementById('search');
var items = document.querySelectorAll('#userList li');

// Hint: Add an 'input' event listener to searchInput to trigger filterList
// searchInput.addEventListener('...', filterList);

function filterList() {
    var query = searchInput.value;

    for (var i = 0; i < items.length; i++) {
        var text = items[i].textContent;

        // 'john' won't match 'John Doe'.
        // Hint: Use .toLowerCase() on query and text
        if (text.includes(query)) {
            items[i].style.display = 'none';
        } else {
            items[i].style.display = 'block';
        }
    }
}

// Call once
filterList();`,
      },
    ],
    solutions: [
      {
            "name": "script.js",
            "content": "var searchInput = document.getElementById('search');\nvar items = document.querySelectorAll('#userList li');\n\n// 1. Attach input event listener\nsearchInput.addEventListener('input', filterList);\n\nfunction filterList() {\n    // 2. Case-insensitive lowercase matching\n    var query = searchInput.value.toLowerCase();\n\n    for (var i = 0; i < items.length; i++) {\n        var text = items[i].textContent.toLowerCase();\n\n        // 3. Show matching items, hide non-matching\n        if (text.includes(query)) {\n            items[i].style.display = 'block';\n        } else {\n            items[i].style.display = 'none';\n        }\n    }\n}\n\nfilterList();"
      }
],
  },
];

export function getAssignment(id: string): Assignment | undefined {
  return ASSIGNMENTS.find((a) => a.id === id);
}

export function getAssignmentsByDifficulty(
  difficulty: Assignment["difficulty"]
): Assignment[] {
  return ASSIGNMENTS.filter((a) => a.difficulty === difficulty);
}

export function getAssignmentsByType(type: Assignment["type"]): Assignment[] {
  return ASSIGNMENTS.filter((a) => a.type === type);
}
