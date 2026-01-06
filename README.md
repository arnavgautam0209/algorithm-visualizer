# 🎨 Algorithm Visualizer

Hey there! 👋 Welcome to my Algorithm Visualizer project. I built this because honestly, I was tired of trying to understand algorithms from static diagrams and boring textbook explanations. So I thought, why not make it fun and interactive?

## 🤔 What is this?

This is a web app that lets you **actually see** how different algorithms work in real-time. No more staring at pseudocode trying to figure out what's happening - just watch the magic unfold!

### What's included:
- 📊 **Sorting Algorithms** - Watch Bubble Sort, Quick Sort, Merge Sort, etc. in action
- 🔍 **Searching Algorithms** - See how Binary Search beats Linear Search every time
- 🗺️ **Graph Algorithms** - Visualize pathfinding with BFS, DFS, Dijkstra, and more
- 🌳 **Tree Traversals** - Understand Inorder, Preorder, Postorder visually
- 💡 **Dynamic Programming** - Finally understand DP with animated tables
- 🔄 **Recursion & Backtracking** - See the call stack come to life

## 🚀 Quick Start

Want to run this locally? Super easy:

```bash
# Clone the repo (duh)
git clone https://github.com/arnavgautam0209/algorithm-visualizer.git

# Go into the folder
cd algorithm-visualizer

# Install the dependencies (grab a coffee, might take a minute)
npm install

# Fire it up!
npm run dev
```

Then open your browser and go to `http://localhost:5173` - that's it! 🎉

## 🛠️ Built With

- **React 18** - Because hooks are awesome
- **TypeScript** - For when I want to catch bugs before they catch me
- **Vite** - Fast refresh is a game changer
- **React Router** - For the smooth navigation
- **CSS3** - All those fancy animations? Pure CSS baby 💅

## 💭 Why I Built This

I'm a CS student and I struggled A LOT with understanding algorithms when I first learned them. Reading about them is one thing, but seeing them work is a whole different story. This project started as my way to learn these algorithms better, and I figured others might find it useful too.

Plus, it was a great excuse to learn React and TypeScript properly 😅

## 🎯 Roadmap (aka my TODO list)

- [ ] Add more sorting algorithms (Radix Sort, Counting Sort)
- [ ] Add sound effects (because why not?)
- [ ] Dark mode (my eyes at 2 AM will thank me)
- [ ] Mobile-responsive improvements
- [ ] Add A* algorithm visualization
- [ ] Maybe add some ML algorithms? We'll see...

## 🐛 Known Issues

- Sometimes the animations can be a bit wonky on slower machines
- The graph visualizer could use some UX improvements
- Need to add input validation in a few places (I know, I know...)

## 📚 What I Learned

This project taught me SO much:
- React hooks and component lifecycle (useState, useEffect are my best friends now)
- TypeScript (still learning, but getting better!)
- Animation timing and performance optimization
- Graph data structures and traversal algorithms
- That CSS can be both beautiful and frustrating 😤

## 🤝 Contributing

Found a bug? Have a cool idea? Feel free to open an issue or submit a PR! I'd love to see what others come up with.

Just keep it friendly and constructive - we're all learning here 🙂

## 📝 License

MIT License - do whatever you want with it! Just maybe give me a shoutout if you use it 😊

## 🙏 Credits

- Shoutout to all the YouTube tutorials and StackOverflow posts that saved my life
- Coffee ☕ (lots of it)
- My friends who beta tested this and gave honest (sometimes brutal) feedback

## 📬 Contact

**Arnav Gautam**
- GitHub: [@arnavgautam0209](https://github.com/arnavgautam0209)
- Email: Feel free to reach out if you have questions!

---

Made with ❤️ and way too much coffee by Arnav

P.S. If you're reading this, you're awesome for checking out the README! Most people don't 😄

---

## 🔧 Technical Details (for the nerds)

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
