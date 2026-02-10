/* ============================================
   flaviusmiron.com — Terminal Engine
   Zero dependencies. Pure JavaScript.
   ============================================ */

(function () {
  'use strict';

  const output = document.getElementById('output');
  const input = document.getElementById('input');
  const screen = document.getElementById('screen');
  const inputWrapper = input.parentElement;

  let commandHistory = [];
  let historyIndex = -1;
  let isBooting = true;

  // ============================================
  // Utilities
  // ============================================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function appendToOutput(html) {
    output.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function scrollToBottom() {
    screen.scrollTop = screen.scrollHeight;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Update cursor position to follow input text
  function updateCursorPosition() {
    const textWidth = getTextWidth(input.value, getComputedStyle(input).font);
    const selStart = input.selectionStart || input.value.length;
    const textBeforeCursor = input.value.substring(0, selStart);
    const cursorOffset = getTextWidth(textBeforeCursor, getComputedStyle(input).font);
    inputWrapper.style.setProperty('--cursor-left', cursorOffset + 'px');
    inputWrapper.querySelector(':scope')?.parentElement;
    // Update the ::after pseudo-element position via CSS variable
    inputWrapper.style.cssText = `--cursor-offset: ${cursorOffset}px`;
  }

  function getTextWidth(text, font) {
    const canvas = getTextWidth._canvas || (getTextWidth._canvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d');
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  // Override cursor positioning with style
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `.input-wrapper::after { left: var(--cursor-offset, 0px) !important; }`;
  document.head.appendChild(cursorStyle);

  // ============================================
  // Boot Sequence
  // ============================================

  const bootLines = [
    { text: 'Booting flaviusmiron.com...', class: 'boot-text', delay: 80 },
    { text: 'Loading kernel modules.............. ', class: 'boot-text', suffix: '<span class="boot-ok">OK</span>', delay: 100 },
    { text: 'Initializing neural interface....... ', class: 'boot-text', suffix: '<span class="boot-ok">OK</span>', delay: 80 },
    { text: 'Establishing connection............. ', class: 'boot-text', suffix: '<span class="boot-ok">OK</span>', delay: 100 },
    { text: '', class: '', delay: 80 },
    { text: 'Welcome to flaviusmiron.com', class: 'boot-welcome', delay: 60 },
  ];

  async function typeText(container, text, charDelay) {
    for (let i = 0; i < text.length; i++) {
      container.textContent += text[i];
      scrollToBottom();
      // Vary timing for realism
      const jitter = charDelay + (Math.random() - 0.5) * charDelay * 0.6;
      await sleep(Math.max(3, jitter));
    }
  }

  async function runBootSequence() {
    input.disabled = true;

    for (const line of bootLines) {
      if (line.text === '') {
        appendToOutput('<div class="line">&nbsp;</div>');
        await sleep(line.delay);
        continue;
      }

      const div = document.createElement('div');
      div.className = `line ${line.class}`;
      output.appendChild(div);

      await typeText(div, line.text, 6);

      if (line.suffix) {
        div.insertAdjacentHTML('beforeend', line.suffix);
        scrollToBottom();
      }

      await sleep(line.delay);
    }

    // Show neofetch after welcome
    appendToOutput(commands.neofetch());
    appendToOutput('<div class="line">&nbsp;</div>');
    appendToOutput('<div class="line boot-hint">Type \'help\' to see available commands.</div>');
    appendToOutput('<div class="line">&nbsp;</div>');

    isBooting = false;
    input.disabled = false;
    input.focus();
  }

  // ============================================
  // Command Handlers
  // ============================================

  const commands = {};

  commands.help = function () {
    const cmds = [
      ['help', 'Show this help message'],
      ['whoami / about', 'Who is Flavius?'],
      ['experience / work', 'Work history & timeline'],
      ['skills', 'Technical skills & tools'],
      ['projects', 'Project showcase'],
      ['education', 'Education history'],
      ['contact', 'Get in touch'],
      ['neofetch', 'System info (the fun way)'],
      ['clear', 'Clear the terminal'],
      ['ls', 'List files in current directory'],
      ['cat &lt;file&gt;', 'View file contents'],
      ['pwd', 'Print working directory'],
      ['date', 'Show current date & time'],
      ['echo &lt;text&gt;', 'Echo text back'],
    ];

    let html = '<div class="line section-header">Available Commands</div>';
    html += '<div class="line dim">─────────────────────────────────────────</div>';
    for (const [cmd, desc] of cmds) {
      html += `<div class="help-row"><span class="help-cmd">${cmd}</span><span class="help-desc dim">${desc}</span></div>`;
    }
    html += '<div class="line dim">Tip: Use ↑↓ for history, Tab for autocomplete</div>';
    return html;
  };

  commands.whoami = commands.about = function () {
    return `
<div class="line section-header">$ whoami</div>
<div class="output-block">
<div class="line bright">Flavius Miron</div>
<div class="line amber">Product Engineer & Technical Co-founder at Waveful</div>
<div class="line dim">Top 10 Claude Code power user</div>
<div class="line">Based in <span class="cyan">San Francisco</span> & <span class="cyan">Milan, Italy</span>.</div>
<div class="line">I scale products from zero to millions — Waveful went from</div>
<div class="line"><span class="amber">78K → 4.5M users</span> and <span class="amber">$1K → $50K ARR/month</span> under my lead.</div>
<div class="line">I built <span class="bright">Waveful App 2.0</span> from scratch in <span class="green">under one month</span>.</div>
<div class="line">I believe in shipping fast, building with AI, and keeping things simple.</div>
</div>`;
  };

  commands.experience = commands.work = function () {
    return `
<div class="line section-header">$ experience</div>
<div class="timeline-entry">
  <div class="role">Technical Co-founder & Product Engineer</div>
  <div class="company bright">Waveful</div>
  <div class="date">2022 – Present</div>
  <div class="detail">• Built Waveful 2.0 from scratch in under 1 month</div>
  <div class="detail">• Scaled from 78K to <span class="amber">4.5M users</span></div>
  <div class="detail">• Grew revenue from $1K to <span class="amber">$50K ARR/month</span></div>
  <div class="detail">• Led architecture, CI/CD, analytics (Mixpanel)</div>
  <div class="detail">• Flutter/Dart mobile development, Firebase backend</div>
</div>
<div class="timeline-entry">
  <div class="role">Full Stack Developer</div>
  <div class="company bright">Conferinta Europeana</div>
  <div class="date">2023 – 2024</div>
  <div class="detail">• Built event management platform</div>
  <div class="detail">• React, Node.js, Firebase stack</div>
</div>
<div class="timeline-entry">
  <div class="role">Software Engineer Intern</div>
  <div class="company bright">SORINT.lab</div>
  <div class="date">2022</div>
  <div class="detail">• Enterprise Java/Kotlin projects</div>
  <div class="detail">• CI/CD pipelines & Docker</div>
</div>
<div class="timeline-entry">
  <div class="role">Web Developer Intern</div>
  <div class="company bright">Aicod</div>
  <div class="date">2021</div>
  <div class="detail">• PHP/WordPress development</div>
  <div class="detail">• Client-facing web projects</div>
</div>`;
  };

  commands.skills = function () {
    function tags(items, color) {
      return items.map(i => `<span class="tag" style="border-color:${color};color:${color}">${i}</span>`).join('');
    }

    return `
<div class="line section-header">$ skills</div>
<div class="line amber">Languages</div>
<div class="line">${tags(['Flutter/Dart', 'Kotlin', 'Python', 'JavaScript', 'HTML/CSS', 'PHP'], '#67e8f9')}</div>
<div class="line amber">Frameworks</div>
<div class="line">${tags(['React', 'Bootstrap'], '#c084fc')}</div>
<div class="line amber">Tools & Platforms</div>
<div class="line">${tags(['CI/CD', 'Git', 'Figma', 'Linux', 'Docker', 'Gradle', 'Firebase', 'Mixpanel'], '#4ade80')}</div>
<div class="line amber">Principles</div>
<div class="line">${tags(['SOLID', 'DDD', 'Clean Architecture', 'Ship Fast'], '#ffb627')}</div>`;
  };

  commands.projects = function () {
    return `
<div class="line section-header">$ projects</div>
<div class="project">
  <div class="project-name">Waveful</div>
  <div class="project-desc">Creator social network for building meaningful connections</div>
  <div class="project-stat amber">4.5M users • $50K ARR/month • Built 2.0 from scratch</div>
</div>
<div class="project">
  <div class="project-name">Lune</div>
  <div class="project-desc">Work shift calendar app for managing schedules</div>
  <div class="project-stat">1000+ downloads • 60 DAU</div>
</div>
<div class="project">
  <div class="project-name">flaviusmiron.com <span class="dim">(this website)</span></div>
  <div class="project-desc">Interactive terminal portfolio</div>
  <div class="project-stat green">0 dependencies • Just HTML, CSS & JS • Built with Claude Code</div>
</div>`;
  };

  commands.education = function () {
    return `
<div class="line section-header">$ education</div>
<div class="timeline-entry">
  <div class="role">Higher Technical Diploma — Software Development</div>
  <div class="company bright">ITS ICT Piemonte</div>
  <div class="date">2020 – 2022</div>
</div>
<div class="timeline-entry">
  <div class="role">Technical Diploma — Computer Science</div>
  <div class="company bright">ITIS Pininfarina</div>
  <div class="date">2015 – 2020</div>
</div>`;
  };

  commands.contact = function () {
    return `
<div class="line section-header">$ contact</div>
<div class="output-block">
<div class="line"><span class="amber">Email</span>    <a href="mailto:flaviusmironcatalin@gmail.com" target="_blank">flaviusmironcatalin@gmail.com</a></div>
<div class="line"><span class="amber">GitHub</span>   <a href="https://github.com/xFlaviews" target="_blank" rel="noopener">github.com/xFlaviews</a></div>
<div class="line"><span class="amber">Phone</span>    <a href="tel:+393806397797">+39 380 639 7797</a></div>
</div>`;
  };

  commands.neofetch = function () {
    const ascii = `        __ _             _
       / _| | __ ___   _(_)_   _ ___
      | |_| |/ _\` \\ \\ / / | | | / __|
      |  _| | (_| |\\ V /| | |_| \\__ \\
      |_| |_|\\__,_| \\_/ |_|\\__,_|___/`;

    const info = [
      ['OS', 'FounderOS 2.0'],
      ['Host', 'San Francisco / Milan'],
      ['Kernel', 'Ship fast, keep it simple'],
      ['Shell', 'Claude Code + whatever ships'],
      ['Packages', 'Mixpanel, Sentry, Firebase, Docker'],
      ['CPU', 'Caffeine-powered since 2020'],
      ['Memory', '5+ years engineering'],
      ['Uptime', 'Always shipping'],
    ];

    const infoHtml = info.map(([label, value]) =>
      `<div><span class="label">${label.padEnd(14)}</span><span class="value">${escapeHtml(value)}</span></div>`
    ).join('');

    return `
<div class="neofetch">
  <pre class="neofetch-ascii">${escapeHtml(ascii)}</pre>
  <div class="neofetch-info">${infoHtml}</div>
</div>`;
  };

  commands.clear = function () {
    output.innerHTML = '';
    return null;
  };

  commands.ls = function () {
    return `
<div class="line"><span class="cyan">about.txt</span>      <span class="cyan">experience.log</span>   <span class="cyan">skills.json</span></div>
<div class="line"><span class="blue">projects/</span>      <span class="green">contact.sh</span>        <span class="cyan">education.txt</span></div>`;
  };

  commands.cat = function (args) {
    if (!args || args.length === 0) {
      return '<div class="line error">cat: missing file operand</div>';
    }

    const file = args[0].replace(/^\.\//, '');
    const fileMap = {
      'about.txt': 'whoami',
      'experience.log': 'experience',
      'skills.json': 'skills',
      'projects': 'projects',
      'projects/': 'projects',
      'contact.sh': 'contact',
      'education.txt': 'education',
    };

    const mapped = fileMap[file];
    if (mapped && commands[mapped]) {
      return commands[mapped]();
    }

    return `<div class="line error">cat: ${escapeHtml(file)}: No such file or directory</div>`;
  };

  commands.pwd = function () {
    return '<div class="line">/home/flavius/portfolio</div>';
  };

  commands.date = function () {
    const now = new Date();
    return `<div class="line">${escapeHtml(now.toString())}</div>`;
  };

  commands.echo = function (args) {
    if (!args || args.length === 0) return '<div class="line">&nbsp;</div>';
    return `<div class="line">${escapeHtml(args.join(' '))}</div>`;
  };

  // ============================================
  // Easter Eggs
  // ============================================

  const easterEggs = {
    'sudo hire me': '<div class="line green">Permission granted. Sending offer letter... ✓ Check your inbox.</div>',
    'rm -rf /': '<div class="line purple">This terminal is sandboxed. Just like my Claude Code sessions.</div>',
    'rm -rf': '<div class="line purple">This terminal is sandboxed. Just like my Claude Code sessions.</div>',
    'vim': '<div class="line purple">You\'ve entered vim. Good luck getting out. (Type \'q\' to escape)</div>',
    'q': '<div class="line dim">You escaped vim! Not everyone can say that.</div>',
    'claude': '<div class="line purple">Yes, Claude Code helped build this site. And yes, the irony is intentional.</div>',
    'exit': '<div class="line purple">You can check out any time you like, but you can never leave.</div>',
    'cd ..': '<div class="line error">Permission denied. There\'s nothing above this. This is the root of everything.</div>',
    'cd': '<div class="line dim">Already home.</div>',
    'curl': '<div class="line purple">Why curl when you can just... be here?</div>',
    'npm install': '<div class="line purple">No node_modules were harmed in the making of this website.</div>',
    'pip install': '<div class="line purple">This site runs on 0 dependencies. Refreshing, isn\'t it?</div>',
    'npm': '<div class="line purple">No node_modules were harmed in the making of this website.</div>',
    'node': '<div class="line dim">Node? We don\'t need no stinking Node.</div>',
    'python': '<div class="line dim">🐍 import flavius; flavius.hire()</div>',
    'git status': '<div class="line green">On branch main. Everything committed. Everything shipped.</div>',
    'git push': '<div class="line green">Already deployed. Cloudflare Pages is fast like that.</div>',
    'man': '<div class="line dim">RTFM? This IS the manual. Type \'help\'.</div>',
    'whoami': null, // Handled by commands
    'hackertyper': '<div class="line purple">You\'re already hacking. Look at you go.</div>',
  };

  // ============================================
  // Command Execution
  // ============================================

  function executeCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Add command echo
    appendToOutput(
      `<div class="line"><span class="prompt-echo">visitor@flavius <span class="blue">~</span> $ </span><span class="command-echo">${escapeHtml(trimmed)}</span></div>`
    );

    // Add to history
    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const lower = trimmed.toLowerCase();

    // Check easter eggs (exact match first)
    if (easterEggs[lower] !== undefined && easterEggs[lower] !== null) {
      appendToOutput(easterEggs[lower]);
      return;
    }

    // Check sudo pattern
    if (lower.startsWith('sudo ') && lower !== 'sudo hire me') {
      appendToOutput('<div class="line red">Nice try. You don\'t have root access here.</div>');
      return;
    }

    // Parse command and args
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check commands map
    if (commands[cmd]) {
      const result = commands[cmd](args);
      if (result) {
        appendToOutput(result);
      }
      return;
    }

    // Check easter eggs by first word
    if (easterEggs[cmd] !== undefined && easterEggs[cmd] !== null) {
      appendToOutput(easterEggs[cmd]);
      return;
    }

    // Unknown command
    appendToOutput(
      `<div class="line error">command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.</div>`
    );
  }

  // ============================================
  // Tab Completion
  // ============================================

  const completableCommands = [
    'help', 'whoami', 'about', 'experience', 'work', 'skills',
    'projects', 'education', 'contact', 'neofetch', 'clear',
    'ls', 'cat', 'pwd', 'date', 'echo',
  ];

  const completableFiles = [
    'about.txt', 'experience.log', 'skills.json', 'projects/', 'contact.sh', 'education.txt',
  ];

  function tabComplete(value) {
    const parts = value.split(/\s+/);

    if (parts.length <= 1) {
      // Complete command name
      const partial = parts[0].toLowerCase();
      if (!partial) return value;

      const matches = completableCommands.filter(c => c.startsWith(partial));
      if (matches.length === 1) {
        return matches[0];
      }
      return value;
    }

    // Complete file name for cat
    if (parts[0].toLowerCase() === 'cat' && parts.length === 2) {
      const partial = parts[1].toLowerCase();
      const matches = completableFiles.filter(f => f.toLowerCase().startsWith(partial));
      if (matches.length === 1) {
        return parts[0] + ' ' + matches[0];
      }
    }

    return value;
  }

  // ============================================
  // Input Handling
  // ============================================

  input.addEventListener('keydown', function (e) {
    if (isBooting) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const value = input.value;
      input.value = '';
      updateCursorPosition();
      executeCommand(value);
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      input.value = tabComplete(input.value);
      updateCursorPosition();
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
        updateCursorPosition();
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
      updateCursorPosition();
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      commands.clear();
    }
  });

  input.addEventListener('input', function () {
    updateCursorPosition();
    inputWrapper.classList.add('typing');
    clearTimeout(input._typingTimeout);
    input._typingTimeout = setTimeout(() => {
      inputWrapper.classList.remove('typing');
    }, 150);
  });

  // Click anywhere to focus input
  document.getElementById('terminal').addEventListener('click', function (e) {
    if (e.target.tagName !== 'A') {
      input.focus();
    }
  });

  // Mobile: tap to focus
  document.getElementById('screen').addEventListener('touchstart', function (e) {
    if (e.target.tagName !== 'A') {
      input.focus();
    }
  });

  // ============================================
  // Traffic Light Dot Handlers
  // ============================================

  const terminal = document.getElementById('terminal');

  // Red dot — shutdown and reload
  document.querySelector('.dot.red').addEventListener('click', function (e) {
    e.stopPropagation();
    appendToOutput('<div class="line red">Shutting down...</div>');
    setTimeout(function () {
      location.reload();
    }, 1500);
  });

  // Yellow dot — minimize / restore
  document.querySelector('.dot.yellow').addEventListener('click', function (e) {
    e.stopPropagation();
    terminal.classList.toggle('minimized');
  });

  // Green dot — fullscreen toggle
  document.querySelector('.dot.green').addEventListener('click', function (e) {
    e.stopPropagation();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      terminal.requestFullscreen().catch(function () {
        // Fallback: toggle CSS fullscreen class
        terminal.classList.toggle('fullscreen');
      });
    }
  });

  // Sync CSS class when exiting fullscreen via Escape key
  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
      terminal.classList.remove('fullscreen');
    }
  });

  // ============================================
  // Initialize
  // ============================================

  runBootSequence();

})();
